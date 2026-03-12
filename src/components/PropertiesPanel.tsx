import React, { useRef, useState } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { Trash2, X } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

export function PropertiesPanel() {
  const { selectedElementIds, elements, updateElement, deleteElements, selectElements, showPropertiesPanel, setShowPropertiesPanel } = useDocumentStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  if (selectedElementIds.length === 0 || !showPropertiesPanel) return null;

  const selectedElement = elements[selectedElementIds[0]];
  if (!selectedElement) return null;

  const handleChange = (key: string, value: number | string) => {
    updateElement(selectedElement.id, { [key]: value });
  };

  const handleDelete = () => {
    deleteElements(selectedElementIds);
    selectElements([]);
  };

  const handleDismiss = () => {
    selectElements([]);
    setShowPropertiesPanel(false);
  };

  // Swipe-down to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY === null) return;
    const dy = e.touches[0].clientY - dragStartY;
    if (dy > 0) {
      setDragOffset(dy);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > 80) {
      handleDismiss();
    }
    setDragStartY(null);
    setDragOffset(0);
  };

  return (
    <div
      ref={panelRef}
      className="absolute left-4 right-4 bottom-[calc(max(0.5rem,env(safe-area-inset-bottom))+4.5rem)] md:bottom-auto md:top-20 md:left-auto md:right-4 md:w-64 bg-claude-surface/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-claude-border/50 z-40 flex flex-col gap-3 max-h-[40vh] md:max-h-[80vh] overflow-y-auto transition-transform duration-150"
      style={{ transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined, opacity: dragOffset > 0 ? Math.max(0.3, 1 - dragOffset / 200) : 1 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe handle */}
      <div className="flex justify-center md:hidden -mt-1 mb-1">
        <div className="w-8 h-1 rounded-full bg-claude-border-light" />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-claude-text-muted uppercase tracking-wider">Properties</h3>
        <div className="flex items-center gap-1">
          <button onClick={handleDelete} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDismiss} className="p-1.5 text-claude-text-muted hover:bg-claude-surface-hover rounded-lg transition-colors" title="Close">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* X/Y inline: label and input side by side */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-claude-text-dim shrink-0 w-3">X</label>
          <input
            type="number"
            value={Math.round(selectedElement.x)}
            onChange={(e) => handleChange('x', Number(e.target.value))}
            className="bg-claude-bg border border-claude-border rounded-lg px-2 py-1 text-sm text-claude-text w-full min-w-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-claude-text-dim shrink-0 w-3">Y</label>
          <input
            type="number"
            value={Math.round(selectedElement.y)}
            onChange={(e) => handleChange('y', Number(e.target.value))}
            className="bg-claude-bg border border-claude-border rounded-lg px-2 py-1 text-sm text-claude-text w-full min-w-0"
          />
        </div>
      </div>

      <ColorPicker
        label="Fill"
        color={selectedElement.fill}
        onChange={(color) => handleChange('fill', color)}
      />

      <ColorPicker
        label="Stroke"
        color={selectedElement.stroke}
        onChange={(color) => handleChange('stroke', color)}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs text-claude-text-dim">Stroke Width</label>
        <input
          type="range"
          min="0"
          max="20"
          value={selectedElement.strokeWidth}
          onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
          className="w-full accent-claude-terracotta"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-claude-text-dim">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={selectedElement.opacity}
          onChange={(e) => handleChange('opacity', Number(e.target.value))}
          className="w-full accent-claude-terracotta"
        />
      </div>
    </div>
  );
}
