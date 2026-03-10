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
    <div className="absolute left-4 right-4 top-[calc(max(1rem,env(safe-area-inset-top))+3.5rem)] md:top-16 md:right-auto md:w-72 bg-claude-surface/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-claude-border/50 z-40 flex flex-col gap-4 max-h-[40vh] md:max-h-[60vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-claude-text-muted uppercase tracking-wider">Layers</h3>
        <button
          onClick={() => addLayer(`Layer ${layers.length + 1}`)}
          className="p-1.5 bg-claude-terracotta hover:bg-claude-terracotta-light text-white rounded-lg transition-colors"
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
                    ? 'bg-claude-selected border-claude-selected-border'
                    : 'bg-claude-bg/50 border-claude-border/50 hover:bg-claude-surface-hover'
                }`}
              >
                {editingLayerId === layer.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleRenameSubmit(layer.id)}
                    onKeyDown={(e) => handleRenameKeyDown(e, layer.id)}
                    className="flex-1 bg-claude-bg border border-claude-terracotta rounded px-1 text-sm text-claude-text outline-none w-20"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className={`text-sm font-medium truncate flex-1 ${isLayerActive ? 'text-claude-terracotta-light' : 'text-claude-text-muted'}`}>
                    {layer.name}
                  </span>
                )}
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); reorderLayer(layer.id, 'up'); }}
                    className="p-1 text-claude-text-dim hover:text-claude-text-muted"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); reorderLayer(layer.id, 'down'); }}
                    className="p-1 text-claude-text-dim hover:text-claude-text-muted"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-3 bg-claude-border mx-0.5" />
                  <button
                    onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                    className="p-1 text-claude-text-dim hover:text-claude-text-muted"
                  >
                    {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                    className="p-1 text-claude-text-dim hover:text-claude-text-muted"
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
                          isSelected ? 'bg-claude-selected border border-claude-selected-border text-claude-terracotta-light' : 'hover:bg-claude-surface-hover text-claude-text-dim'
                        }`}
                      >
                        <span className="text-xs capitalize">{el.type}</span>
                        <div className="flex items-center gap-1">
                          {isSelected && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); reorderElement(id, 'up'); }}
                                className="p-1 text-claude-text-dim hover:text-claude-text-muted"
                                title="Bring Forward"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); reorderElement(id, 'down'); }}
                                className="p-1 text-claude-text-dim hover:text-claude-text-muted"
                                title="Send Backward"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              {activeLayerId && activeLayerId !== layer.id && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); moveElementToLayer(id, activeLayerId); }}
                                  className="p-1 text-claude-text-dim hover:text-claude-text-muted"
                                  title="Move to Active Layer"
                                >
                                  <MoveRight className="w-3 h-3" />
                                </button>
                              )}
                              <div className="w-px h-3 bg-claude-border mx-0.5" />
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
