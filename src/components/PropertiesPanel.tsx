import React from 'react';
import { useDocumentStore } from '../store/documentStore';
import { Trash2 } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

export function PropertiesPanel() {
  const { selectedElementIds, elements, updateElement, deleteElements, selectElements } = useDocumentStore();

  if (selectedElementIds.length === 0) return null;

  const selectedElement = elements[selectedElementIds[0]];
  if (!selectedElement) return null;

  const handleChange = (key: string, value: number | string) => {
    updateElement(selectedElement.id, { [key]: value });
  };

  const handleDelete = () => {
    deleteElements(selectedElementIds);
    selectElements([]);
  };

  return (
    <div className="absolute left-4 right-4 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+5rem)] md:bottom-auto md:top-20 md:left-auto md:right-4 md:w-64 bg-claude-surface/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-claude-border/50 z-40 flex flex-col gap-4 max-h-[40vh] md:max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-claude-text-muted uppercase tracking-wider">Properties</h3>
        <button onClick={handleDelete} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-claude-text-dim">X</label>
          <input
            type="number"
            value={Math.round(selectedElement.x)}
            onChange={(e) => handleChange('x', Number(e.target.value))}
            className="bg-claude-bg border border-claude-border rounded-lg px-2 py-1 text-sm text-claude-text"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-claude-text-dim">Y</label>
          <input
            type="number"
            value={Math.round(selectedElement.y)}
            onChange={(e) => handleChange('y', Number(e.target.value))}
            className="bg-claude-bg border border-claude-border rounded-lg px-2 py-1 text-sm text-claude-text"
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
