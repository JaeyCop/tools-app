"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import { FileText, Image as ImageIcon, Download, Upload, Settings, Zap, Info, CheckCircle, Sliders, Layers, X, Wand2, Sparkles } from "lucide-react";
import ToolSeoContent from "@/components/ToolSeoContent";
import SeoHowToJsonLd from "@/components/SeoHowToJsonLd";
import SeoFaqJsonLd from "@/components/SeoFaqJsonLd";
import { ToolLayout } from '@/components/ToolLayout';

type OutputFormat = "image/png" | "image/jpeg";

export default function PdfToImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [scale, setScale] = useState<number>(2);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [jpegQuality, setJpegQuality] = useState<number>(0.92);
  const [zipName, setZipName] = useState<string>("pages.zip");
  const [includeRange, setIncludeRange] = useState<string>(""); // e.g. 1-3,5,7-8
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const urlsToRevokeRef = useRef<string[]>([]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    const urlsToRevoke = urlsToRevokeRef.current;
    return () => {
      urlsToRevoke.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const onDrop = useCallback((accepted: File[]) => {
    const first = accepted.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (first) {
      setFile(first);
      setImageUrls([]);
      setZipUrl(null);
      setErrorMessage(null);
      setProgress(null);
      setSelectedPages(new Set());
      setPageCount(null);
      // Peek the page count quickly (best-effort)
      (async () => {
        try {
          const pdfjs = await import("pdfjs-dist");
          // Set up the worker
          if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
            pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
          }
          const getDocument = pdfjs.getDocument;
          const data = await first.arrayBuffer();
          const pdf = await getDocument({ data }).promise;
          setPageCount(pdf.numPages);
        } catch (error) {
          console.error('Error loading PDF:', error);
        }
      })();
    }
  }, []);

  const canExport = useMemo(() => !!file && !isProcessing, [file, isProcessing]);

  const parseRange = (text: string, max: number): number[] => {
    if (!text.trim()) return Array.from({ length: max }, (_, i) => i + 1);
    const parts = text.split(/[,\s]+/).filter(Boolean);
    const result = new Set<number>();
    for (const part of parts) {
      const m = part.match(/^(\d+)(?:-(\d+))?$/);
      if (!m) continue;
      const start = Math.max(1, Math.min(max, parseInt(m[1], 10)));
      const end = m[2] ? Math.max(1, Math.min(max, parseInt(m[2], 10))) : start;
      const [lo, hi] = start <= end ? [start, end] : [end, start];
      for (let p = lo; p <= hi; p++) result.add(p);
    }
    return Array.from(result).sort((a, b) => a - b);
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setImageUrls([]);
    setZipUrl(null);
    setProgress({ current: 0, total: 0 });

    try {
      const [pdfjs, { default: JSZip }] = await Promise.all([
        import("pdfjs-dist"),
        import("jszip"),
      ]);

      // Set up the worker
      if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }

      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;

      const pagesToProcess = (() => {
        if (!includeRange.trim()) return Array.from({ length: pdf.numPages }, (_, i) => i + 1);
        return parseRange(includeRange, pdf.numPages);
      })();

      setProgress({ current: 0, total: pagesToProcess.length });

      const zip = new JSZip();
      const urls: string[] = [];

      for (let i = 0; i < pagesToProcess.length; i++) {
        const pageNum = pagesToProcess[i];
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: Math.max(1, Math.min(4, scale)) });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unsupported");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;

        const mime: OutputFormat = outputFormat;
        const quality = mime === "image/jpeg" ? jpegQuality : 0.92;
        const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), mime, quality));

        const url = URL.createObjectURL(blob);
        urls.push(url);
        urlsToRevokeRef.current.push(url);

        const buf = await blob.arrayBuffer();
        const ext = mime === "image/jpeg" ? "jpg" : "png";
        zip.file(`page-${pageNum}.${ext}`, buf);

        setProgress({ current: i + 1, total: pagesToProcess.length });
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipObjectUrl = URL.createObjectURL(zipBlob);
      urlsToRevokeRef.current.push(zipObjectUrl);
      setImageUrls(urls);
      setZipUrl(zipObjectUrl);
    } catch (e) {
      console.error('PDF to Images conversion error:', e);
      setErrorMessage(e instanceof Error ? e.message : "PDF processing failed");
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const toggleSelectQuick = (type: "all" | "odd" | "even") => {
    if (!pageCount) return;
    const set = new Set<number>();
    for (let i = 1; i <= pageCount; i++) {
      const condition = type === "all" ? true : type === "odd" ? i % 2 === 1 : i % 2 === 0;
      if (condition) set.add(i);
    }
    setSelectedPages(set);
    setIncludeRange(Array.from(set).join(","));
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Conversion Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Conversion Settings
        </h3>

        {/* Resolution */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Resolution (scale)</label>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">x{scale.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Output format */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Output format</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
          >
            <option value="image/png">PNG (lossless, larger)</option>
            <option value="image/jpeg">JPEG (smaller, adjustable quality)</option>
          </select>
        </div>

        {/* JPEG quality */}
        {outputFormat === "image/jpeg" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">JPEG Quality</label>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{Math.round(jpegQuality * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1}
              step={0.01}
              value={jpegQuality}
              onChange={(e) => setJpegQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}

        {/* Page range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Pages to convert</label>
          <input
            type="text"
            placeholder={pageCount ? `e.g. 1-${pageCount},5,7-9` : "e.g. 1-5,7"}
            value={includeRange}
            onChange={(e) => setIncludeRange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
          />
          {pageCount && (
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <button type="button" onClick={() => toggleSelectQuick("all")} className="px-2 py-1 rounded border border-border text-muted-foreground hover:bg-muted transition-colors">All</button>
              <button type="button" onClick={() => toggleSelectQuick("odd")} className="px-2 py-1 rounded border border-border text-muted-foreground hover:bg-muted transition-colors">Odd</button>
              <button type="button" onClick={() => toggleSelectQuick("even")} className="px-2 py-1 rounded border border-border text-muted-foreground hover:bg-muted transition-colors">Even</button>
              <span className="text-muted-foreground">Format: 1-3,5,8-12</span>
            </div>
          )}
        </div>

        {/* Zip name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">ZIP filename</label>
          <input
            type="text"
            value={zipName}
            onChange={(e) => setZipName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
          />
        </div>
      </div>

      {/* Convert button & progress */}
      {file && (
        <button
          type="button"
          onClick={convert}
          disabled={!canExport}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner />
              <span>Converting…</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Wand2 className="w-5 h-5" />
              <span>Start conversion</span>
            </div>
          )}
        </button>
      )}

      {file && (
        <button
          onClick={() => { setFile(null); setImageUrls([]); setZipUrl(null); setProgress(null); setSelectedPages(new Set()); setIncludeRange(""); }}
          className="w-full px-4 py-2 bg-red-500/10 text-red-600 rounded-xl text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      )}

      {/* Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Higher scale produces sharper images but larger files. PNG is lossless; JPEG can be ~40% smaller at 85-95% quality.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="PDF to Images"
      description="Convert each PDF page into a high-quality image. Choose format, resolution, and page ranges."
      icon={<ImageIcon className="h-8 w-8 text-primary" />}
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

        {/* Selected file info */}
        {file && (
          <div className="p-4 bg-muted/50 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB{pageCount ? ` • ~${pageCount} pages` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setFile(null); setImageUrls([]); setZipUrl(null); setProgress(null); setSelectedPages(new Set()); setIncludeRange(""); }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-sm hover:bg-red-500/20 transition-colors"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Output preview */}
        {isProcessing && (
          <div className="bg-card rounded-xl p-6 border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Skeleton className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                <Skeleton className="w-48 h-6" />
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-auto pr-1">
              <Skeleton className="w-full h-48" />
              <Skeleton className="w-full h-48" />
              <Skeleton className="w-full h-48" />
              <Skeleton className="w-full h-48" />
            </div>
          </div>
        )}
        {imageUrls.length > 0 && !isProcessing && (
          <div className="bg-card rounded-xl p-6 border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Preview ({imageUrls.length})</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-auto pr-1">
              {imageUrls.map((u, i) => (
                <div key={i} className="relative group">
                  <img src={u} alt={`Page ${i + 1}`} className="w-full h-auto rounded-lg border border-border shadow-sm" />
                  <div className="absolute top-1 left-1 text-xs bg-background/80 text-foreground rounded px-1.5 py-0.5">{i + 1}</div>
                  <div className="absolute inset-0 rounded-lg bg-transparent group-hover:bg-foreground/5 transition-colors" />
                </div>
              ))}
            </div>

            {zipUrl && (
              <a
                className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-success hover:bg-success/90 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                href={zipUrl}
                download={zipName || "pages.zip"}
              >
                <Download className="w-5 h-5" />
                Download {zipName || 'pages.zip'}
              </a>
            )}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-error/5 border border-error/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error-foreground">
                {errorMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="mt-12 text-center text-muted-foreground">
        <p className="text-sm">
          🔒 All conversions run locally in your browser. Files never leave your device.
        </p>
      </div>

      <ToolSeoContent
        title="PDF to Images"
        overview="Convert PDF pages to PNG or JPG for easy sharing and publishing."
        steps={["Upload your PDF", "Choose format (PNG/JPG)", "Set DPI/quality", "Export images or ZIP"]}
        tips={["PNG for diagrams/text; JPG for photos", "Higher DPI increases clarity and file size"]}
        privacyNote="Conversion runs in your browser. Files are not uploaded."
      />
      <SeoHowToJsonLd
        name="How to convert PDF to images"
        description="Convert PDF pages to PNG or JPG online."
        steps={[{ name: "Upload your PDF" }, { name: "Choose image format" }, { name: "Click Export and download" }]}
      />
      <SeoFaqJsonLd id="pdf-to-images" items={[{ question: "Are my files uploaded?", answer: "No, conversion is performed locally in your browser." }]} />
    </ToolLayout>
  );
}