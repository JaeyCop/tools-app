"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import { FileText, Image as ImageIcon, Download, Upload, Settings, Zap, Info, CheckCircle, Sliders, Layers, X, Wand2, Sparkles } from "lucide-react";

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
    return () => {
      urlsToRevokeRef.current.forEach((u) => URL.revokeObjectURL(u));
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

  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              PDF to Images
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert each PDF page into a high-quality image. Choose format, resolution, and page ranges.
          </p>
        </div>

        {/* Uploader */}
        <div className="card-premium shadow-premium overflow-hidden mb-8">
          <div className="p-8">
            <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }} multiple={false}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  className={`
                    relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                    ${isDragActive
                      ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]'
                      : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                    <div className="mb-6">
                      {isDragActive ? (
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                          <Upload className="w-8 h-8 text-indigo-500" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                          <FileText className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        {isDragActive ? "Drop your PDF here!" : "Upload your PDF"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">PDF • Max 100MB</p>
                    </div>
                  </div>

                  {/* Decorative */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-full opacity-50" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full opacity-30" />
                </div>
              )}
            </Dropzone>

            {/* Selected file info */}
            {file && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB{pageCount ? ` • ~${pageCount} pages` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFile(null); setImageUrls([]); setZipUrl(null); setProgress(null); setSelectedPages(new Set()); setIncludeRange(""); }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings & Convert */}
        {file && (
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 space-y-6">
                              <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Conversion Settings</h3>
                  </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Resolution */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolution (scale)</label>
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">x{scale.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={4}
                      step={0.01}
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(scale - 1) * 100 / 3}%, #e5e7eb ${(scale - 1) * 100 / 3}%, #e5e7eb 100%)` }}
                    />
                  </div>

                  {/* Output format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output format</label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
                    >
                      <option value="image/png">PNG (lossless, larger)</option>
                      <option value="image/jpeg">JPEG (smaller, adjustable quality)</option>
                    </select>
                  </div>

                  {/* JPEG quality */}
                  {outputFormat === "image/jpeg" && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">JPEG Quality</label>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">{Math.round(jpegQuality * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={1}
                        step={0.01}
                        value={jpegQuality}
                        onChange={(e) => setJpegQuality(parseFloat(e.target.value))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(jpegQuality - 0.5) * 200}%, #e5e7eb ${(jpegQuality - 0.5) * 200}%, #e5e7eb 100%)` }}
                      />
                    </div>
                  )}

                  {/* Page range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pages to convert</label>
                    <input
                      type="text"
                      placeholder={pageCount ? `e.g. 1-${pageCount},5,7-9` : "e.g. 1-5,7"}
                      value={includeRange}
                      onChange={(e) => setIncludeRange(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
                    />
                    {pageCount && (
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                        <button type="button" onClick={() => toggleSelectQuick("all")} className="px-2 py-1 rounded border">All</button>
                        <button type="button" onClick={() => toggleSelectQuick("odd")} className="px-2 py-1 rounded border">Odd</button>
                        <button type="button" onClick={() => toggleSelectQuick("even")} className="px-2 py-1 rounded border">Even</button>
                        <span className="text-gray-500 dark:text-gray-400">Format: 1-3,5,8-12</span>
                      </div>
                    )}
                  </div>

                  {/* Zip name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ZIP filename</label>
                    <input
                      type="text"
                      value={zipName}
                      onChange={(e) => setZipName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Higher scale produces sharper images but larger files. PNG is lossless; JPEG can be ~40% smaller at 85-95% quality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Convert button & progress */}
              <div className="card-premium p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Convert</h3>
                </div>

                <button
                  type="button"
                  onClick={convert}
                  disabled={!canExport}
                  className={`w-full group relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${canExport ? 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'}`}
                >
                  {isProcessing ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner /> Converting…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Wand2 className="w-5 h-5" /> Start conversion
                    </span>
                  )}
                  {!isProcessing && canExport && (
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>

                {progress && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Rendering pages</span>
                      <span>{progress.current} / {progress.total}</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all"
                        style={{ width: progress.total === 0 ? '0%' : `${Math.round((progress.current / progress.total) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Output preview */}
            <div className="space-y-6">
              {isProcessing && (
                <div className="card-premium p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Skeleton className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
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
                <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Preview ({imageUrls.length})</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-auto pr-1">
                    {imageUrls.map((u, i) => (
                      <div key={i} className="relative group">
                        <img src={u} alt={`Page ${i + 1}`} className="w-full h-auto rounded-lg border shadow-sm" />
                        <div className="absolute top-1 left-1 text-xs bg-black/70 text-white rounded px-1.5 py-0.5">{i + 1}</div>
                        <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>

                  {zipUrl && (
                    <a
                      className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      href={zipUrl}
                      download={zipName || "pages.zip"}
                    >
                      <Download className="w-5 h-5" />
                      Download {zipName || 'pages.zip'}
                    </a>
                  )}
                </div>
              )}

              {/* Tips */}
              <div className="card-premium bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-800 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">Pro tips</h3>
                </div>
                <ul className="text-sm text-indigo-900/80 dark:text-indigo-200/90 space-y-2 list-disc list-inside">
                  <li>Use PNG for graphics, diagrams, and text-heavy pages.</li>
                  <li>Use JPEG (90–95%) for photos to save space.</li>
                  <li>Set scale to 2–3 for web, 3–4 for print.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            🔒 All conversions run locally in your browser. Files never leave your device.
          </p>
        </div>
      </div>
    </div>
  );
}
