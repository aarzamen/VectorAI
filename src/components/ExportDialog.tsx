import React, { useState } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { X, Download } from 'lucide-react';

type ExportFormat = 'svg' | 'png' | 'jpeg' | 'excalidraw';

export function ExportDialog() {
  const { showExportDialog, setShowExportDialog, name, setDocumentName, exportToExcalidraw } = useDocumentStore();
  const [fileName, setFileName] = useState(name || 'claudecrayons-export');
  const [format, setFormat] = useState<ExportFormat>('png');

  if (!showExportDialog) return null;

  const handleExport = () => {
    // Update the document name
    setDocumentName(fileName);

    switch (format) {
      case 'svg':
        exportSVG();
        break;
      case 'png':
        exportRaster('png');
        break;
      case 'jpeg':
        exportRaster('jpeg');
        break;
      case 'excalidraw':
        exportExcalidrawFile();
        break;
    }
    setShowExportDialog(false);
  };

  const exportSVG = () => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    // Remove grid background
    const gridRect = clone.querySelector('rect[fill="url(#majorGrid)"]');
    if (gridRect) gridRect.remove();
    // Remove canvas boundary
    const boundary = clone.querySelector('[data-canvas-boundary]');
    if (boundary) boundary.remove();
    clone.style.transform = '';

    const svgData = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    downloadBlob(blob, `${fileName}.svg`);
  };

  const exportRaster = (type: 'png' | 'jpeg') => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    const gridRect = clone.querySelector('rect[fill="url(#majorGrid)"]');
    if (gridRect) gridRect.remove();
    const boundary = clone.querySelector('[data-canvas-boundary]');
    if (boundary) boundary.remove();
    clone.style.transform = '';

    const svgData = new XMLSerializer().serializeToString(clone);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = type === 'jpeg' ? '#ffffff' : '#1C1917';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const mimeType = type === 'png' ? 'image/png' : 'image/jpeg';
        const ext = type === 'png' ? 'png' : 'jpg';
        canvas.toBlob((blob) => {
          if (blob) downloadBlob(blob, `${fileName}.${ext}`);
        }, mimeType, 0.9);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const exportExcalidrawFile = () => {
    const excalidrawData = exportToExcalidraw();
    const json = JSON.stringify(excalidrawData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `${fileName}.excalidraw`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formats: { id: ExportFormat; label: string; desc: string }[] = [
    { id: 'png', label: 'PNG', desc: 'Raster image with transparency' },
    { id: 'jpeg', label: 'JPEG', desc: 'Compressed raster image' },
    { id: 'svg', label: 'SVG', desc: 'Scalable vector graphics' },
    { id: 'excalidraw', label: 'Excalidraw', desc: 'JSON for Excalidraw editor' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowExportDialog(false)}>
      <div
        className="bg-claude-surface rounded-2xl p-5 shadow-2xl border border-claude-border/50 w-[calc(100vw-2rem)] max-w-md flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-claude-text">Export</h2>
          <button onClick={() => setShowExportDialog(false)} className="p-1.5 text-claude-text-muted hover:text-claude-text rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-claude-text-dim font-medium uppercase tracking-wider">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-claude-bg border border-claude-border rounded-xl px-3 py-2 text-sm text-claude-text focus:outline-none focus:border-claude-terracotta transition-colors"
            placeholder="my-design"
          />
        </div>

        {/* Format selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-claude-text-dim font-medium uppercase tracking-wider">Format</label>
          <div className="grid grid-cols-2 gap-2">
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  format === f.id
                    ? 'bg-claude-terracotta/15 border-claude-terracotta/50 text-claude-text'
                    : 'bg-claude-bg/50 border-claude-border/50 text-claude-text-muted hover:bg-claude-surface-hover'
                }`}
              >
                <div className="text-sm font-medium">{f.label}</div>
                <div className="text-xs text-claude-text-dim mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 bg-claude-terracotta hover:bg-claude-terracotta-dark text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Export as {formats.find(f => f.id === format)?.label}
        </button>
      </div>
    </div>
  );
}
