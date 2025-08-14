"use client";

import { CheckCircle, Download, Info } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

interface OutputPanelProps {
  isProcessing: boolean;
  zipUrl: string | null;
  outputName: string;
  selectedPagesSize: number;
}

export function OutputPanel({
  isProcessing,
  zipUrl,
  outputName,
  selectedPagesSize,
}: OutputPanelProps) {
  return (
    <div className="space-y-6">
      {isProcessing && (
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Skeleton className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Processing...</h3>
          </div>
          <Skeleton className="w-full h-12" />
        </div>
      )}

      {zipUrl && !isProcessing && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Ready to Download
            </h3>
          </div>
          <a
            className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            href={zipUrl}
            download={outputName || "pages.zip"}
          >
            <Download className="w-5 h-5" />
            Download {outputName || "pages.zip"}
          </a>
          <p className="text-xs text-green-700 dark:text-green-300 mt-2 text-center">
            Contains {selectedPagesSize} PDF file{selectedPagesSize !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {!zipUrl && !isProcessing && (
        <div className="bg-card rounded-xl border p-6">
          <div className="text-sm text-muted-foreground text-center">
            Select pages and click &quot;Split PDF&quot; to generate your download.
          </div>
        </div>
      )}

      {/* Help Panel */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Tips</h3>
        </div>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Use Odd/Even to quickly select every other page</li>
          <li>• Switch to Single mode to select exactly one page</li>
          <li>• Type ranges in the sidebar for bulk selection</li>
          <li>• Large PDFs may take a moment to process</li>
        </ul>
      </div>
    </div>
  );
}