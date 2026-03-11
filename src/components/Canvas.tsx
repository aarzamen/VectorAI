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
    width: canvasWidth,
    height: canvasHeight,
    setShowPropertiesPanel,
    pushHistory,
  } = useDocumentStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [currentLineId, setCurrentLineId] = useState<string | null>(null);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [pointers, setPointers] = useState<
    Map<number, { x: number; y: number }>
  >(new Map());
  const [initialPinchDist, setInitialPinchDist] = useState<number | null>(null);
  const [initialPinchZoom, setInitialPinchZoom] = useState<number | null>(null);

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    const newPointers = new Map(pointers);
    newPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setPointers(newPointers);

    if (newPointers.size === 2) {
      const pts = Array.from(newPointers.values()) as { x: number; y: number }[];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      setInitialPinchDist(dist);
      setInitialPinchZoom(zoom);
      setIsDragging(false);
      setIsDraggingElement(false);
      setIsDrawing(false);
      setIsDrawingLine(false);
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
        stroke: "#D97757",
        strokeWidth: 2,
        opacity: 1,
        pathData: `M ${coords.x} ${coords.y}`,
      });
      return;
    }

    if (activeTool === "line") {
      setIsDrawingLine(true);
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const id = crypto.randomUUID();
      setCurrentLineId(id);
      addElement({
        id,
        type: "line",
        x: coords.x,
        y: coords.y,
        x2: coords.x,
        y2: coords.y,
        rotation: 0,
        fill: "transparent",
        stroke: "#D97757",
        strokeWidth: 2,
        opacity: 1,
      });
      return;
    }

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
          setShowPropertiesPanel(true);
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
        const pts = Array.from(newPointers.values()) as { x: number; y: number }[];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const scale = dist / initialPinchDist;
        const newZoom = Math.max(0.1, Math.min(10, initialPinchZoom * scale));

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

    if (isDrawingLine && currentLineId) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      updateElement(currentLineId, { x2: coords.x, y2: coords.y } as Partial<CanvasElement>);
      return;
    }

    if (!isDragging && !isDraggingElement) return;

    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;

    if (isDragging) {
      setPan({ x: pan.x + dx, y: pan.y + dy });
    } else if (isDraggingElement && draggedElementId) {
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

    // Push history after drag/draw ends
    if (isDraggingElement || isDrawing || isDrawingLine) {
      pushHistory();
    }

    if (newPointers.size === 0) {
      setIsDragging(false);
      setIsDraggingElement(false);
      setDraggedElementId(null);
      setIsDrawing(false);
      setCurrentPathId(null);
      setIsDrawingLine(false);
      setCurrentLineId(null);
    }
  };

  const renderElement = (element: CanvasElement, isLocked: boolean) => {
    const isSelected = selectedElementIds.includes(element.id);
    const commonProps = {
      key: element.id,
      'data-id': element.id,
      transform: `translate(${element.x}, ${element.y}) rotate(${element.rotation})`,
      fill: element.fill,
      stroke: isSelected ? "#D97757" : element.stroke,
      strokeWidth: isSelected
        ? Math.max(2 / zoom, element.strokeWidth)
        : element.strokeWidth,
      opacity: element.opacity,
      onClick: (e: React.MouseEvent) => {
        if (isLocked) return;
        e.stopPropagation();
        selectElements([element.id]);
        setShowPropertiesPanel(true);
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
      case "line":
        return (
          <line
            x1={0}
            y1={0}
            x2={element.x2 - element.x}
            y2={element.y2 - element.y}
            {...commonProps}
            fill="none"
          />
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
        const zoomFactor = 0.01;
        const newZoom = Math.max(0.1, Math.min(10, zoom - e.deltaY * zoomFactor));
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dx = (mouseX - pan.x) * (newZoom / zoom - 1);
        const dy = (mouseY - pan.y) * (newZoom / zoom - 1);
        setPan({ x: pan.x - dx, y: pan.y - dy });
        setZoom(newZoom);
      } else {
        setPan({ x: pan.x - e.deltaX, y: pan.y - e.deltaY });
      }
    };

    container.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleNativeWheel);
  }, [zoom, pan, setPan, setZoom]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-claude-bg overflow-hidden touch-none"
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
          {/* Fine dot grid */}
          <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.5" fill="rgba(217,119,87,0.08)" />
          </pattern>
          {/* Line grid */}
          <pattern id="lineGrid" width="96" height="96" patternUnits="userSpaceOnUse">
            <rect width="96" height="96" fill="url(#dotGrid)" />
            <line x1="0" y1="0" x2="96" y2="0" stroke="rgba(217,119,87,0.06)" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="0" y2="96" stroke="rgba(217,119,87,0.06)" strokeWidth="0.5" />
          </pattern>
          {/* Major grid with crosses at intersections */}
          <pattern id="majorGrid" width="480" height="480" patternUnits="userSpaceOnUse">
            <rect width="480" height="480" fill="url(#lineGrid)" />
            <line x1="0" y1="0" x2="480" y2="0" stroke="rgba(217,119,87,0.1)" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="0" y2="480" stroke="rgba(217,119,87,0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Infinite grid background */}
        <rect width="20000" height="20000" x="-10000" y="-10000" fill="url(#majorGrid)" />

        {/* Canvas boundary - faint dotted outline, NOT a clipping mask */}
        <rect
          data-canvas-boundary="true"
          x="0"
          y="0"
          width={canvasWidth}
          height={canvasHeight}
          fill="none"
          stroke="rgba(217,119,87,0.25)"
          strokeWidth={1.5 / zoom}
          strokeDasharray={`${6 / zoom} ${4 / zoom}`}
          rx={4 / zoom}
          ry={4 / zoom}
        />

        {/* All elements render freely - no clipping */}
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
