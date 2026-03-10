import React, { useRef } from 'react';
import {
  MousePointer2,
  PenTool,
  Square,
  Circle as CircleIcon,
  Type as TypeIcon,
  Minus,
  Layers,
  Download,
  FolderOpen,
  FilePlus,
  LayoutTemplate,
  Image as ImageIcon,
  FileImage,
  FileJson,
  Upload,
  Save,
} from 'lucide-react';
import { useDocumentStore, ExcalidrawFile } from '../store/documentStore';

export function Toolbar() {
  const {
    addElement,
    saveDocument,
    clearDocument,
    activeTool,
    setActiveTool,
    showLayersPanel,
    setShowLayersPanel,
    showTemplatesPanel,
    setShowTemplatesPanel,
    exportToExcalidraw,
    importFromExcalidraw,
    name,
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

  const handleSave = async () => {
    await saveDocument();
  };

  const handleExportSVG = () => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    const gridRect = clone.querySelector('rect[fill="url(#majorGrid)"]');
    if (gridRect) gridRect.remove();
    clone.style.transform = '';

    const svgData = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name || 'claudecrayons-export'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    const gridRect = clone.querySelector('rect[fill="url(#majorGrid)"]');
    if (gridRect) gridRect.remove();
    clone.style.transform = '';

    const svgData = new XMLSerializer().serializeToString(clone);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = '#1C1917';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${name || 'claudecrayons-export'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleExportJPEG = () => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    const gridRect = clone.querySelector('rect[fill="url(#majorGrid)"]');
    if (gridRect) gridRect.remove();
    clone.style.transform = '';

    const svgData = new XMLSerializer().serializeToString(clone);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const jpegUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.href = jpegUrl;
        link.download = `${name || 'claudecrayons-export'}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleExportExcalidraw = () => {
    const excalidrawData = exportToExcalidraw();
    const json = JSON.stringify(excalidrawData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name || 'claudecrayons-export'}.excalidraw`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    // Reset input
    e.target.value = '';
  };

  const getBtnClass = (tool: string) =>
    `p-2.5 rounded-xl transition-all duration-150 shrink-0 ${
      activeTool === tool
        ? 'bg-claude-terracotta text-white shadow-lg shadow-claude-terracotta/25'
        : 'hover:bg-claude-surface-hover text-claude-text-muted hover:text-claude-text'
    }`;

  const actionBtnClass = 'p-2.5 rounded-xl hover:bg-claude-surface-hover text-claude-text-muted hover:text-claude-text transition-all duration-150 shrink-0';

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".excalidraw,.json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top bar with branding */}
      <div className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-4 bg-claude-surface/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-2xl border border-claude-border/50 z-50 flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-claude-terracotta flex items-center justify-center">
          <span className="text-white text-xs font-bold">C</span>
        </div>
        <span className="text-sm font-semibold text-claude-text tracking-tight">ClaudeCrayons</span>
      </div>

      {/* Bottom toolbar */}
      <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 max-w-[calc(100vw-2rem)] bg-claude-surface/90 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl border border-claude-border/50 flex items-center gap-1 z-50 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <button onClick={() => setActiveTool('select')} className={getBtnClass('select')} title="Select">
          <MousePointer2 className="w-4.5 h-4.5" />
        </button>
        <div className="w-px h-5 bg-claude-border mx-0.5 shrink-0" />
        <button onClick={() => setActiveTool('pen')} className={getBtnClass('pen')} title="Pen">
          <PenTool className="w-4.5 h-4.5" />
        </button>
        <button onClick={handleAddRect} className={getBtnClass('rect')} title="Rectangle">
          <Square className="w-4.5 h-4.5" />
        </button>
        <button onClick={handleAddCircle} className={getBtnClass('circle')} title="Circle">
          <CircleIcon className="w-4.5 h-4.5" />
        </button>
        <button onClick={() => setActiveTool('line')} className={getBtnClass('line')} title="Line">
          <Minus className="w-4.5 h-4.5" />
        </button>
        <button onClick={handleAddText} className={getBtnClass('text')} title="Text">
          <TypeIcon className="w-4.5 h-4.5" />
        </button>
        <div className="w-px h-5 bg-claude-border mx-0.5 shrink-0" />
        <button
          onClick={() => setShowLayersPanel(!showLayersPanel)}
          className={`p-2.5 rounded-xl transition-all duration-150 shrink-0 ${showLayersPanel ? 'bg-claude-terracotta text-white shadow-lg shadow-claude-terracotta/25' : 'hover:bg-claude-surface-hover text-claude-text-muted hover:text-claude-text'}`}
          title="Layers"
        >
          <Layers className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={() => setShowTemplatesPanel(!showTemplatesPanel)}
          className={`p-2.5 rounded-xl transition-all duration-150 shrink-0 ${showTemplatesPanel ? 'bg-claude-terracotta text-white shadow-lg shadow-claude-terracotta/25' : 'hover:bg-claude-surface-hover text-claude-text-muted hover:text-claude-text'}`}
          title="Templates"
        >
          <LayoutTemplate className="w-4.5 h-4.5" />
        </button>
        <div className="w-px h-5 bg-claude-border mx-0.5 shrink-0" />
        <button onClick={clearDocument} className={actionBtnClass} title="New Project">
          <FilePlus className="w-4.5 h-4.5" />
        </button>
        <button onClick={handleSave} className={actionBtnClass} title="Save">
          <Save className="w-4.5 h-4.5" />
        </button>
        <div className="w-px h-5 bg-claude-border mx-0.5 shrink-0" />
        <button onClick={handleImportExcalidraw} className={actionBtnClass} title="Import .excalidraw">
          <Upload className="w-4.5 h-4.5" />
        </button>
        <button onClick={handleExportExcalidraw} className="p-2.5 rounded-xl hover:bg-claude-terracotta/20 text-claude-terracotta hover:text-claude-terracotta-light transition-all duration-150 shrink-0" title="Export .excalidraw">
          <FileJson className="w-4.5 h-4.5" />
        </button>
        <div className="w-px h-5 bg-claude-border mx-0.5 shrink-0" />
        <button onClick={handleExportSVG} className={actionBtnClass} title="Export SVG">
          <Download className="w-4.5 h-4.5" />
        </button>
        <button onClick={handleExportPNG} className={actionBtnClass} title="Export PNG">
          <ImageIcon className="w-4.5 h-4.5" />
        </button>
        <button onClick={handleExportJPEG} className={actionBtnClass} title="Export JPEG">
          <FileImage className="w-4.5 h-4.5" />
        </button>
      </div>
    </>
  );
}
