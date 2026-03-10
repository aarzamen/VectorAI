import React, { useState, useRef, useEffect } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';
import { X } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const PRESET_COLORS = [
  'transparent',
  '#1C1917', '#FAFAF9', '#D97757', '#E8A87C', '#F59E0B',
  '#84CC16', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#D946EF'
];

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isTransparent = color === 'transparent' || color === 'none' || !color;
  const displayColor = isTransparent ? '#00000000' : color;

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs text-claude-text-dim">{label}</label>
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-lg border border-claude-border overflow-hidden relative flex-shrink-0"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: isTransparent ? 'transparent' : color,
            backgroundImage: isTransparent ? 'linear-gradient(45deg, #292524 25%, transparent 25%, transparent 75%, #292524 75%, #292524), linear-gradient(45deg, #292524 25%, transparent 25%, transparent 75%, #292524 75%, #292524)' : 'none',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 4px 4px'
          }}
        >
          {isTransparent && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-claude-terracotta transform rotate-45"></div>
            </div>
          )}
        </button>
        <div className="flex-1 flex items-center bg-claude-bg border border-claude-border rounded-lg overflow-hidden">
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent px-2 py-1 text-sm text-claude-text outline-none"
            placeholder="transparent"
          />
        </div>
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute bottom-full right-0 md:bottom-auto md:top-full md:left-0 mb-2 md:mb-0 md:mt-2 p-3 bg-claude-surface border border-claude-border rounded-xl shadow-xl z-50 flex flex-col gap-3"
          style={{ width: '220px' }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-claude-text-muted">Select Color</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-claude-text-dim hover:text-claude-text-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <HexAlphaColorPicker
            color={displayColor}
            onChange={onChange}
            style={{ width: '100%', height: '150px' }}
          />

          <div className="grid grid-cols-6 gap-1.5 mt-2">
            {PRESET_COLORS.map((presetColor, i) => {
              const isPresetTransparent = presetColor === 'transparent';
              return (
                <button
                  key={i}
                  className="w-6 h-6 rounded-md border border-claude-border/50 hover:scale-110 transition-transform relative overflow-hidden"
                  style={{
                    backgroundColor: isPresetTransparent ? 'transparent' : presetColor,
                    backgroundImage: isPresetTransparent ? 'linear-gradient(45deg, #292524 25%, transparent 25%, transparent 75%, #292524 75%, #292524), linear-gradient(45deg, #292524 25%, transparent 25%, transparent 75%, #292524 75%, #292524)' : 'none',
                    backgroundSize: '6px 6px',
                    backgroundPosition: '0 0, 3px 3px'
                  }}
                  onClick={() => onChange(presetColor)}
                  title={presetColor}
                >
                  {isPresetTransparent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-px bg-claude-terracotta transform rotate-45"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
