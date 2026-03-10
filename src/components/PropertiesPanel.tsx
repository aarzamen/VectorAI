import React from 'react';
import { useDocumentStore } from '../store/documentStore';
import { Trash2 } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

export function PropertiesPanel() {
  const { selectedElementIds, elements, updateElement, deleteElements, selectElements } = useDocumentStore();

  if (selectedElementIds.length === 0) return null;

  const selectedElement = elements[selectedElementIds[0]];
  if (!selectedElement) return null;

  const handleChange = (key: string, value: any) => {
    updateElement(selectedElement.id, { [key]: value });
  };

  const handleDelete = () => {
    deleteElements(selectedElementIds);
    selectElements([]);
  };

  return (
    <div className="absolute right-4 top-20 w-64 bg-zinc-800/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-zinc-700/50 z-50 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Properties</h3>
        <button onClick={handleDelete} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">X</label>
          <input 
            type="number" 
            value={Math.round(selectedElement.x)} 
            onChange={(e) => handleChange('x', Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-zinc-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Y</label>
          <input 
            type="number" 
            value={Math.round(selectedElement.y)} 
            onChange={(e) => handleChange('y', Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-zinc-100"
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
        <label className="text-xs text-zinc-500">Stroke Width</label>
        <input 
          type="range" 
          min="0" 
          max="20" 
          value={selectedElement.strokeWidth} 
          onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}
