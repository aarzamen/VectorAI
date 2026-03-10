import React, { useRef, useEffect, useState } from "react";
import { useDocumentStore, CanvasElement } from "../store/documentStore";

export function Canvas() {
  const {
    elements,
    layers,
    zoom,
    pan,
    setPan,
    setZoom,
    selectElements,
    selectedElementIds,
    updateElement,
    activeTool,
    addElement,
  } = useDocumentStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [pointers, setPointers] = useState<
    Map<number, { x: number; y: number }>
  >(new Map());
  const [initialPinchDist, setInitialPinchDist] = useState<number | null>(null);
  const [initialPinchZoom, setInitialPinchZoom] = useState<number | null>(null);

  // Helper to get canvas coordinates from screen coordinates
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  };

  // Handle touch and mouse events for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return; // Only left click or touch

    const newPointers = new Map(pointers);
    newPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setPointers(newPointers);

    if (newPointers.size === 2) {
      // Start pinch zoom
      const pts = Array.from(newPointers.values()) as {
        x: number;
        y: number;
      }[];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      setInitialPinchDist(dist);
      setInitialPinchZoom(zoom);
      setIsDragging(false);
      setIsDraggingElement(false);
      setIsDrawing(false);
      return;
    }

    if (activeTool === "pen") {
      setIsDrawing(true);
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const id = crypto.randomUUID();
      setCurrentPathId(id);
      addElement({
        id,
        type: "path",
        x: 0,
        y: 0,
        rotation: 0,
        fill: "transparent",
        stroke: "#ffffff",
        strokeWidth: 2,
        opacity: 1,
        pathData: `M ${coords.x} ${coords.y}`,
      });
      return;
    }

    // If clicking on an element, we might want to drag it instead of panning
    const target = e.target as SVGElement;
    if (
      target !== e.currentTarget &&
      target.tagName !== "svg" &&
      target.tagName !== "rect"
    ) {
      const elementId = target.getAttribute('data-id');
      if (elementId) {
        setDraggedElementId(elementId);
        if (!selectedElementIds.includes(elementId)) {
          selectElements([elementId]);
        }
      } else if (selectedElementIds.length > 0) {
        setDraggedElementId(selectedElementIds[0]);
      }
      setIsDraggingElement(true);
    } else {
      setIsDragging(true);
      selectElements([]);
    }
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointers.has(e.pointerId)) {
      const newPointers = new Map(pointers);
      newPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      setPointers(newPointers);

      if (
        newPointers.size === 2 &&
        initialPinchDist !== null &&
        initialPinchZoom !== null
      ) {
        // Handle pinch zoom
        const pts = Array.from(newPointers.values()) as {
          x: number;
          y: number;
        }[];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const scale = dist / initialPinchDist;
        const newZoom = Math.max(0.1, Math.min(10, initialPinchZoom * scale));

        // Zoom towards center of pinch
        const centerX = (pts[0].x + pts[1].x) / 2;
        const centerY = (pts[0].y + pts[1].y) / 2;

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const mouseX = centerX - rect.left;
          const mouseY = centerY - rect.top;

          const dx = (mouseX - pan.x) * (newZoom / zoom - 1);
          const dy = (mouseY - pan.y) * (newZoom / zoom - 1);

          setPan({ x: pan.x - dx, y: pan.y - dy });
        }

        setZoom(newZoom);
        return;
      }
    }

    if (isDrawing && currentPathId) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const el = elements[currentPathId];
      if (el && el.type === "path") {
        updateElement(currentPathId, {
          pathData: `${el.pathData} L ${coords.x} ${coords.y}`,
        });
      }
      return;
    }

    if (!isDragging && !isDraggingElement) return;

    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;

    if (isDragging) {
      setPan({ x: pan.x + dx, y: pan.y + dy });
    } else if (isDraggingElement && draggedElementId) {
      // Drag selected elements
      const id = draggedElementId;
      const el = elements[id];
      if (el) {
        updateElement(id, { x: el.x + dx / zoom, y: el.y + dy / zoom });
      }
    }

    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const newPointers = new Map(pointers);
    newPointers.delete(e.pointerId);
    setPointers(newPointers);

    if (newPointers.size < 2) {
      setInitialPinchDist(null);
      setInitialPinchZoom(null);
    }

    if (newPointers.size === 0) {
      setIsDragging(false);
      setIsDraggingElement(false);
      setDraggedElementId(null);
      setIsDrawing(false);
      setCurrentPathId(null);
    }
  };

  // Render elements
  const renderElement = (element: CanvasElement, isLocked: boolean) => {
    const isSelected = selectedElementIds.includes(element.id);
    const commonProps = {
      key: element.id,
      'data-id': element.id,
      transform: `translate(${element.x}, ${element.y}) rotate(${element.rotation})`,
      fill: element.fill,
      stroke: isSelected ? "#3b82f6" : element.stroke, // Highlight if selected
      strokeWidth: isSelected
        ? Math.max(2 / zoom, element.strokeWidth)
        : element.strokeWidth,
      opacity: element.opacity,
      onClick: (e: React.MouseEvent) => {
        if (isLocked) return;
        e.stopPropagation();
        selectElements([element.id]);
      },
      className: `${isLocked ? 'cursor-default' : 'cursor-pointer'} transition-colors duration-150`,
    };

    switch (element.type) {
      case "path":
        return <path d={element.pathData} {...commonProps} />;
      case "rect":
        return (
          <rect
            width={element.width}
            height={element.height}
            rx={element.rx}
            ry={element.ry}
            {...commonProps}
          />
        );
      case "circle":
        return <circle r={element.radius} {...commonProps} />;
      case "text":
        return (
          <text
            fontSize={element.fontSize}
            fontFamily={element.fontFamily}
            fontWeight={element.fontWeight}
            {...commonProps}
          >
            {element.text}
          </text>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        // Zoom
        const zoomFactor = 0.01;
        const newZoom = Math.max(
          0.1,
          Math.min(10, zoom - e.deltaY * zoomFactor),
        );

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const dx = (mouseX - pan.x) * (newZoom / zoom - 1);
        const dy = (mouseY - pan.y) * (newZoom / zoom - 1);

        setPan({ x: pan.x - dx, y: pan.y - dy });
        setZoom(newZoom);
      } else {
        // Pan
        setPan({ x: pan.x - e.deltaX, y: pan.y - e.deltaY });
      }
    };

    container.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleNativeWheel);
  }, [zoom, pan, setPan, setZoom]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-zinc-900 overflow-hidden touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect
          width="10000"
          height="10000"
          x="-5000"
          y="-5000"
          fill="url(#grid)"
        />

        {layers.map(
          (layer) =>
            layer.visible && (
              <g key={layer.id} opacity={layer.locked ? 0.5 : 1}>
                {layer.elementIds.map((id) => {
                  const el = elements[id];
                  return el ? renderElement(el, layer.locked) : null;
                })}
              </g>
            ),
        )}
      </svg>
    </div>
  );
}
