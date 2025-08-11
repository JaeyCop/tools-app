"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";
import Dropzone, { FileRejection } from "react-dropzone";
import Spinner from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import { Upload, FileText, Download, Layers, ChevronUp, ChevronDown, X, Settings, Zap, Info, CheckCircle, ArrowRight } from "lucide-react";

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

  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl shadow-lg">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Merge PDFs</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Combine multiple PDF files in the order you want, or interleave pages across documents.
            </p>
          </div>
          {files.length > 0 && (
            <button
              onClick={() => {
                setFiles([]);
                setMergedBlobUrl(null);
                setErrorMessage(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="card-premium shadow-premium overflow-hidden mb-8">
          <div className="p-8">
            <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  className={`relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-fuchsia-400 bg-pink-50 dark:bg-fuchsia-900/20 scale-[1.02]' : 'border-gray-300 dark:border-gray-600 hover:border-fuchsia-400 hover:bg-pink-50/50 dark:hover:bg-fuchsia-900/10'}`}
                >
                  <input {...getInputProps()} />
                  <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                    <div className="mb-6">
                      {isDragActive ? (
                        <div className="w-16 h-16 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                          <Upload className="w-8 h-8 text-fuchsia-500" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-fuchsia-100 dark:group-hover:bg-fuchsia-900/30 transition-colors">
                          <FileText className="w-8 h-8 text-gray-400 group-hover:text-fuchsia-500 transition-colors" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">{isDragActive ? "Drop your PDFs here!" : "Upload your PDFs"}</p>
                      <p className="text-gray-500 dark:text-gray-400">Multiple files supported • Max total 200MB</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-pink-100 to-fuchsia-100 dark:from-pink-900/20 dark:to-fuchsia-900/20 rounded-full opacity-50" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-fuchsia-100 to-purple-100 dark:from-fuchsia-900/20 dark:to-purple-900/20 rounded-full opacity-30" />
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
                      <button type="button" className="px-2 py-1 text-xs rounded border" onClick={() => moveFile(index, Math.max(0, index - 1))} disabled={index === 0}><ChevronUp className="w-4 h-4" /></button>
                      <button type="button" className="px-2 py-1 text-xs rounded border" onClick={() => moveFile(index, Math.min(files.length - 1, index + 1))} disabled={index === files.length - 1}><ChevronDown className="w-4 h-4" /></button>
                      <button type="button" className="px-2 py-1 text-xs rounded border text-red-600 border-red-600" onClick={() => removeAtIndex(index)}><X className="w-4 h-4" /></button>
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
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Settings className="w-5 h-5 text-purple-600" /></div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Merge Settings</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mode</label>
                    <select value={mode} onChange={(e) => setMode(e.target.value as MergeMode)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white">
                      <option value="append">Append (keep file order)</option>
                      <option value="interleave">Interleave pages</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output filename</label>
                    <input value={outputName} onChange={(e) => setOutputName(e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input id="opt" type="checkbox" className="w-5 h-5" checked={optimize} onChange={(e) => setOptimize(e.target.checked)} />
                    <label htmlFor="opt" className="text-sm text-gray-700 dark:text-gray-300">Optimize output (smaller file)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input id="labels" type="checkbox" className="w-5 h-5" checked={pageLabels} onChange={(e) => setPageLabels(e.target.checked)} />
                    <label htmlFor="labels" className="text-sm text-gray-700 dark:text-gray-300">Add page labels (file names)</label>
                  </div>
                </div>
                <div className="mt-6 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl p-4 border border-fuchsia-200 dark:border-fuchsia-800">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-fuchsia-600 mt-0.5" />
                    <p className="text-sm text-fuchsia-800 dark:text-fuchsia-200">Use Interleave to alternate pages (useful for duplex scans). Optimize reduces size; labels help trace origins.</p>
                  </div>
                </div>
              </div>
              <div className="card-premium p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><Zap className="w-5 h-5 text-green-600" /></div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Merge</h3>
                </div>
                <button type="button" onClick={handleMerge} disabled={!canMerge} className={`w-full group relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${canMerge ? 'bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'}`}>
                  {isMerging ? (<span className="inline-flex items-center gap-2"><Spinner /> Merging…</span>) : (<span className="inline-flex items-center gap-2">Start merge <ArrowRight className="w-5 h-5" /></span>)}
                  {!isMerging && canMerge && (<div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />)}
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {isMerging && (
                <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Skeleton className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      <Skeleton className="w-48 h-6" />
                    </h3>
                  </div>
                  <Skeleton className="w-full h-12" />
                </div>
              )}
              {mergedBlobUrl && !isMerging ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">Merge Complete</h3>
                  </div>
                  <a className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" href={mergedBlobUrl} download={outputName || "merged.pdf"}>
                    <Download className="w-5 h-5" /> Download {outputName || 'merged.pdf'}
                  </a>
                </div>
                              ) : (
                  <div className="card-premium p-6 sm:p-8">
                    <div className="text-sm text-gray-600 dark:text-gray-400">No output yet. Configure settings and click Merge.</div>
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
          <p className="text-sm">🔒 Merging happens locally in your browser. Nothing is uploaded.</p>
        </div>
      </div>
    </div>
  );
}
