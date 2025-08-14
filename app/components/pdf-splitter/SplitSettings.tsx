"use client";

import { Settings, Filter, Scissors, X } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface SplitSettingsProps {
  outputName: string;
  updateOutputName: (name: string) => void;
  rangeText: string;
  updateRangeText: (text: string) => void;
  applyRangeToSelection: () => void;
  numPages: number | null;
  selectedPagesSize: number;
  canExport: boolean;
  handleSplit: () => Promise<void>;
  isProcessing: boolean;
  clearAll: () => void;
}

export function SplitSettings({
  outputName,
  updateOutputName,
  rangeText,
  updateRangeText,
  applyRangeToSelection,
  numPages,
  selectedPagesSize,
  canExport,
  handleSplit,
  isProcessing,
  clearAll,
}: SplitSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Split Settings
        </h3>

        <div className="space-y-4">
          {/* Output Name */}
          <div>
            <label htmlFor="output-name" className="block text-sm font-medium text-foreground mb-2">
              Output Name
            </label>
            <input
              id="output-name"
              type="text"
              value={outputName}
              onChange={(e) => updateOutputName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="pages.zip"
            />
          </div>

          {/* Page Range */}
          <div>
            <label htmlFor="page-range" className="block text-sm font-medium text-foreground mb-2">
              Page Range
            </label>
            <input
              id="page-range"
              type="text"
              value={rangeText}
              onChange={(e) => updateRangeText(e.target.value)}
              onBlur={applyRangeToSelection}
              onKeyDown={(e) => e.key === "Enter" && applyRangeToSelection()}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. 1-3,5,8-10"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use commas and dashes: 1-3,5,8-10
            </p>
          </div>

          {/* Apply Range Button */}
          {rangeText && numPages && (
            <button
              onClick={applyRangeToSelection}
              className="w-full px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Apply Range
            </button>
          )}

          {/* Selection Info */}
          {numPages && (
            <div className="p-3 bg-muted/50 rounded-xl">
              <div className="text-sm text-foreground font-medium">
                {selectedPagesSize} of {numPages} pages selected
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Click pages below to select/deselect
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Process Button */}
      {canExport && (
        <button
          onClick={handleSplit}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              <span>Splitting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Scissors className="h-5 w-5" />
              <span>Split PDF ({selectedPagesSize} pages)</span>
            </div>
          )}
        </button>
      )}

      {/* Clear Button */}
      {numPages && (
        <button
          onClick={clearAll}
          className="w-full px-4 py-2 bg-red-500/10 text-red-600 rounded-xl text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      )}
    </div>
  );
}