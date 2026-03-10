import React, { useState } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { Eye, EyeOff, Lock, Unlock, Trash2, Plus, ChevronUp, ChevronDown, MoveRight } from 'lucide-react';

export function LayersPanel() {
  const { 
    layers, 
    elements, 
    selectElements, 
    selectedElementIds, 
    deleteElements, 
    updateLayer,
    addLayer,
    deleteLayer,
    activeLayerId,
    setActiveLayer,
    reorderLayer,
    reorderElement,
    moveElementToLayer
  } = useDocumentStore();

  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleRenameStart = (id: string, currentName: string) => {
    setEditingLayerId(id);
    setEditingName(currentName);
  };

  const handleRenameSubmit = (id: string) => {
    if (editingName.trim()) {
      updateLayer(id, { name: editingName.trim() });
    }
    setEditingLayerId(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(id);
    } else if (e.key === 'Escape') {
      setEditingLayerId(null);
    }
  };

  return (
    <div className="absolute left-4 top-20 w-72 bg-zinc-800/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-zinc-700/50 z-50 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Layers</h3>
        <button 
          onClick={() => addLayer(`Layer ${layers.length + 1}`)}
          className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          title="New Layer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
        {[...layers].reverse().map(layer => {
          const isLayerActive = layer.id === activeLayerId;
          
          return (
            <div key={layer.id} className="flex flex-col gap-1">
              <div 
                onClick={() => setActiveLayer(layer.id)}
                onDoubleClick={() => handleRenameStart(layer.id, layer.name)}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                  isLayerActive 
                    ? 'bg-blue-600/20 border-blue-500/50' 
                    : 'bg-zinc-900/50 border-zinc-700/50 hover:bg-zinc-800'
                }`}
              >
                {editingLayerId === layer.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleRenameSubmit(layer.id)}
                    onKeyDown={(e) => handleRenameKeyDown(e, layer.id)}
                    className="flex-1 bg-zinc-900 border border-blue-500 rounded px-1 text-sm text-blue-100 outline-none w-20"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className={`text-sm font-medium truncate flex-1 ${isLayerActive ? 'text-blue-100' : 'text-zinc-300'}`}>
                    {layer.name}
                  </span>
                )}
                <div className="flex items-center gap-1 ml-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); reorderLayer(layer.id, 'up'); }}
                    className="p-1 text-zinc-500 hover:text-zinc-300"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); reorderLayer(layer.id, 'down'); }}
                    className="p-1 text-zinc-500 hover:text-zinc-300"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-3 bg-zinc-700 mx-0.5" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                    className="p-1 text-zinc-500 hover:text-zinc-300"
                  >
                    {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                    className="p-1 text-zinc-500 hover:text-zinc-300"
                  >
                    {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                  {layers.length > 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                      className="p-1 text-red-400 hover:bg-red-400/20 rounded ml-0.5"
                      title="Delete Layer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              
              {layer.elementIds.length > 0 && (
                <div className="flex flex-col gap-1 pl-4 mt-1">
                  {[...layer.elementIds].reverse().map(id => {
                    const el = elements[id];
                    if (!el) return null;
                    const isSelected = selectedElementIds.includes(id);
                    
                    return (
                      <div 
                        key={id}
                        onClick={() => selectElements([id])}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-600/20 border border-blue-500/50 text-blue-100' : 'hover:bg-zinc-700/30 text-zinc-400'
                        }`}
                      >
                        <span className="text-xs capitalize">{el.type}</span>
                        <div className="flex items-center gap-1">
                          {isSelected && (
                            <>
                              <button 
                                onClick={(e) => { e.stopPropagation(); reorderElement(id, 'up'); }}
                                className="p-1 text-zinc-500 hover:text-zinc-300"
                                title="Bring Forward"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); reorderElement(id, 'down'); }}
                                className="p-1 text-zinc-500 hover:text-zinc-300"
                                title="Send Backward"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              {activeLayerId && activeLayerId !== layer.id && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveElementToLayer(id, activeLayerId); }}
                                  className="p-1 text-zinc-500 hover:text-zinc-300"
                                  title="Move to Active Layer"
                                >
                                  <MoveRight className="w-3 h-3" />
                                </button>
                              )}
                              <div className="w-px h-3 bg-zinc-700 mx-0.5" />
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteElements([id]);
                                }}
                                className="p-1 text-red-400 hover:bg-red-400/20 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
