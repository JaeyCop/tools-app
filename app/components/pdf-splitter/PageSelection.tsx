"use client";

import { Filter, Info } from "lucide-react";

interface PageSelectionProps {
  numPages: number;
  selectedPages: Set<number>;
  togglePage: (pageIndex: number) => void;
  selectMode: "toggle" | "single";
  updateSelectMode: (mode: "toggle" | "single") => void;
  selectionHelpers: {
    selectAll: () => void;
    selectNone: () => void;
    selectOdd: () => void;
    selectEven: () => void;
    invertSelection: () => void;
  };
}

export function PageSelection({
  numPages,
  selectedPages,
  togglePage,
  selectMode,
  updateSelectMode,
  selectionHelpers,
}: PageSelectionProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Choose pages</h3>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selectMode"
                className="w-4 h-4"
                checked={selectMode === "toggle"}
                onChange={() => updateSelectMode("toggle")}
              />
              <span>Toggle</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selectMode"
                className="w-4 h-4"
                checked={selectMode === "single"}
                onChange={() => updateSelectMode("single")}
              />
              <span>Single</span>
            </label>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-6">
          <button
            type="button"
            onClick={selectionHelpers.selectAll}
            className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            All
          </button>
          <button
            type="button"
            onClick={selectionHelpers.selectNone}
            className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            None
          </button>
          <button
            type="button"
            onClick={selectionHelpers.selectOdd}
            className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Odd
          </button>
          <button
            type="button"
            onClick={selectionHelpers.selectEven}
            className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Even
          </button>
          <button
            type="button"
            onClick={selectionHelpers.invertSelection}
            className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Invert
          </button>
        </div>

        {/* Page Grid */}
        <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-12 gap-2 mb-6">
          {Array.from({ length: numPages }, (_, i) => {
            const isSelected = selectedPages.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => togglePage(i)}
                className={`h-9 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm scale-95"
                    : "border-border hover:bg-muted hover:border-primary/50"
                }`}
                aria-label={`Page ${i + 1}${isSelected ? " (selected)" : ""}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Info */}
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">
              <strong>Tip:</strong> Use Odd/Even to quickly split duplex scans, or type ranges like
              1-10,15,21-24 in the sidebar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}