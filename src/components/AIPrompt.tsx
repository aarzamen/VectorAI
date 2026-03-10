import React, { useState } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

export function AIPrompt() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { addElement, selectedElementIds, elements, updateElement } = useDocumentStore();

  const selectedElement = selectedElementIds.length > 0 ? elements[selectedElementIds[0]] : null;
  const isModifying = selectedElement && selectedElement.type === 'path';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let contents = '';
      if (isModifying && selectedElement) {
        contents = `Modify the following SVG path based on this request: "${prompt}".
        Current path data: ${selectedElement.pathData}
        Return ONLY the raw SVG path 'd' attribute string, nothing else. No markdown, no XML tags.`;
      } else {
        contents = `Generate an SVG path for the following request: "${prompt}". 
        Return ONLY the raw SVG path 'd' attribute string, nothing else. No markdown, no XML tags.
        Make it a single continuous path if possible, or a compound path.
        Scale it to fit within a 100x100 viewBox.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
      });

      const pathData = response.text?.trim() || '';
      
      if (pathData && !pathData.includes('<svg')) {
        if (isModifying && selectedElement) {
          updateElement(selectedElement.id, { pathData });
        } else {
          addElement({
            id: crypto.randomUUID(),
            type: 'path',
            x: 400,
            y: 400,
            rotation: 0,
            fill: '#ffffff',
            stroke: '#ffffff',
            strokeWidth: 2,
            opacity: 1,
            pathData: pathData,
          });
        }
      } else {
        console.error('Invalid path data received:', pathData);
      }
    } catch (error) {
      console.error('Error generating SVG:', error);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  return (
    <div className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[28rem] bg-zinc-800/90 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-zinc-700/50 flex items-center gap-2 z-50">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={isModifying ? "Modify selected path..." : "Describe a shape to generate..."}
        className="flex-1 bg-transparent border-none outline-none text-sm px-3 py-2 text-zinc-100 placeholder:text-zinc-500"
        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
      />
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 text-white p-2 rounded-xl transition-colors flex items-center justify-center"
      >
        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : (isModifying ? <Wand2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />)}
      </button>
    </div>
  );
}
