import React from 'react';
import { useDocumentStore } from '../store/documentStore';
import { LayoutTemplate, Smartphone, Palette, Hexagon } from 'lucide-react';

export function TemplatesPanel() {
  const { addElement, clearDocument } = useDocumentStore();

  const handleAppIcon = () => {
    clearDocument();
    // Add iOS App Icon guides
    addElement({
      id: crypto.randomUUID(),
      type: 'rect',
      x: 100,
      y: 100,
      width: 824,
      height: 824,
      rx: 180,
      ry: 180,
      rotation: 0,
      fill: '#1e1e1e',
      stroke: '#3b82f6',
      strokeWidth: 2,
      opacity: 1,
    });
    // Add some default content
    addElement({
      id: crypto.randomUUID(),
      type: 'circle',
      x: 512,
      y: 512,
      radius: 200,
      rotation: 0,
      fill: '#3b82f6',
      stroke: 'transparent',
      strokeWidth: 0,
      opacity: 1,
    });
  };

  const handleLogo = () => {
    clearDocument();
    addElement({
      id: crypto.randomUUID(),
      type: 'text',
      x: 512,
      y: 512,
      text: 'BRAND',
      fontSize: 120,
      fontFamily: 'Inter',
      fontWeight: '900',
      rotation: 0,
      fill: '#ffffff',
      stroke: 'transparent',
      strokeWidth: 0,
      opacity: 1,
    });
  };

  return (
    <div className="absolute left-4 right-4 top-[calc(max(1rem,env(safe-area-inset-top))+5rem)] md:top-20 md:right-auto md:w-64 bg-zinc-800/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-zinc-700/50 z-40 flex flex-col gap-4 max-h-[40vh] md:max-h-[60vh] overflow-y-auto">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Templates</h3>
      
      <div className="flex flex-col gap-2">
        <button 
          onClick={handleAppIcon}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors text-left"
        >
          <Smartphone className="w-5 h-5 text-blue-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">iOS App Icon</span>
            <span className="text-xs text-zinc-500">1024x1024 with squircle</span>
          </div>
        </button>

        <button 
          onClick={handleLogo}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors text-left"
        >
          <Hexagon className="w-5 h-5 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Logo Concept</span>
            <span className="text-xs text-zinc-500">Blank canvas with brand text</span>
          </div>
        </button>
      </div>
    </div>
  );
}
