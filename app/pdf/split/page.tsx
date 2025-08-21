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

      {/* Educational Content Section */}
      <div className="mt-16 space-y-12">
        {/* Understanding PDF Splitting */}
        <section className="bg-gradient-to-r from-red-50 via-pink-50 to-purple-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-purple-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-xl">
              <Scissors className="h-6 w-6 text-white" />
            </div>
            Understanding PDF Splitting Technology
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">How PDF Splitting Works</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                PDF splitting extracts specific pages from a source document and creates new, independent PDF files. Each extracted page maintains its original quality, formatting, and interactive elements.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Preserves original page quality and formatting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Maintains fonts, images, and vector graphics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Retains hyperlinks and form fields</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Creates fully independent PDF documents</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Selection Methods</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Individual Selection</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Click specific pages to select them one by one. Perfect for extracting scattered pages from a document.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Range Selection</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Use range notation (e.g., "1-5, 8, 11-13") to select multiple pages or consecutive sequences efficiently.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Pattern Selection</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Quick-select odd pages, even pages, or all pages with convenient preset buttons.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-6 border border-red-200 dark:border-red-700">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">📄 Range Notation Examples</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-red-700 dark:text-red-300">Single pages:</span>
                <p className="text-red-600 dark:text-red-400">"1, 3, 5" - Extracts pages 1, 3, and 5</p>
              </div>
              <div>
                <span className="font-medium text-red-700 dark:text-red-300">Page ranges:</span>
                <p className="text-red-600 dark:text-red-400">"1-5, 10-15" - Extracts pages 1 through 5 and 10 through 15</p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Use Cases */}
        <section className="bg-surface/80 border border-border rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            Professional Splitting Scenarios
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                Document Extraction
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Extract specific chapters from reports</li>
                <li>• Isolate executive summaries</li>
                <li>• Separate contract sections</li>
                <li>• Pull individual invoices from batches</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                Content Organization
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Separate odd/even pages from duplex scans</li>
                <li>• Create individual page files for review</li>
                <li>• Extract pages for specific audiences</li>
                <li>• Organize multi-topic documents</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                Workflow Optimization
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Reduce file sizes for email sharing</li>
                <li>• Create focused review documents</li>
                <li>• Prepare materials for presentations</li>
                <li>• Archive important pages separately</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">✂️ Splitting Strategy Guide</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Before Splitting:</h5>
                <ul className="text-amber-600 dark:text-amber-400 space-y-1">
                  <li>• Review document structure and page numbering</li>
                  <li>• Identify logical break points</li>
                  <li>• Plan output file naming convention</li>
                  <li>• Consider target audience for each section</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-2">After Splitting:</h5>
                <ul className="text-amber-600 dark:text-amber-400 space-y-1">
                  <li>• Verify all selected pages were extracted</li>
                  <li>• Check page quality and formatting</li>
                  <li>• Test functionality of links and forms</li>
                  <li>• Organize output files logically</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Techniques */}
        <section className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-900/20 dark:via-cyan-900/20 dark:to-blue-900/20 rounded-2xl border border-teal-200 dark:border-teal-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-teal-500 rounded-xl">
              <Filter className="h-6 w-6 text-white" />
            </div>
            Advanced Splitting Techniques
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Efficient Selection Patterns</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Duplex scanning recovery:</span>
                    <span className="text-muted-foreground ml-2">Use odd/even selection to separate front and back pages from mixed scans</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Chapter extraction:</span>
                    <span className="text-muted-foreground ml-2">Use range selection to extract complete sections or chapters</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Quality control:</span>
                    <span className="text-muted-foreground ml-2">Extract sample pages for review before processing large documents</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Selective sharing:</span>
                    <span className="text-muted-foreground ml-2">Extract only relevant pages for specific audiences or purposes</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Output Organization</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-teal-200 dark:border-teal-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Naming Convention</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Output files are automatically named with page numbers (e.g., "document_page_1.pdf") for easy identification.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Zip Archive</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Multiple extracted pages are packaged in a convenient ZIP file for easy download and organization.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Quality Preservation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Each extracted page maintains the exact quality and formatting of the original document.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-teal-100 dark:bg-teal-900/30 rounded-xl p-6 border border-teal-200 dark:border-teal-700">
            <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-3">🎯 Pro Tips for Efficient Splitting</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-teal-700 dark:text-teal-300">Large Documents:</span>
                <p className="text-teal-600 dark:text-teal-400">Preview pages first to identify the exact sections you need</p>
              </div>
              <div>
                <span className="font-medium text-teal-700 dark:text-teal-300">Batch Processing:</span>
                <p className="text-teal-600 dark:text-teal-400">Split similar documents using consistent page patterns</p>
              </div>
              <div>
                <span className="font-medium text-teal-700 dark:text-teal-300">Quality Control:</span>
                <p className="text-teal-600 dark:text-teal-400">Always verify extracted pages before sharing or archiving</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ToolSeoContent
        title="Online PDF Splitter"
        overview="Easily extract one or more pages from your PDF file. Our tool allows you to select specific pages or ranges to create new, smaller PDF documents. It's perfect for isolating important pages from a large file, all done securely in your browser."
        
        howToTitle="How to Split a PDF File"
        steps={[
          "Upload Your PDF: Drag and drop your PDF file into the upload area, or click to select it from your computer.",
          "Select Pages to Extract: You can click on individual pages to select them, or use the input field to specify ranges (e.g., '1-5, 8, 11-13'). Use our handy 'Select All', 'Odd', or 'Even' buttons for quick selections.",
          "Split and Download: Once you've selected your pages, click the 'Split PDF' button. The tool will create a zip file containing your new, individual PDF pages, ready for instant download.",
        ]}

        featuresTitle="Features of Our PDF Splitter"
        features={[
          { name: "Complete Privacy", description: "Your files are processed entirely in your browser. They never leave your device, ensuring your information remains 100% private." },
          { name: "Flexible Page Selection", description: "Select pages individually, in ranges, or use quick-select buttons for odd and even pages. You have full control." },
          { name: "High-Quality Extraction", description: "Pages are extracted with no loss of quality, preserving the original text, images, and layout." },
          { name: "No Uploads, No Waiting", description: "Since everything is processed locally, there's no need to wait for files to upload or download from a server." },
          { name: "Free and Unlimited", description: "Split as many PDFs as you need without any cost or registration." },
          { name: "Works on All Devices", description: "Our tool is a web-based application that works on any modern browser, on any device.", },
        ]}

        useCasesTitle="When Should You Split a PDF?"
        useCases={[
          "To extract a single chapter or section from a long book or report.",
          "To separate a multi-page invoice or report into individual pages.",
          "To share only the relevant pages of a document with others.",
          "To reduce the file size of a large PDF by removing unnecessary pages.",
        ]}

        faqTitle="Frequently Asked Questions"
        faq={[
          { q: "Is it secure to use this tool with confidential documents?", a: "Yes. Security is our top priority. All operations are performed locally on your computer. Your files are never sent over the internet, so they remain completely private." },
          { q: "Can I extract multiple, non-consecutive pages?", a: "Absolutely. You can select individual pages by clicking on them, or you can specify them in the range input, like '2, 5, 9'." },
          { q: "Will the extracted pages maintain their original formatting?", a: "Yes, the extracted pages will be identical to the originals, with all formatting, images, and text preserved." },
          { q: "Why are the split pages downloaded as a zip file?", a: "To make it easy to download multiple new PDF files at once, we package them into a single, convenient zip file." },
        ]}
      />
    </ToolLayout>
  );
}