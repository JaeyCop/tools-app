"use client";

import { useCallback, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";
import { PDFDocument, StandardFonts } from "pdf-lib";
import ToolSeoContent from "@/components/ToolSeoContent";
import SeoHowToJsonLd from "@/components/SeoHowToJsonLd";
import SeoFaqJsonLd from "@/components/SeoFaqJsonLd";
import { Upload, FileText, Download, ChevronUp, ChevronDown, X, Settings, CheckCircle } from "lucide-react";

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        let image;
        if (ext.includes("png")) image = await doc.embedPng(bytes);
        else image = await doc.embedJpg(bytes);

        const { width, height } = image.scale(1);
        const page = doc.addPage([width, height]);
        page.drawImage(image, { x: 0, y: 0, width, height });
        page.drawText(file.name, { x: 8, y: 8, size: 10, font, color: undefined });
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
                  <li key={`${file.name}-${index}`} className="p-4 flex items-center justify-between gap-4">
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Pages will match image dimensions. Reorder images to set page order.</p>
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
                  <a className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" href={pdfUrl} download="images.pdf">
                    <Download className="w-5 h-5" /> Download images.pdf
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
