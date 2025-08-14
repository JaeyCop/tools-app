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

        {/* SEO content and JSON-LD */}
        <ToolSeoContent
          title="Merge PDFs"
          overview="Merge multiple PDFs into a single, organized document. Perfect for combining invoices, scanned pages, reports, and more."
          steps={[
            "Click or drop your PDF files",
            "Reorder by dragging the list",
            "Choose Append or Interleave",
            "Optionally add page labels",
            "Click Merge and download your file",
          ]}
          tips={[
            "Use Interleave for duplex scans",
            "Run the result through Compress PDF if size is large",
            "Keep source PDFs in similar orientation",
          ]}
          privacyNote="All processing happens locally in your browser. Your files never leave your device."
          faq={[
            { q: "Is there a file size limit?", a: "Very large files depend on your device memory. Try merging fewer files at once if you encounter issues." },
            { q: "Are my files uploaded?", a: "No. Everything runs in your browser; nothing is sent to a server." },
          ]}
        />
        <SeoHowToJsonLd
          name="How to merge PDF files"
          description="Combine multiple PDF files into a single document online."
          steps={[
            { name: "Upload your PDF files" },
            { name: "Reorder files as needed" },
            { name: "Choose merge mode (Append or Interleave)" },
            { name: "Click Merge and download the result" },
          ]}
        />
        <SeoFaqJsonLd
          id="merge-pdf"
          items={[
            { question: "Are my files uploaded?", answer: "No. Everything runs in your browser; nothing is sent to a server." },
            { question: "Why is the merged file large?", answer: "Use the Compress PDF tool to reduce size while preserving readability." },
          ]}
        />
    </ToolLayout>
  );
}
