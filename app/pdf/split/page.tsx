"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "react-dropzone";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Skeleton from "@/components/ui/Skeleton";
import {
  Upload,
  FileText,
  Scissors,
  Download,
  Info,
  CheckCircle,
  Filter,
  Trash2,
  X,
  Settings,
  AlertCircle,
  Zap
} from "lucide-react";
import ToolSeoContent from "@/components/ToolSeoContent";
import SeoHowToJsonLd from "@/components/SeoHowToJsonLd";
import SeoFaqJsonLd from "@/components/SeoFaqJsonLd";
import { ToolLayout } from "@/components/ToolLayout";

// Types
interface PDFSplitterState {
  file: File | null;
  numPages: number | null;
  selectedPages: Set<number>;
  isProcessing: boolean;
  zipUrl: string | null;
  errorMessage: string | null;
  outputName: string;
  rangeText: string;
  selectMode: "toggle" | "single";
}

type SelectionHelpers = {
  selectAll: () => void;
  selectNone: () => void;
  selectOdd: () => void;
  selectEven: () => void;
  invertSelection: () => void;
};

// Constants
const INITIAL_STATE: PDFSplitterState = {
  file: null,
  numPages: null,
  selectedPages: new Set(),
  isProcessing: false,
  zipUrl: null,
  errorMessage: null,
  outputName: "pages.zip",
  rangeText: "",
  selectMode: "toggle"
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function PdfSplitPage() {
  const [state, setState] = useState<PDFSplitterState>(INITIAL_STATE);
  const urlsToRevokeRef = useRef<string[]>([]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      const urls = [...urlsToRevokeRef.current];
      urls.forEach((url) => URL.revokeObjectURL(url));
      urlsToRevokeRef.current = [];
    };
  }, []);

  // Parse range text to page indices
  const parseRangeText = useCallback((text: string, maxPages: number): Set<number> => {
    const parts = text.split(/[\s,]+/).filter(Boolean);
    const pageSet = new Set<number>();

    for (const part of parts) {
      const match = part.match(/^(\d+)(?:-(\d+))?$/);
      if (!match) continue;

      const start = Math.max(1, Math.min(maxPages, parseInt(match[1], 10)));
      const end = match[2] ? Math.max(1, Math.min(maxPages, parseInt(match[2], 10))) : start;

      const [min, max] = start <= end ? [start, end] : [end, start];
      for (let page = min; page <= max; page++) {
        pageSet.add(page - 1); // Convert to 0-indexed
      }
    }

    return pageSet;
  }, []);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find(file =>
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );

    if (!pdfFile) {
      setState((prev: any) => ({ ...prev, errorMessage: "Please select a valid PDF file." }));
      return;
    }

    if (pdfFile.size > MAX_FILE_SIZE) {
      setState((prev: any) => ({
        ...prev,
        errorMessage: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`
      }));
      return;
    }

    // Reset state for new file
    setState((prev: any) => ({
      ...prev,
      file: pdfFile,
      zipUrl: null,
      errorMessage: null,
      selectedPages: new Set(),
      rangeText: "",
      numPages: null
    }));

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      setState((prev: any) => ({ ...prev, numPages: pageCount }));
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        errorMessage: error instanceof Error ? error.message : "Failed to read PDF file"
      }));
    }
  }, []);

  // Apply range selection
  const applyRangeToSelection = useCallback(() => {
    if (!state.numPages || !state.rangeText.trim()) return;

    const pageSet = parseRangeText(state.rangeText, state.numPages);
    setState((prev: any) => ({ ...prev, selectedPages: pageSet }));
  }, [state.numPages, state.rangeText, parseRangeText]);

  // Toggle page selection
  const togglePage = useCallback((pageIndex: number) => {
    setState((prev: PDFSplitterState) => {
      if (prev.selectMode === "single") {
        return { ...prev, selectedPages: new Set([pageIndex]) };
      }

      const newSelection = new Set(prev.selectedPages);
      if (newSelection.has(pageIndex)) {
        newSelection.delete(pageIndex);
      } else {
        newSelection.add(pageIndex);
      }
      return { ...prev, selectedPages: newSelection };
    });
  }, []);

  // Selection helpers
  const selectionHelpers = useMemo<SelectionHelpers>(() => {
    const safeNumPages = state.numPages ?? 0;
    return {
      selectAll: () => {
        if (!safeNumPages) return;
        const allPages = new Set<number>();
        for (let i = 0; i < safeNumPages; i++) allPages.add(i);
        setState(prev => ({
          ...prev,
          selectedPages: allPages,
          rangeText: `1-${safeNumPages}`
        }));
      },

      selectNone: () => {
        setState(prev => ({ ...prev, selectedPages: new Set(), rangeText: "" }));
      },

      selectOdd: () => {
        if (!safeNumPages) return;
        const oddPages = new Set<number>();
        for (let i = 0; i < safeNumPages; i++) {
          if ((i + 1) % 2 === 1) oddPages.add(i);
        }
        setState(prev => ({
          ...prev,
          selectedPages: oddPages,
          rangeText: Array.from(oddPages).map(i => i + 1).join(",")
        }));
      },

      selectEven: () => {
        if (!safeNumPages) return;
        const evenPages = new Set<number>();
        for (let i = 0; i < safeNumPages; i++) {
          if ((i + 1) % 2 === 0) evenPages.add(i);
        }
        setState(prev => ({
          ...prev,
          selectedPages: evenPages,
          rangeText: Array.from(evenPages).map(i => i + 1).join(",")
        }));
      },

      invertSelection: () => {
        if (!safeNumPages) return;
        const invertedPages = new Set<number>();
        for (let i = 0; i < safeNumPages; i++) {
          if (!state.selectedPages.has(i)) invertedPages.add(i);
        }
        setState(prev => ({
          ...prev,
          selectedPages: invertedPages,
          rangeText: Array.from(invertedPages).map(i => i + 1).join(",")
        }));
      }
    };
  }, [state.numPages, state.selectedPages]);

  // Handle PDF splitting
  const handleSplit = useCallback(async () => {
    if (!state.file || state.selectedPages.size === 0) return;

    setState((prev: any) => ({
      ...prev,
      isProcessing: true,
      zipUrl: null,
      errorMessage: null
    }));

    try {
      const [{ default: JSZip }] = await Promise.all([
        import("jszip")
      ]);

      const zip = new JSZip();
      const sourceBytes = await state.file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(sourceBytes);

      const sortedIndices = Array.from(state.selectedPages).sort((a, b) => a - b);

      // Create individual PDFs for each selected page
      for (const pageIndex of sortedIndices) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        const ab = (pdfBytes as Uint8Array).buffer.slice(
          (pdfBytes as Uint8Array).byteOffset,
          (pdfBytes as Uint8Array).byteOffset + (pdfBytes as Uint8Array).byteLength
        ) as ArrayBuffer;
        const blob = new Blob([ab], { type: "application/pdf" });

        zip.file(`page-${pageIndex + 1}.pdf`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);

      urlsToRevokeRef.current.push(downloadUrl);
      setState((prev: any) => ({ ...prev, zipUrl: downloadUrl }));

    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        errorMessage: error instanceof Error ? error.message : "Failed to split PDF"
      }));
    } finally {
      setState((prev: any) => ({ ...prev, isProcessing: false }));
    }
  }, [state.file, state.selectedPages]);

  // Clear all data
  const clearAll = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Update handlers
  const updateOutputName = useCallback((name: string) => {
    setState((prev: any) => ({ ...prev, outputName: name }));
  }, []);

  const updateRangeText = useCallback((text: string) => {
    setState((prev: any) => ({ ...prev, rangeText: text }));
  }, []);

  const updateSelectMode = useCallback((mode: "toggle" | "single") => {
    setState((prev: any) => ({ ...prev, selectMode: mode }));
  }, []);

  // Computed values
  const canExport = state.file && state.selectedPages.size > 0 && !state.isProcessing;
  const fileInfo = state.file ? {
    name: state.file.name,
    sizeMB: (state.file.size / 1024 / 1024).toFixed(2)
  } : null;

  // Sidebar content
  const sidebarContent = (
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
              value={state.outputName}
              onChange={(e) => updateOutputName((e.target as HTMLInputElement).value)}
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
              value={state.rangeText}
              onChange={(e) => updateRangeText((e.target as HTMLInputElement).value)}
              onBlur={applyRangeToSelection}
              onKeyDown={(e) => (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter' && applyRangeToSelection()}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. 1-3,5,8-10"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use commas and dashes: 1-3,5,8-10
            </p>
          </div>

          {/* Apply Range Button */}
          {state.rangeText && state.numPages && (
            <button
              onClick={applyRangeToSelection}
              className="w-full px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Apply Range
            </button>
          )}

          {/* Selection Info */}
          {state.numPages && (
            <div className="p-3 bg-muted/50 rounded-xl">
              <div className="text-sm text-foreground font-medium">
                {state.selectedPages.size} of {state.numPages} pages selected
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
          disabled={state.isProcessing}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              <span>Splitting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Scissors className="h-5 w-5" />
              <span>Split PDF ({state.selectedPages.size} pages)</span>
            </div>
          )}
        </button>
      )}

      {/* Clear Button */}
      {state.file && (
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

  return (
    <ToolLayout
      title="Split PDF"
      description="Select specific pages to extract into individual PDF files."
      icon={<Scissors className="h-8 w-8 text-primary" />}
      sidebar={sidebarContent}
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center cursor-pointer transition-all duration-300 group ${isDragActive
                ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
            >
              <input {...getInputProps()} />

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full opacity-50 animate-pulse" />
              <div className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />

              <div className={`relative transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                <div className="mb-6">
                  {isDragActive ? (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mx-auto group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                      <FileText className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {isDragActive ? "Drop your PDF here!" : "Upload PDF File"}
                  </h3>
                  <p className="text-muted-foreground">
                    Drag & drop a PDF file or click to browse
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Single file</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Max 100MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dropzone>

        {/* Error Message */}
        {state.errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div className="text-sm text-red-800 dark:text-red-200">{state.errorMessage}</div>
            </div>
          </div>
        )}

        {/* File Info */}
        {fileInfo && (
          <div className="p-4 bg-muted/50 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{fileInfo.name}</p>
                <p className="text-sm text-muted-foreground">
                  {fileInfo.sizeMB} MB • {state.numPages ?? '…'} pages
                </p>
              </div>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-sm hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Page Selection */}
        {typeof state.numPages === 'number' && state.numPages > 0 && (
          <div className="space-y-6">
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
                        checked={state.selectMode === 'toggle'}
                        onChange={() => updateSelectMode('toggle')}
                      />
                      <span>Toggle</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="selectMode"
                        className="w-4 h-4"
                        checked={state.selectMode === 'single'}
                        onChange={() => updateSelectMode('single')}
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
                  {Array.from({ length: state.numPages }, (_, i) => {
                    const isSelected = state.selectedPages.has(i);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => togglePage(i)}
                        className={`h-9 rounded-lg border text-sm font-medium transition-all duration-200 ${isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-95'
                          : 'border-border hover:bg-muted hover:border-primary/50'
                          }`}
                        aria-label={`Page ${i + 1}${isSelected ? ' (selected)' : ''}`}
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
                      <strong>Tip:</strong> Use Odd/Even to quickly split duplex scans, or type ranges like 1-10,15,21-24 in the sidebar.
                    </p>
                  </div>
                </div>
            </div>

            {/* Output Section */}
            {state.isProcessing && (
              <div className="bg-card rounded-xl border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Skeleton className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Processing...
                  </h3>
                </div>
                <Skeleton className="w-full h-12" />
              </div>
            )}

            {state.zipUrl && !state.isProcessing && (
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
                  href={state.zipUrl}
                  download={state.outputName || 'pages.zip'}
                >
                  <Download className="w-5 h-5" />
                  Download {state.outputName || 'pages.zip'}
                </a>
                <p className="text-xs text-green-700 dark:text-green-300 mt-2 text-center">
                  Contains {state.selectedPages.size} PDF file{state.selectedPages.size !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Privacy Notice */}
        <div className="text-center text-muted-foreground">
          <p className="text-sm">🔒 Processing runs locally in your browser. Files are never uploaded.</p>
        </div>
      </div>

      {/* SEO Components */}
      <ToolSeoContent
        title="Split PDF"
        overview="Extract specific pages or split a large PDF into smaller parts. Great for sharing only what's needed."
        steps={[
          "Upload your PDF file",
          "Select pages or enter ranges (e.g., 1-3,7,10-12)",
          "Choose output options and filename",
          "Click Split PDF to export your files"
        ]}
        tips={[
          "Use page ranges to save time with large selections",
          "Name your output files clearly for better organization",
          "Use Odd/Even selection for duplex document splitting"
        ]}
        privacyNote="All processing runs in your browser. Files are never uploaded to any server."
        faq={[
          {
            q: "Can I split multiple ranges at once?",
            a: "Yes, use comma-separated ranges like 1-3,5,8-10 to select multiple page groups."
          },
          {
            q: "What's the maximum file size?",
            a: "The tool supports PDF files up to 100MB in size."
          }
        ]}
      />

      <SeoHowToJsonLd
        name="How to split a PDF"
        description="Split a PDF into selected pages or parts using our browser-based tool."
        steps={[
          { name: "Upload your PDF file", text: "Drag and drop or click to select your PDF" },
          { name: "Select pages or ranges", text: "Choose individual pages or use range notation" },
          { name: "Configure output settings", text: "Set your preferred filename for the download" },
          { name: "Split and download", text: "Click Split PDF and download your files" }
        ]}
      />

      <SeoFaqJsonLd
        id="split-pdf"
        items={[
          {
            question: "Are my files uploaded to any server?",
            answer: "No, all processing happens locally in your browser for complete privacy and security."
          },
          {
            question: "What file formats are supported?",
            answer: "Currently, only PDF files are supported. The tool can handle PDFs up to 100MB in size."
          },
          {
            question: "Can I split password-protected PDFs?",
            answer: "No, password-protected PDFs cannot be processed. Please remove the password protection first."
          }
        ]}
      />
    </ToolLayout>
  );
}