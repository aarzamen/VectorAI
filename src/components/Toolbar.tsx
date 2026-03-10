import React from 'react';
import { 
  MousePointer2, 
  PenTool, 
  Square, 
  Circle as CircleIcon, 
  Type as TypeIcon,
  Layers,
  Download,
  FolderOpen,
  FilePlus,
  LayoutTemplate,
  Image as ImageIcon,
  FileImage
} from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';

export function Toolbar() {
  const { addElement, saveDocument, clearDocument, activeTool, setActiveTool, showLayersPanel, setShowLayersPanel, showTemplatesPanel, setShowTemplatesPanel } = useDocumentStore();

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
      stroke: '#ffffff',
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
      stroke: '#ffffff',
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
      text: 'VectorAI',
      fontSize: 24,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      rotation: 0,
      fill: '#ffffff',
      stroke: 'transparent',
      strokeWidth: 0,
      opacity: 1,
    });
  };

  const handleSave = async () => {
    await saveDocument();
    // In a real app we'd show a toast notification here
  };

  const handleExportSVG = () => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;
    
    // Clone the SVG to remove grid and selection styles
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    
    // Remove grid
    const gridRect = clone.querySelector('rect[fill="url(#grid)"]');
    if (gridRect) gridRect.remove();
    
    // Reset pan/zoom on clone
    clone.style.transform = '';
    
    const svgData = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vector-ai-export.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;
    
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    const gridRect = clone.querySelector('rect[fill="url(#grid)"]');
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
        ctx.fillStyle = '#18181b'; // zinc-900 background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'vector-ai-export.png';
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
    const gridRect = clone.querySelector('rect[fill="url(#grid)"]');
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
        ctx.fillStyle = '#ffffff'; // white background for JPEG
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const jpegUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.href = jpegUrl;
        link.download = 'vector-ai-export.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const getBtnClass = (tool: string) => 
    `p-3 rounded-xl transition-colors ${activeTool === tool ? 'bg-blue-600 text-white' : 'hover:bg-zinc-700/50 text-zinc-300 hover:text-white'}`;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-800/90 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-zinc-700/50 flex items-center gap-2 z-50">
      <button onClick={() => setActiveTool('select')} className={getBtnClass('select')}>
        <MousePointer2 className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-zinc-700 mx-1" />
      <button onClick={() => setActiveTool('pen')} className={getBtnClass('pen')}>
        <PenTool className="w-5 h-5" />
      </button>
      <button onClick={handleAddRect} className={getBtnClass('rect')}>
        <Square className="w-5 h-5" />
      </button>
      <button onClick={handleAddCircle} className={getBtnClass('circle')}>
        <CircleIcon className="w-5 h-5" />
      </button>
      <button onClick={handleAddText} className={getBtnClass('text')}>
        <TypeIcon className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-zinc-700 mx-1" />
      <button 
        onClick={() => setShowLayersPanel(!showLayersPanel)} 
        className={`p-3 rounded-xl transition-colors ${showLayersPanel ? 'bg-blue-600 text-white' : 'hover:bg-zinc-700/50 text-zinc-300 hover:text-white'}`} 
        title="Layers"
      >
        <Layers className="w-5 h-5" />
      </button>
      <button 
        onClick={() => setShowTemplatesPanel(!showTemplatesPanel)} 
        className={`p-3 rounded-xl transition-colors ${showTemplatesPanel ? 'bg-blue-600 text-white' : 'hover:bg-zinc-700/50 text-zinc-300 hover:text-white'}`} 
        title="Templates"
      >
        <LayoutTemplate className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-zinc-700 mx-1" />
      <button onClick={clearDocument} className="p-3 rounded-xl hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors" title="New Project">
        <FilePlus className="w-5 h-5" />
      </button>
      <button onClick={handleSave} className="p-3 rounded-xl hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors" title="Save Project">
        <FolderOpen className="w-5 h-5" />
      </button>
      <button onClick={handleExportSVG} className="p-3 rounded-xl hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors" title="Export SVG">
        <Download className="w-5 h-5" />
      </button>
      <button onClick={handleExportPNG} className="p-3 rounded-xl hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors" title="Export PNG">
        <ImageIcon className="w-5 h-5" />
      </button>
      <button onClick={handleExportJPEG} className="p-3 rounded-xl hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors" title="Export JPEG">
        <FileImage className="w-5 h-5" />
      </button>
    </div>
  );
}
