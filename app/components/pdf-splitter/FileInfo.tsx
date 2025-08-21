"use client";

import { FileText, Trash2 } from "lucide-react";

interface FileInfoProps {
  fileName: string;
  fileSizeMB: string;
  numPages: number | null;
  onClear: () => void;
}

export function FileInfo({ fileName, fileSizeMB, numPages, onClear }: FileInfoProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-xl border">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{fileName}</p>
          <p className="text-sm text-muted-foreground">
            {fileSizeMB} MB • {numPages ?? "…"} pages
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-sm hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Remove
        </button>
      </div>
    </div>
  );
}