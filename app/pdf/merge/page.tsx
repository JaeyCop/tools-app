"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";
import Dropzone, { FileRejection } from "react-dropzone";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SuccessMessage from "@/components/ui/ErrorMessage";
import FileValidation from "@/components/ui/FileValidation";
import FilePreview from "@/components/ui/FilePreview";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import Skeleton from "@/components/ui/Skeleton";
import { Upload, FileText, Download, Layers, ChevronUp, ChevronDown, X, Settings, Zap, Info, CheckCircle, ArrowRight, GripVertical } from "lucide-react";
import ToolSeoContent from "@/components/ToolSeoContent";
import SeoHowToJsonLd from "@/components/SeoHowToJsonLd";
import SeoFaqJsonLd from "@/components/SeoFaqJsonLd";
import { ToolLayout } from "@/components/ToolLayout";

type MergeMode = "append" | "interleave";

export default function PdfMergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<MergeMode>("append");
  const [outputName, setOutputName] = useState<string>("merged.pdf");
  const [optimize, setOptimize] = useState<boolean>(false);
  const [pageLabels, setPageLabels] = useState<boolean>(false);
  const urlsToRevokeRef = useRef<string[]>([]);

  useEffect(() => () => { urlsToRevokeRef.current.forEach((u) => URL.revokeObjectURL(u)); }, []);

  const onDrop = useCallback((acceptedFiles: File[], _rejections: FileRejection[]) => {
    const pdfs = acceptedFiles.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    setFiles((prev) => [...prev, ...pdfs]);
  }, []);

  const removeAtIndex = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const clone = [...prev];
      const [moved] = clone.splice(fromIndex, 1);
      clone.splice(toIndex, 0, moved);
      return clone;
    });
  };

  const canMerge = useMemo(() => files.length >= 2 && !isMerging, [files.length, isMerging]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+Enter': () => canMerge && handleMerge(),
    'Escape': () => setErrorMessage(null),
    'Delete': () => files.length > 0 && removeAtIndex(files.length - 1),
  });

  const handleMerge = async () => {
    try {
      setIsMerging(true);
      setErrorMessage(null);
      setMergedBlobUrl(null);

      const mergedPdf = await PDFDocument.create();
      let labelFont = pageLabels ? await mergedPdf.embedFont(StandardFonts.Helvetica) : null;

      if (mode === "append") {
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          for (let i = 0; i < copiedPages.length; i++) {
            const page = copiedPages[i];
            mergedPdf.addPage(page);
            if (pageLabels && labelFont) {
              const p = mergedPdf.getPage(mergedPdf.getPageCount() - 1);
              p.drawText(file.name, { x: 12, y: 12, size: 10, font: labelFont });
            }
          }
        }
      } else {
        const loaded = await Promise.all(files.map(async (f) => PDFDocument.load(await f.arrayBuffer())));
        const maxPages = Math.max(...loaded.map((p) => p.getPageCount()));
        for (let i = 0; i < maxPages; i++) {
          for (let idx = 0; idx < loaded.length; idx++) {
            const src = loaded[idx];
            if (i >= src.getPageCount()) continue;
            const [copied] = await mergedPdf.copyPages(src, [i]);
            mergedPdf.addPage(copied);
            if (pageLabels && labelFont) {
              const p = mergedPdf.getPage(mergedPdf.getPageCount() - 1);
              p.drawText(files[idx].name, { x: 12, y: 12, size: 10, font: labelFont });
            }
          }
        }
      }

      const bytes = await mergedPdf.save({ useObjectStreams: optimize, addDefaultPage: false });
      const buf = new ArrayBuffer(bytes.length);
      new Uint8Array(buf).set(bytes);
      const blob = new Blob([buf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      urlsToRevokeRef.current.push(url);
      setMergedBlobUrl(url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Merge failed");
      setErrorMessage("Failed to merge PDFs. Please try again.");
    } finally {
      setIsMerging(false);
    }
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Settings */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Merge Settings
        </h3>
        
        <div className="space-y-4">
          {/* Merge Mode */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Merge Mode</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setMode("append")}
                className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                  mode === "append"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30 hover:bg-surface-elevated/50"
                }`}
              >
                <div className="font-medium">Append</div>
                <div className="text-xs text-muted-foreground">Combine files in order</div>
              </button>
              <button
                onClick={() => setMode("interleave")}
                className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                  mode === "interleave"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30 hover:bg-surface-elevated/50"
                }`}
              >
                <div className="font-medium">Interleave</div>
                <div className="text-xs text-muted-foreground">Alternate pages</div>
              </button>
            </div>
          </div>

          {/* Output Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Output Name</label>
            <input
              type="text"
              value={outputName}
              onChange={(e) => setOutputName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus-premium"
              placeholder="merged.pdf"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={optimize}
                onChange={(e) => setOptimize(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20"
              />
              <div>
                <div className="text-sm font-medium text-foreground">Optimize</div>
                <div className="text-xs text-muted-foreground">Reduce file size</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pageLabels}
                onChange={(e) => setPageLabels(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20"
              />
              <div>
                <div className="text-sm font-medium text-foreground">Page Labels</div>
                <div className="text-xs text-muted-foreground">Add page numbering</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Process Button */}
      {files.length > 1 && (
        <button
          onClick={handleMerge}
          disabled={isMerging}
          className="w-full btn-premium bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMerging ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              <span>Merging...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Merge PDFs</span>
            </div>
          )}
        </button>
      )}

      {/* Clear All */}
      {files.length > 0 && (
        <button
          onClick={() => {
            setFiles([]);
            setMergedBlobUrl(null);
            setErrorMessage(null);
          }}
          className="w-full px-4 py-2 bg-error/10 text-error rounded-xl text-sm hover:bg-error/20 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All Files
        </button>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="Merge PDFs"
      description="Combine multiple PDF files in the order you want, or interleave pages across documents."
      icon={<Layers className="h-8 w-8 text-primary" />}
      sidebar={sidebarContent}
    >

        {/* Upload Area */}
        <div className="space-y-6">
          <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center cursor-pointer transition-all duration-300 group ${
                  isDragActive 
                    ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20' 
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <input {...getInputProps()} />
                
                {/* Background decorations */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full opacity-50 animate-float" />
                <div className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }} />
                
                <div className={`relative transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                  <div className="mb-6">
                    {isDragActive ? (
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mx-auto group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                        <FileText className="w-10 h-10 text-muted group-hover:text-primary transition-colors duration-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {isDragActive ? "Drop your PDFs here!" : "Upload PDF Files"}
                    </h3>
                    <p className="text-muted-foreground">
                      Drag & drop multiple PDF files or click to browse
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Multiple files</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Max 200MB total</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Dropzone>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Files to Merge ({files.length})
                </h3>
                <div className="text-sm text-muted-foreground">
                  Drag to reorder
                </div>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {files.map((file, index) => (
                  <div 
                    key={`${file.name}-${index}`} 
                    className="group bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Drag Handle */}
                      <div className="cursor-grab active:cursor-grabbing text-muted hover:text-primary transition-colors">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      
                      {/* File Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FilePreview file={file} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {file.name}
                          </p>
                          <FileValidation file={file} maxSize={200} allowedTypes={['pdf']} className="mt-1" />
                        </div>
                      </div>
                      
                      {/* Order Badge */}
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                          #{index + 1}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button 
                          type="button" 
                          className="p-2 rounded-lg hover:bg-surface-elevated/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                          onClick={() => moveFile(index, Math.max(0, index - 1))} 
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4 text-muted hover:text-primary transition-colors" />
                        </button>
                        <button 
                          type="button" 
                          className="p-2 rounded-lg hover:bg-surface-elevated/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                          onClick={() => moveFile(index, Math.min(files.length - 1, index + 1))} 
                          disabled={index === files.length - 1}
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4 text-muted hover:text-primary transition-colors" />
                        </button>
                        <button 
                          type="button" 
                          className="p-2 rounded-lg hover:bg-error/10 transition-colors group" 
                          onClick={() => removeAtIndex(index)}
                          title="Remove file"
                        >
                          <X className="w-4 h-4 text-muted group-hover:text-error transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {errorMessage && (
          <div className="mt-6 animate-slide-up">
            <ErrorMessage 
              error={errorMessage}
              onRetry={() => setErrorMessage(null)}
              suggestions={[
                "Check that all files are valid PDFs",
                "Try with fewer files if memory is limited",
                "Ensure files aren't password protected"
              ]}
            />
          </div>
        )}

        {mergedBlobUrl && (
          <div className="mt-6 animate-slide-up">
            <div className="bg-gradient-to-br from-success/10 via-success/5 to-accent/10 border border-success/20 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-success/20 to-success/10 border border-success/20">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Merge Complete!</h3>
                  <p className="text-muted-foreground">Your PDF files have been successfully merged.</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={mergedBlobUrl} 
                  download={outputName || "merged.pdf"}
                  className="flex-1 btn-premium bg-gradient-to-r from-success to-success/80 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-success/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download {outputName || 'merged.pdf'}
                </a>
                
                <button
                  onClick={() => {
                    setFiles([]);
                    setMergedBlobUrl(null);
                    setErrorMessage(null);
                  }}
                  className="px-6 py-3 bg-surface border border-border rounded-xl text-foreground hover:bg-surface-elevated transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Merge More Files
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Privacy Notice */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            🔒 All processing happens locally in your browser. Your files never leave your device.
          </div>
        </div>

        {/* Educational Content Section */}
        <div className="mt-16 space-y-12">
          {/* Understanding PDF Merging */}
          <section className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-8">
            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-xl">
                <Layers className="h-6 w-6 text-white" />
              </div>
              Understanding PDF Merging Technology
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">How PDF Merging Works</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  PDF merging combines multiple PDF documents by extracting pages from source files and reconstructing them into a new document. Our tool preserves all original formatting, fonts, images, and interactive elements.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Preserves original page layouts and formatting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Maintains embedded fonts and images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Retains hyperlinks and bookmarks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Combines metadata and document properties</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Merge Modes Explained</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-foreground">Append Mode</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Combines documents sequentially - all pages from Document 1, then all pages from Document 2, etc. Perfect for combining chapters or sections.</p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="font-semibold text-foreground">Interleave Mode</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Alternates pages between documents - Page 1 from Doc A, Page 1 from Doc B, Page 2 from Doc A, etc. Ideal for combining front/back scans.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">🔧 Advanced Features</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-indigo-700 dark:text-indigo-300">Page Labels:</span>
                  <p className="text-indigo-600 dark:text-indigo-400">Add source filename as watermark on each page for easy identification</p>
                </div>
                <div>
                  <span className="font-medium text-indigo-700 dark:text-indigo-300">Optimization:</span>
                  <p className="text-indigo-600 dark:text-indigo-400">Compress the final document to reduce file size while maintaining quality</p>
                </div>
              </div>
            </div>
          </section>

          {/* Common Use Cases */}
          <section className="bg-surface/80 border border-border rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              Professional Use Cases
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  Document Assembly
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Combine contract sections and appendices</li>
                  <li>• Merge report chapters into final document</li>
                  <li>• Assemble proposal components</li>
                  <li>• Create comprehensive manuals</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  Scanning Workflows
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Combine front and back page scans</li>
                  <li>• Merge multiple scanning sessions</li>
                  <li>• Consolidate receipt collections</li>
                  <li>• Archive document batches</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  Business Operations
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Create monthly financial reports</li>
                  <li>• Combine invoices for accounting</li>
                  <li>• Merge presentation materials</li>
                  <li>• Assemble training documents</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">📋 Merge Strategy Guide</h4>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Before Merging:</h5>
                  <ul className="text-amber-600 dark:text-amber-400 space-y-1">
                    <li>• Organize files in logical order</li>
                    <li>• Check for consistent page orientations</li>
                    <li>• Verify all files open correctly</li>
                    <li>• Consider final document size</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-2">After Merging:</h5>
                  <ul className="text-amber-600 dark:text-amber-400 space-y-1">
                    <li>• Review page order and content</li>
                    <li>• Test hyperlinks and bookmarks</li>
                    <li>• Verify text searchability</li>
                    <li>• Check file size and optimization</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Performance and Optimization */}
          <section className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-8">
            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              Performance & Best Practices
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Optimization Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-foreground">File size management:</span>
                      <span className="text-muted-foreground ml-2">Enable optimization for large documents to reduce final file size</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-foreground">Memory efficiency:</span>
                      <span className="text-muted-foreground ml-2">Process large files in smaller batches to avoid browser memory limits</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-foreground">Quality preservation:</span>
                      <span className="text-muted-foreground ml-2">Original quality is maintained unless optimization is specifically enabled</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-foreground">Batch processing:</span>
                      <span className="text-muted-foreground ml-2">Merge related documents together for better organization</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-foreground">Processing Speed</span>
                      <span className="text-green-600 font-bold">~2-5 sec/file</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Average time to process and merge typical business documents</p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-foreground">Memory Usage</span>
                      <span className="text-blue-600 font-bold">~2-3x file size</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Temporary memory required during processing (automatically freed)</p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-foreground">Quality Retention</span>
                      <span className="text-purple-600 font-bold">100%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Original document quality preserved without optimization</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">⚡ Performance Recommendations</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-orange-700 dark:text-orange-300">Small Files (&lt;10MB each):</span>
                  <p className="text-orange-600 dark:text-orange-400">Merge up to 20-30 files simultaneously</p>
                </div>
                <div>
                  <span className="font-medium text-orange-700 dark:text-orange-300">Medium Files (10-50MB each):</span>
                  <p className="text-orange-600 dark:text-orange-400">Process in batches of 5-10 files</p>
                </div>
                <div>
                  <span className="font-medium text-orange-700 dark:text-orange-300">Large Files (&gt;50MB each):</span>
                  <p className="text-orange-600 dark:text-orange-400">Merge 2-3 files at a time for best performance</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SEO content and JSON-LD */}
        <ToolSeoContent
          title="Effortless PDF Merging"
          overview="Combine multiple PDF files into a single, perfectly organized document right in your browser. Our tool makes it easy to merge invoices, reports, scanned pages, and more, without compromising your privacy. Drag, drop, reorder, and merge—it's that simple."
          
          howToTitle="How to Merge PDF Files in 3 Simple Steps"
          steps={[
            "Upload Your PDFs: Click the upload area or drag and drop all the PDF files you want to merge.",
            "Arrange Your Files: Drag and drop the file previews to set the exact order for your final document. You can also choose between 'Append' mode (tacking files on one after the other) or 'Interleave' mode (alternating pages from each document).",
            "Merge & Download: Customize your output settings, like adding page labels or optimizing the file size, then click the 'Merge PDFs' button. Your new, combined PDF will be ready for download instantly.",
          ]}

          featuresTitle="Key Features of Our PDF Merger"
          features={[
            { name: "Secure & Private", description: "Your files are never uploaded. All merging happens locally on your device, ensuring 100% confidentiality." },
            { name: "Flexible Merge Modes", description: "Choose to append files sequentially or interleave their pages, perfect for duplex (two-sided) scanning." },
            { name: "Intuitive Reordering", description: "Easily drag and drop your files to get the perfect order before merging." },
            { name: "File Size Optimization", description: "Optionally reduce the final file size for easier sharing and storage, without sacrificing quality." },
            { name: "Add Page Labels", description: "Automatically add the original filename as a label on each page for easy reference." },
            { name: "No Limits", description: "Merge as many files as you need, as often as you want. Completely free.", },
          ]}

          useCasesTitle="Common Use Cases for Merging PDFs"
          useCases={[
            "Combine multiple chapters of a book or report into a single document.",
            "Merge scanned receipts, invoices, and other financial documents for easy archiving.",
            "Consolidate different sections of a presentation or project into one file.",
            "Create a single portfolio from various individual PDF works.",
          ]}

          faqTitle="Frequently Asked Questions"
          faq={[
            { q: "Is it safe to merge my PDF files here?", a: "Absolutely. Our tool is designed with privacy as the top priority. All processing happens in your browser, meaning your files never leave your computer. We do not upload, store, or see your data." },
            { q: "Is there a limit to the number of files I can merge?", a: "There are no hard limits on the number of files. However, performance may depend on your computer's memory and the size of the files. For very large jobs, consider merging in smaller batches." },
            { q: "Will the quality of my PDFs be affected?", a: "No, the merging process itself does not alter the quality of your original pages. If you choose the 'Optimize' option, the tool will intelligently reduce the file size with minimal impact on visual quality." },
            { q: "What is the difference between 'Append' and 'Interleave' mode?", a: "'Append' mode simply adds the files one after the other. 'Interleave' mode alternates pages from each document (page 1 from doc A, page 1 from doc B, page 2 from doc A, page 2 from doc B, etc.), which is useful for combining separate front and back side scans." },
          ]}
        />
    </ToolLayout>
  );
}
