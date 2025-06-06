"use client"

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const PREDEFINED_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

function isValidHexColor(color: string): boolean {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}

export function ColorPicker({ label, value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalColor, setInternalColor] = useState(value);
  const [inputValue, setInputValue] = useState(value);
  
  // Set default label if not provided
  const displayLabel = label || 'Color';

  // Update internal state when value changes from parent
  useEffect(() => {
    setInternalColor(value);
    setInputValue(value);
  }, [value]);

  const handleColorSelect = (color: string) => {
    if (color.startsWith('#')) {
      setInternalColor(color);
      setInputValue(color);
    } else {
      const newColor = `#${color.replace(/[^0-9A-F]/gi, '').slice(0, 6)}`;
      setInternalColor(newColor);
      setInputValue(newColor);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (isValidHexColor(value)) {
      setInternalColor(value);
    }
  };

  const handleApply = useCallback(() => {
    if (internalColor !== value) {
      onChange(internalColor);
    }
    setIsOpen(false);
  }, [internalColor, onChange, value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidHexColor(internalColor)) {
      handleApply();
    } else if (e.key === 'Escape') {
      setInternalColor(value);
      setInputValue(value);
      setIsOpen(false);
    }
  }, [handleApply])

  return (
    <div className={cn("space-y-2", className)}>
      {displayLabel && <Label>{displayLabel}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsOpen(true)}
            aria-label={`Select ${displayLabel.toLowerCase()}`}
          >
            <div
              className="w-4 h-4 rounded-full mr-2 border"
              style={{ backgroundColor: value }}
            />
            {value}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start" onKeyDown={handleKeyDown}>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {PREDEFINED_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorSelect(color.value)}
                className={cn(
                  "w-6 h-6 rounded-full border transition-transform hover:scale-110",
                  internalColor === color.value && "ring-2 ring-offset-1 ring-primary"
                )}
                style={{ backgroundColor: color.value }}
                aria-label={`Select ${color.name} color`}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                type="color"
                value={internalColor}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="h-10 w-10 p-0 border-0 rounded-md overflow-hidden"
                aria-label="Custom color picker"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Palette className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="flex-1"
              placeholder="#RRGGBB"
              aria-label="Color hex code"
            />
          </div>
          {!isValidHexColor(inputValue) && inputValue && (
            <p className="mt-2 text-sm text-red-500">Please enter a valid hex color code</p>
          )}
          <div className="mt-4 flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setInternalColor(value);
                setInputValue(value);
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              disabled={!isValidHexColor(internalColor)}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
