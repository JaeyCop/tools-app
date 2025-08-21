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

      {/* Educational Content Section */}
      <div className="mt-16 space-y-12">
        {/* Understanding PDF to Image Conversion */}
        <section className="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-violet-500 rounded-xl">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            PDF to Image Conversion Technology
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Rendering Process</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                PDF to image conversion involves rendering each PDF page as a raster image using advanced graphics engines. Our tool preserves all visual elements including text, images, and vector graphics.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Vector graphics rasterization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Font rendering and anti-aliasing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Color space conversion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Resolution scaling and optimization</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Output Format Options</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">PNG Format</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Lossless compression with transparency support. Ideal for documents with text, graphics, and precise details.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">JPEG Format</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Lossy compression with smaller file sizes. Perfect for image-heavy documents and when file size matters.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-violet-100 dark:bg-violet-900/30 rounded-xl p-6 border border-violet-200 dark:border-violet-700">
            <h4 className="font-semibold text-violet-800 dark:text-violet-200 mb-3">⚙️ Resolution & Quality Control</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-violet-700 dark:text-violet-300">Scale Factor:</span>
                <p className="text-violet-600 dark:text-violet-400">Controls output resolution - 1x for web, 2x+ for print quality</p>
              </div>
              <div>
                <span className="font-medium text-violet-700 dark:text-violet-300">JPEG Quality:</span>
                <p className="text-violet-600 dark:text-violet-400">Adjustable from 50-100% to balance file size and visual quality</p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases and Applications */}
        <section className="bg-surface/80 border border-border rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-xl">
              <Layers className="h-6 w-6 text-white" />
            </div>
            Professional Applications
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                Web & Digital Media
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Website thumbnails and previews</li>
                <li>• Social media content creation</li>
                <li>• Blog post illustrations</li>
                <li>• Email newsletter graphics</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Wand2 className="h-4 w-4 text-white" />
                </div>
                Design & Creative
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Graphic design source material</li>
                <li>• Presentation slide creation</li>
                <li>• Print design elements</li>
                <li>• Digital artwork references</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                Documentation
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Archive page preservation</li>
                <li>• Document digitization</li>
                <li>• Evidence and record keeping</li>
                <li>• Educational material creation</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">🎯 Conversion Strategy Guide</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Choose PNG When:</h5>
                <ul className="text-amber-600 dark:text-amber-400 space-y-1">
                  <li>• Document contains text or line art</li>
                  <li>• Transparency is needed</li>
                  <li>• Maximum quality is required</li>
                  <li>• File size is not a primary concern</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Choose JPEG When:</h5>
                <ul className="text-amber-600 dark:text-amber-400 space-y-1">
                  <li>• Document is image-heavy</li>
                  <li>• Smaller file sizes are needed</li>
                  <li>• Web distribution is planned</li>
                  <li>• Email sharing is required</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quality and Resolution Guide */}
        <section className="bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-900/20 dark:via-sky-900/20 dark:to-blue-900/20 rounded-2xl border border-cyan-200 dark:border-cyan-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-cyan-500 rounded-xl">
              <Sliders className="h-6 w-6 text-white" />
            </div>
            Quality & Resolution Optimization
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Scale Factor Guidelines</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-foreground">1x Scale</span>
                    <span className="text-cyan-600 font-bold">72-96 DPI</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Standard web resolution. Perfect for online viewing, social media, and screen display.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-sky-200 dark:border-sky-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-foreground">2x Scale</span>
                    <span className="text-sky-600 font-bold">144-192 DPI</span>
                  </div>
                  <p className="text-sm text-muted-foreground">High-resolution output. Ideal for retina displays, detailed graphics, and light printing.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-foreground">3x+ Scale</span>
                    <span className="text-blue-600 font-bold">216+ DPI</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Print quality resolution. Best for professional printing, large format displays, and archival purposes.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Quality Optimization Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Match resolution to use case:</span>
                    <span className="text-muted-foreground ml-2">Higher scales for print, lower for web</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Consider file size impact:</span>
                    <span className="text-muted-foreground ml-2">Higher scales create exponentially larger files</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Test JPEG quality settings:</span>
                    <span className="text-muted-foreground ml-2">85-95% usually provides excellent results</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Process selectively:</span>
                    <span className="text-muted-foreground ml-2">Convert only needed pages to save time and storage</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-xl p-6 border border-cyan-200 dark:border-cyan-700">
            <h4 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-3">📏 File Size Estimation</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-cyan-700 dark:text-cyan-300">1x PNG:</span>
                <p className="text-cyan-600 dark:text-cyan-400">~200-500KB per page (text documents)</p>
              </div>
              <div>
                <span className="font-medium text-cyan-700 dark:text-cyan-300">2x PNG:</span>
                <p className="text-cyan-600 dark:text-cyan-400">~800KB-2MB per page (high detail)</p>
              </div>
              <div>
                <span className="font-medium text-cyan-700 dark:text-cyan-300">JPEG (85%):</span>
                <p className="text-cyan-600 dark:text-cyan-400">~50-200KB per page (compressed)</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ToolSeoContent
        title="Convert PDF to Images"
        overview="Easily transform each page of your PDF document into a high-quality image. Our tool lets you convert PDFs to popular formats like PNG and JPG, giving you the flexibility to use your document content in new ways. The entire process is fast, secure, and happens right in your browser."
        
        howToTitle="How to Convert PDF to Images"
        steps={[
          "Upload Your PDF: Drag and drop your PDF file into the upload area, or click to select it from your device.",
          "Configure Your Output: Choose your desired image format (PNG or JPG). You can also adjust the resolution (scale) for higher quality images and set the quality for JPG files.",
          "Convert & Download: Click the 'Start Conversion' button. The tool will process each page and provide a zip file containing all your new images, ready for instant download."
        ]}

        featuresTitle="Features of Our PDF to Image Converter"
        features={[
          { name: "Client-Side Processing", description: "Your privacy is guaranteed. All conversions happen directly on your device, and your files are never uploaded to any server." },
          { name: "Multiple Formats", description: "Choose to convert your PDF pages to either PNG for high-quality transparency or JPG for smaller file sizes." },
          { name: "Adjustable Resolution", description: "Increase the scale to generate higher resolution images, perfect for printing or high-detail applications." },
          { name: "Page Selection", description: "Optionally, you can specify which pages you want to convert, giving you more control over the output." },
          { name: "Free and Unlimited", description: "Convert as many PDFs as you want, as often as you want, with no restrictions." },
          { name: "Batch Download", description: "All your converted images are conveniently packaged into a single zip file for easy downloading.", },
        ]}

        useCasesTitle="Why Convert a PDF to Images?"
        useCases={[
          "To embed a page into a website or presentation.",
          "To share a document on social media platforms that don't support PDFs.",
          "To use a page of a PDF as a thumbnail or preview image.",
          "To edit or annotate a PDF page in an image editing software."
        ]}

        faqTitle="Frequently Asked Questions"
        faq={[
          { q: "Is this tool safe for sensitive documents?", a: "Yes. Because all processing is done in your browser, your files never leave your computer. This makes our tool one of the most secure ways to convert PDFs to images online." },
          { q: "What is the difference between PNG and JPG?", a: "PNG is a lossless format, which means it preserves all the original quality, making it great for text and graphics. JPG is a lossy format that offers smaller file sizes, making it ideal for photographs." },
          { q: "What does the 'scale' option do?", a: "The scale option increases the resolution of the output images. A higher scale (e.g., 2x) will result in a larger, more detailed image, but also a larger file size." },
          { q: "Can I convert a password-protected PDF?", a: "No, our tool cannot process password-protected PDFs. You will need to remove the password before you can convert the file."
        ]}
      />
    </ToolLayout>
  );
}