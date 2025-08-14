"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import FileValidation from "@/components/ui/FileValidation";
import FilePreview from "@/components/ui/FilePreview";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { PDFDocument, StandardFonts } from "pdf-lib";
import ToolSeoContent from "@/components/ToolSeoContent";
import SeoHowToJsonLd from "@/components/SeoHowToJsonLd";
import SeoFaqJsonLd from "@/components/SeoFaqJsonLd";
import { ToolLayout } from '@/components/ToolLayout';
import { Upload, FileText, Download, ChevronUp, ChevronDown, X, Settings, CheckCircle } from "lucide-react";

type PagePreset = "auto" | "a4" | "letter";
type FitMode = "contain" | "cover";

const PAGE_SIZES: Record<Exclude<PagePreset, "auto">, { w: number; h: number }> = {
  a4: { w: 595, h: 842 }, // 210 × 297 mm @ 72 dpi
  letter: { w: 612, h: 792 }, // 8.5 × 11 in @ 72 dpi
};

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pagePreset, setPagePreset] = useState<PagePreset>("auto");
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [marginPoints, setMarginPoints] = useState<number>(24); // 24pt = 1/3 inch
  const [labelFilenames, setLabelFilenames] = useState<boolean>(true);
  const [outputName, setOutputName] = useState<string>("images.pdf");
  const [autoOrientation, setAutoOrientation] = useState<boolean>(true);

  // Drag-and-drop reorder state
  const dragIndexRef = useRef<number | null>(null);

  // Preview thumbnails (first few images)
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);

  // Load saved options on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("imagesToPdf.options");
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.pagePreset) setPagePreset(saved.pagePreset);
        if (saved.fitMode) setFitMode(saved.fitMode);
        if (typeof saved.marginPoints === "number") setMarginPoints(saved.marginPoints);
        if (typeof saved.labelFilenames === "boolean") setLabelFilenames(saved.labelFilenames);
        if (typeof saved.autoOrientation === "boolean") setAutoOrientation(saved.autoOrientation);
        if (typeof saved.outputName === "string") setOutputName(saved.outputName);
      }
    } catch {}
  }, []);

  // Persist options when they change
  useEffect(() => {
    const data = { pagePreset, fitMode, marginPoints, labelFilenames, outputName, autoOrientation };
    try { localStorage.setItem("imagesToPdf.options", JSON.stringify(data)); } catch {}
  }, [pagePreset, fitMode, marginPoints, labelFilenames, outputName, autoOrientation]);

  // Build previews for the first 8 images
  useEffect(() => {
    // Revoke previous URLs
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
    if (!files.length) return;
    const slice = files.slice(0, 8);
    const urls = slice.map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setPreviews(urls);
    return () => {
      urls.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [files]);

  const onDrop = useCallback((accepted: File[]) => {
    const imgs = accepted.filter((f) => f.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(f.name));
    if (imgs.length) {
      setFiles((prev) => [...prev, ...imgs]);
      setPdfUrl(null);
      setErrorMessage(null);
    }
  }, []);

  const move = (from: number, to: number) => {
    setFiles((prev) => {
      const clone = [...prev];
      const [item] = clone.splice(from, 1);
      clone.splice(to, 0, item);
      return clone;
    });
  };

  const onKeyReorder = (e: React.KeyboardEvent<HTMLLIElement>, index: number) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index > 0) move(index, index - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (index < files.length - 1) move(index, index + 1);
    }
  };

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDropReorder = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from == null || from === index) return;
    move(from, index);
  };

  const canExport = useMemo(() => files.length > 0 && !isProcessing, [files.length, isProcessing]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+Enter': () => canExport && buildPdf(),
    'Escape': () => setErrorMessage(null),
    'Delete': () => files.length > 0 && setFiles(prev => prev.slice(0, -1)),
  });

  const buildPdf = async () => {
    setIsProcessing(true);
    setPdfUrl(null);
    setErrorMessage(null);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const ext = (file.type || '').toLowerCase();
        const image = ext.includes("png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const imgDims = image.scale(1);

        // Determine page size
        let pageW: number;
        let pageH: number;
        if (pagePreset === "auto") {
          // If auto, size the page to the image plus margins
          pageW = Math.max(1, imgDims.width + marginPoints * 2);
          pageH = Math.max(1, imgDims.height + marginPoints * 2);
        } else {
          const base = PAGE_SIZES[pagePreset];
          if (autoOrientation) {
            const landscape = imgDims.width >= imgDims.height;
            pageW = landscape ? Math.max(base.w, base.h) : Math.min(base.w, base.h);
            pageH = landscape ? Math.min(base.w, base.h) : Math.max(base.w, base.h);
          } else {
            pageW = base.w;
            pageH = base.h;
          }
        }

        const page = doc.addPage([pageW, pageH]);

        // Compute draw rect with fit
        const contentW = Math.max(1, pageW - marginPoints * 2);
        const contentH = Math.max(1, pageH - marginPoints * 2);
        const scaleContain = Math.min(contentW / imgDims.width, contentH / imgDims.height);
        const scaleCover = Math.max(contentW / imgDims.width, contentH / imgDims.height);
        const scale = fitMode === "cover" ? scaleCover : scaleContain;
        const drawW = imgDims.width * scale;
        const drawH = imgDims.height * scale;
        const x = (pageW - drawW) / 2;
        const y = (pageH - drawH) / 2;

        page.drawImage(image, { x, y, width: drawW, height: drawH });

        if (labelFilenames) {
          const text = file.name;
          const size = 10;
          // Place label near bottom-left inside margin
          const tx = Math.max(8, marginPoints);
          const ty = Math.max(8, marginPoints - 2);
          page.drawText(text, { x: tx, y: ty, size, font });
        }
      }

      const out = await doc.save();
      const buf = new ArrayBuffer(out.length);
      new Uint8Array(buf).set(out);
      const blob = new Blob([buf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "PDF creation failed");
      setErrorMessage("Failed to build PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Options
        </h3>
        <div className="grid md:grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Page size</label>
            <select value={pagePreset} onChange={(e) => setPagePreset(e.target.value as PagePreset)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
              <option value="auto">Auto (match image)</option>
              <option value="a4">A4 (595 × 842)</option>
              <option value="letter">Letter (612 × 792)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fit mode</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="fit" value="contain" checked={fitMode === "contain"} onChange={() => setFitMode("contain")} />
                <span className="text-sm">Contain</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="fit" value="cover" checked={fitMode === "cover"} onChange={() => setFitMode("cover")} />
                <span className="text-sm">Cover</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Margins</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={72} step={2} value={marginPoints} onChange={(e) => setMarginPoints(parseInt(e.target.value, 10))} className="flex-1 accent-primary" />
              <input type="number" min={0} max={144} step={2} value={marginPoints} onChange={(e) => setMarginPoints(Number.isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10))} className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-foreground" />
              <span className="text-xs text-muted-foreground">pt</span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={labelFilenames} onChange={(e) => setLabelFilenames(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/20" />
              <span className="text-sm">Label each page with filename</span>
            </label>
            {pagePreset !== "auto" && (
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={autoOrientation} onChange={(e) => setAutoOrientation(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/20" />
                <span className="text-sm">Auto orientation (match image)</span>
              </label>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Output filename</label>
              <input value={outputName} onChange={(e) => setOutputName(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Build PDF Button */}
      {files.length > 0 && (
        <button type="button" onClick={buildPdf} disabled={!canExport} className={`w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}>
          {isProcessing ? (<span className="inline-flex items-center gap-2"><LoadingSpinner size="sm" /> Building…</span>) : (<span className="inline-flex items-center gap-2">Build PDF <Download className="w-5 h-5" /></span>)}
        </button>
      )}

      {files.length > 0 && (
        <button
          onClick={() => { setFiles([]); setPdfUrl(null); setErrorMessage(null); }}
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
      title="Images to PDF"
      description="Combine multiple images into a single, printable PDF. Reorder as needed and export instantly."
      icon={<FileText className="h-8 w-8 text-primary" />}
      sidebar={sidebarContent}
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center cursor-pointer transition-all duration-300 group ${isDragActive ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}
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
                  <h3 className="text-xl font-semibold text-foreground">{isDragActive ? "Drop your images here!" : "Upload Image Files"}</h3>
                  <p className="text-muted-foreground">Drag & drop multiple image files or click to browse</p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Multiple files</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Max 100MB total</span>
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
                Files to Convert ({files.length})
              </h3>
              <div className="text-sm text-muted-foreground">
                Drag to reorder
              </div>
            </div>

            <ul className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  tabIndex={0}
                  role="option"
                  aria-label={`File ${file.name} at position ${index + 1}`}
                  draggable
                  onDragStart={onDragStart(index)}
                  onDragOver={onDragOver(index)}
                  onDrop={onDropReorder(index)}
                  onKeyDown={(e) => onKeyReorder(e, index)}
                >
                  <div className="flex items-center gap-4">
                    {/* Drag Handle */}
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grip-vertical"><circle cx="12" cy="5" r="1"/><path d="M12 17v-6"/><circle cx="12" cy="19" r="1"/></svg>
                    </div>

                    {/* File Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FilePreview file={file} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {file.name}
                        </p>
                        <FileValidation file={file} maxSize={100} allowedTypes={['image']} className="mt-1" />
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
                        onClick={() => move(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-lg hover:bg-surface-elevated/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => move(index, Math.min(files.length - 1, index + 1))}
                        disabled={index === files.length - 1}
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-lg hover:bg-error/10 transition-colors group"
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                        title="Remove file"
                      >
                        <X className="w-4 h-4 text-muted-foreground group-hover:text-error transition-colors" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Results Section */}
        {errorMessage && (
          <div className="mt-6 animate-slide-up">
            <ErrorMessage
              error={errorMessage}
              onRetry={() => setErrorMessage(null)}
              suggestions={[
                "Check that all files are valid images",
                "Try with fewer images if memory is limited",
                "Ensure images aren't corrupted"
              ]}
            />
          </div>
        )}

        {pdfUrl && (
          <div className="mt-6 animate-slide-up">
            <div className="bg-gradient-to-br from-success/10 via-success/5 to-accent/10 border border-success/20 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-success/20 to-success/10 border border-success/20">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">PDF Ready!</h3>
                  <p className="text-muted-foreground">Your images have been successfully converted to PDF.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={pdfUrl}
                  download={outputName || "images.pdf"}
                  className="flex-1 btn-premium bg-gradient-to-r from-success to-success/80 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-success/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download {outputName || 'images.pdf'}
                </a>

                <button
                  onClick={() => { setFiles([]); setPdfUrl(null); setErrorMessage(null); }}
                  className="px-6 py-3 bg-surface border border-border rounded-xl text-foreground hover:bg-surface-elevated transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  Convert More Images
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview thumbnails */}
        {previews.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-3">Preview (first {previews.length} images)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previews.map((p, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.name} className="w-full h-28 object-cover" />
                  <div className="px-2 py-1 text-[11px] truncate text-muted-foreground">{p.name}</div>
                </div>
              ))}
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

        <ToolSeoContent
          title="Images to PDF"
          overview="Combine multiple images into a single, printable PDF in seconds."
          steps={["Upload images", "Reorder as needed", "Choose page size/margins", "Export to PDF"]}
          tips={["Keep all images same orientation for clean layout"]}
          privacyNote="Processing happens locally in your browser; files are never uploaded."
        />
        <SeoHowToJsonLd
          name="How to combine images into a PDF"
          description="Turn images into a printable PDF online."
          steps={[{ name: "Upload images" }, { name: "Reorder as needed" }, { name: "Click Export and download" }]}
        />
        <SeoFaqJsonLd id="images-to-pdf" items={[{ question: "Are my files uploaded?", answer: "No, processing stays in your browser." }]} />
      </div>
    </ToolLayout>
  );
}