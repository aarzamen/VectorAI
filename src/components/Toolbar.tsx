import React, { useRef } from 'react';
import {
  MousePointer2,
  PenTool,
  Square,
  Circle as CircleIcon,
  Type as TypeIcon,
  Minus,
  Layers,
  LayoutTemplate,
  Upload,
  Undo2,
  Redo2,
  Save,
} from 'lucide-react';
import { useDocumentStore, ExcalidrawFile } from '../store/documentStore';

export function Toolbar() {
  const {
    addElement,
    activeTool,
    setActiveTool,
    showLayersPanel,
    setShowLayersPanel,
    showTemplatesPanel,
    setShowTemplatesPanel,
    setShowExportDialog,
    importFromExcalidraw,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDocument,
  } = useDocumentStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddRect = () => {
    setActiveTool('rect');
    addElement({
      id: crypto.randomUUID(),
      type: 'rect',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      fill: 'transparent',
      stroke: '#D97757',
      strokeWidth: 2,
      opacity: 1,
    });
  };

  const handleAddCircle = () => {
    setActiveTool('circle');
    addElement({
      id: crypto.randomUUID(),
      type: 'circle',
      x: 200,
      y: 200,
      radius: 50,
      rotation: 0,
      fill: 'transparent',
      stroke: '#D97757',
      strokeWidth: 2,
      opacity: 1,
    });
  };

  const handleAddText = () => {
    setActiveTool('text');
    addElement({
      id: crypto.randomUUID(),
      type: 'text',
      x: 300,
      y: 300,
      text: 'ClaudeCrayons',
      fontSize: 24,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      rotation: 0,
      fill: '#FAFAF9',
      stroke: 'transparent',
      strokeWidth: 0,
      opacity: 1,
    });
  };

  const handleImportExcalidraw = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ExcalidrawFile;
        if (data.type === 'excalidraw' && Array.isArray(data.elements)) {
          importFromExcalidraw(data);
        }
      } catch (err) {
        console.error('Failed to import Excalidraw file:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = async () => {
    await saveDocument();
  };

  const getToolBtnClass = (tool: string) =>
    `p-3 rounded-xl transition-all duration-150 shrink-0 ${
      activeTool === tool
        ? 'bg-claude-terracotta text-white shadow-lg shadow-claude-terracotta/25'
        : 'text-claude-text-muted hover:text-claude-text active:bg-claude-surface-hover'
    }`;

  const iconSize = 'w-6 h-6';

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".excalidraw,.json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top bar: branding + undo/redo */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="bg-claude-surface/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-2xl border border-claude-border/50 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-claude-terracotta flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-sm font-semibold text-claude-text tracking-tight">ClaudeCrayons</span>
        </div>

        <div className="bg-claude-surface/90 backdrop-blur-md rounded-xl shadow-2xl border border-claude-border/50 flex items-center">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2.5 rounded-l-xl text-claude-text-muted hover:text-claude-text disabled:opacity-30 disabled:hover:text-claude-text-muted transition-all"
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <div className="w-px h-5 bg-claude-border" />
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2.5 rounded-r-xl text-claude-text-muted hover:text-claude-text disabled:opacity-30 disabled:hover:text-claude-text-muted transition-all"
            title="Redo"
          >
            <Redo2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom toolbar - flush, no border, larger icons */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-claude-surface/95 backdrop-blur-md pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-center gap-1 px-2 py-1">
          <button onClick={() => setActiveTool('select')} className={getToolBtnClass('select')} title="Select">
            <MousePointer2 className={iconSize} />
          </button>
          <button onClick={() => setActiveTool('pen')} className={getToolBtnClass('pen')} title="Pen">
            <PenTool className={iconSize} />
          </button>
          <button onClick={handleAddRect} className={getToolBtnClass('rect')} title="Rectangle">
            <Square className={iconSize} />
          </button>
          <button onClick={handleAddCircle} className={getToolBtnClass('circle')} title="Circle">
            <CircleIcon className={iconSize} />
          </button>
          <button onClick={() => setActiveTool('line')} className={getToolBtnClass('line')} title="Line">
            <Minus className={iconSize} />
          </button>
          <button onClick={handleAddText} className={getToolBtnClass('text')} title="Text">
            <TypeIcon className={iconSize} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 px-2 pb-1">
          <button
            onClick={() => setShowLayersPanel(!showLayersPanel)}
            className={`p-2 rounded-xl transition-all duration-150 shrink-0 ${showLayersPanel ? 'text-claude-terracotta' : 'text-claude-text-dim hover:text-claude-text-muted'}`}
            title="Layers"
          >
            <Layers className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowTemplatesPanel(!showTemplatesPanel)}
            className={`p-2 rounded-xl transition-all duration-150 shrink-0 ${showTemplatesPanel ? 'text-claude-terracotta' : 'text-claude-text-dim hover:text-claude-text-muted'}`}
            title="Templates"
          >
            <LayoutTemplate className="w-5 h-5" />
          </button>
          <button onClick={handleImportExcalidraw} className="p-2 rounded-xl text-claude-text-dim hover:text-claude-text-muted transition-all shrink-0" title="Import">
            <Upload className="w-5 h-5" />
          </button>
          <button onClick={handleSave} className="p-2 rounded-xl text-claude-text-dim hover:text-claude-text-muted transition-all shrink-0" title="Save">
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowExportDialog(true)}
            className="px-3 py-1.5 rounded-xl bg-claude-terracotta/15 text-claude-terracotta hover:bg-claude-terracotta/25 text-xs font-medium transition-all shrink-0"
            title="Export"
          >
            Export
          </button>
        </div>
      </div>
    </>
  );
}
