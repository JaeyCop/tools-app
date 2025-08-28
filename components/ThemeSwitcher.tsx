'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme, themes } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-theme-switcher]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-muted/50 animate-pulse" />
    );
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themeOptions.find(option => option.value === theme) || themeOptions[0];
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative" data-theme-switcher>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 interactive min-w-[100px]"
        aria-label="Theme selector"
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          <currentTheme.icon className={`w-4 h-4 transition-all duration-300 ${
            isDark ? 'text-blue-400' : 'text-amber-500'
          }`} />
        </div>
        <span className="text-sm font-medium text-foreground flex-1 text-left">
          {currentTheme.label}
        </span>
        <ChevronDown className={`w-3 h-3 text-muted transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-surface/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-50 animate-slide-down">
          {themeOptions.map((option) => {
            const isSelected = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 hover:bg-surface-elevated/50 ${
                  isSelected 
                    ? 'text-primary bg-primary/5 border-r-2 border-primary' 
                    : 'text-foreground hover:text-primary'
                }`}
              >
                <option.icon className={`w-4 h-4 ${
                  isSelected ? 'text-primary' : 'text-muted'
                }`} />
                <span className="font-medium">{option.label}</span>
                {isSelected && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};