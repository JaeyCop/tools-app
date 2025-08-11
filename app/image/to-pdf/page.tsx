"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";
import { PDFDocument, StandardFonts } from "pdf-lib";
import ToolSeoContent from "@/components/ToolSeoContent";
import SeoHowToJsonLd from "@/components/SeoHowToJsonLd";
import SeoFaqJsonLd from "@/components/SeoFaqJsonLd";
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

  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Images to PDF</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Combine multiple images into a single, printable PDF. Reorder as needed and export instantly.
            </p>
          </div>
          {files.length > 0 && (
            <button
              onClick={() => { setFiles([]); setPdfUrl(null); setErrorMessage(null); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="card-premium shadow-premium overflow-hidden mb-8">
          <div className="p-8">
            <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  className={`relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'}`}
                >
                  <input {...getInputProps()} />
                  <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                    <div className="mb-6">
                      {isDragActive ? (
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                          <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">{isDragActive ? "Drop your images here!" : "Upload your images"}</p>
                      <p className="text-gray-500 dark:text-gray-400">PNG, JPG, JPEG, WebP • Multiple files supported</p>
                    </div>
                  </div>
                </div>
              )}
            </Dropzone>

            {files.length > 0 && (
              <ul className="mt-6 divide-y rounded-2xl border bg-white/70 dark:bg-black/30 max-h-80 overflow-auto">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="p-4 flex items-center justify-between gap-4"
                    tabIndex={0}
                    role="option"
                    aria-label={`File ${file.name} at position ${index + 1}`}
                    draggable
                    onDragStart={onDragStart(index)}
                    onDragOver={onDragOver(index)}
                    onDrop={onDropReorder(index)}
                    onKeyDown={(e) => onKeyReorder(e, index)}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" className="px-2 py-1 text-xs rounded border" onClick={() => move(index, Math.max(0, index - 1))} disabled={index === 0}>
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button type="button" className="px-2 py-1 text-xs rounded border" onClick={() => move(index, Math.min(files.length - 1, index + 1))} disabled={index === files.length - 1}>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="card-premium p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Settings className="w-5 h-5 text-blue-600" /></div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Options</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page size</label>
                    <select value={pagePreset} onChange={(e) => setPagePreset(e.target.value as PagePreset)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white">
                      <option value="auto">Auto (match image)</option>
                      <option value="a4">A4 (595 × 842)</option>
                      <option value="letter">Letter (612 × 792)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fit mode</label>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Margins</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min={0} max={72} step={2} value={marginPoints} onChange={(e) => setMarginPoints(parseInt(e.target.value, 10))} className="flex-1" />
                      <input type="number" min={0} max={144} step={2} value={marginPoints} onChange={(e) => setMarginPoints(Number.isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10))} className="w-20 rounded border px-2 py-1 bg-white dark:bg-gray-700" />
                      <span className="text-xs text-gray-500">pt</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={labelFilenames} onChange={(e) => setLabelFilenames(e.target.checked)} />
                      <span className="text-sm">Label each page with filename</span>
                    </label>
                    {pagePreset !== "auto" && (
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={autoOrientation} onChange={(e) => setAutoOrientation(e.target.checked)} />
                        <span className="text-sm">Auto orientation (match image)</span>
                      </label>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output filename</label>
                      <input value={outputName} onChange={(e) => setOutputName(e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Export</h3>
                </div>
                <button type="button" onClick={buildPdf} disabled={!canExport} className={`w-full group relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${canExport ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'}`}>
                  {isProcessing ? (<span className="inline-flex items-center gap-2"><Spinner /> Building…</span>) : (<span className="inline-flex items-center gap-2">Build PDF <Download className="w-5 h-5" /></span>)}
                  {!isProcessing && canExport && (<div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />)}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {isProcessing && (
                <div className="card-premium p-6 sm:p-8">
                  <div className="space-y-2">
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              )}
              {pdfUrl && !isProcessing ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">PDF Ready</h3>
                  </div>
                  <a className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" href={pdfUrl} download={outputName || "images.pdf"}>
                    <Download className="w-5 h-5" /> Download {outputName || 'images.pdf'}
                  </a>
                </div>
              ) : (
                <div className="card-premium p-6 sm:p-8">
                  <div className="text-sm text-gray-600 dark:text-gray-400">No output yet. Add images and click Build PDF.</div>
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-red-800 dark:text-red-200">{errorMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview thumbnails */}
        {previews.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview (first {previews.length} images)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previews.map((p, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.name} className="w-full h-28 object-cover" />
                  <div className="px-2 py-1 text-[11px] truncate text-gray-600 dark:text-gray-300">{p.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">🔒 Conversion happens locally in your browser. Nothing is uploaded.</p>
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
    </div>
  );
}
