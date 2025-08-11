"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import { Upload, FileText, Scissors, Download, Zap, Info, CheckCircle, Filter, ArrowRight, Trash2, RefreshCcw, X } from "lucide-react";

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [outputName, setOutputName] = useState<string>("pages.zip");
  const [rangeText, setRangeText] = useState<string>(""); // e.g. 1-3,5,8-10
  const [selectMode, setSelectMode] = useState<"toggle" | "single">("toggle");
  const urlsToRevokeRef = useRef<string[]>([]);

  useEffect(() => () => { urlsToRevokeRef.current.forEach((u) => URL.revokeObjectURL(u)); }, []);

  const onDrop = useCallback(async (accepted: File[]) => {
    const first = accepted.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!first) return;
    setFile(first);
    setZipUrl(null);
    setErrorMessage(null);
    setSelectedPages(new Set());
    setRangeText("");
    try {
      const ab = await first.arrayBuffer();
      const pdf = await PDFDocument.load(ab);
      setNumPages(pdf.getPageCount());
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Failed to read PDF");
    }
  }, []);

  const applyRangeToSelection = useCallback((text: string, max: number) => {
    const parts = text.split(/[\s,]+/).filter(Boolean);
    const next = new Set<number>();
    for (const part of parts) {
      const m = part.match(/^(\d+)(?:-(\d+))?$/);
      if (!m) continue;
      let a = Math.max(1, Math.min(max, parseInt(m[1], 10)));
      let b = m[2] ? Math.max(1, Math.min(max, parseInt(m[2], 10))) : a;
      if (a > b) [a, b] = [b, a];
      for (let p = a; p <= b; p++) next.add(p);
    }
    setSelectedPages(next);
  }, []);

  const togglePage = (pageIndex: number) => {
    setSelectedPages((prev) => {
      if (selectMode === "single") return new Set([pageIndex]);
      const next = new Set(prev);
      if (next.has(pageIndex)) next.delete(pageIndex);
      else next.add(pageIndex);
      return next;
    });
  };

  const selectAll = () => {
    if (!numPages) return;
    const s = new Set<number>();
    for (let i = 1; i <= numPages; i++) s.add(i - 1);
    setSelectedPages(s);
    setRangeText(`1-${numPages}`);
  };
  const selectNone = () => { setSelectedPages(new Set()); setRangeText(""); };
  const selectOdd = () => { if (!numPages) return; const s = new Set<number>(); for (let i = 1; i <= numPages; i++) if (i % 2 === 1) s.add(i - 1); setSelectedPages(s); setRangeText(Array.from(s).map(i=>i+1).join(",")); };
  const selectEven = () => { if (!numPages) return; const s = new Set<number>(); for (let i = 1; i <= numPages; i++) if (i % 2 === 0) s.add(i - 1); setSelectedPages(s); setRangeText(Array.from(s).map(i=>i+1).join(",")); };
  const invertSelection = () => { if (!numPages) return; const s = new Set<number>(); for (let i = 0; i < numPages; i++) if (!selectedPages.has(i)) s.add(i); setSelectedPages(s); setRangeText(Array.from(s).map(i=>i+1).join(",")); };

  const canExport = useMemo(() => !!file && selectedPages.size > 0 && !isProcessing, [file, selectedPages.size, isProcessing]);

  const exportSelected = async () => {
    if (!file) return;
    setIsProcessing(true);
    setZipUrl(null);
    setErrorMessage(null);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const srcBytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(srcBytes);

      const indices = Array.from(selectedPages).sort((a, b) => a - b);
      for (const idx of indices) {
        const outDoc = await PDFDocument.create();
        const [copied] = await outDoc.copyPages(srcPdf, [idx]);
        outDoc.addPage(copied);
        const bytes = await outDoc.save();
        const buf = new ArrayBuffer(bytes.length);
        new Uint8Array(buf).set(bytes);
        zip.file(`page-${idx + 1}.pdf`, buf);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      urlsToRevokeRef.current.push(url);
      setZipUrl(url);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Failed to split PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
        {/* Hero */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl shadow-lg">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">Split PDF</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Select specific pages to extract into individual PDF files.</p>
          </div>
          {file && (
            <button
              onClick={() => {
                setFile(null);
                setSelectedPages(new Set());
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Uploader */}
        <div className="card-premium shadow-premium overflow-hidden mb-8">
          <div className="p-8">
            <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }} multiple={false}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div {...getRootProps()} className={`relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20 scale-[1.02]' : 'border-gray-300 dark:border-gray-600 hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-900/10'}`}>
                  <input {...getInputProps()} />
                  <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                    <div className="mb-6">
                      {isDragActive ? (
                        <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                          <Upload className="w-8 h-8 text-sky-500" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-sky-100 dark:group-hover:bg-sky-900/30 transition-colors">
                          <FileText className="w-8 h-8 text-gray-400 group-hover:text-sky-500 transition-colors" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">{isDragActive ? "Drop your PDF here!" : "Upload your PDF"}</p>
                      <p className="text-gray-500 dark:text-gray-400">PDF • Max 100MB</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-full opacity-50" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-full opacity-30" />
                </div>
              )}
            </Dropzone>

            {file && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg"><FileText className="w-5 h-5 text-sky-600" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB • {numPages ?? '…'} pages</p>
                  </div>
                  <button type="button" onClick={() => { setFile(null); setNumPages(null); setSelectedPages(new Set()); setRangeText(""); setZipUrl(null); }} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main */}
        {typeof numPages === 'number' && numPages > 0 && (
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 items-start">
            {/* Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card-premium p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg"><Filter className="w-5 h-5 text-cyan-600" /></div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Choose pages</h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <label className="flex items-center gap-2"><input type="radio" name="mode" className="w-4 h-4" checked={selectMode === 'toggle'} onChange={() => setSelectMode('toggle')} /> Toggle</label>
                    <label className="flex items-center gap-2"><input type="radio" name="mode" className="w-4 h-4" checked={selectMode === 'single'} onChange={() => setSelectMode('single')} /> Single</label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                  <button type="button" onClick={selectAll} className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">All</button>
                  <button type="button" onClick={selectNone} className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">None</button>
                  <button type="button" onClick={selectOdd} className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">Odd</button>
                  <button type="button" onClick={selectEven} className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">Even</button>
                </div>

                <div className="grid grid-cols-8 gap-2">
                  {Array.from({ length: numPages }).map((_, i) => {
                    const selected = selectedPages.has(i);
                    return (
                      <button key={i} type="button" onClick={() => togglePage(i)} className={`h-9 rounded-lg border text-sm transition-colors ${selected ? 'bg-sky-600 text-white border-sky-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page range</label>
                    <input value={rangeText} onChange={(e) => setRangeText(e.target.value)} onBlur={() => numPages && applyRangeToSelection(rangeText, numPages)} placeholder={`e.g. 1-${numPages},5,7-9`} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white" />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Use commas for lists and dashes for ranges. Example: 1-3,6,9-12</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Actions</label>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={invertSelection} className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">Invert</button>
                      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">Scroll Top</button>
                      <button type="button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">Scroll Bottom</button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 border border-sky-200 dark:border-sky-800">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-sky-600 mt-0.5" />
                    <p className="text-sm text-sky-800 dark:text-sky-200">Tip: Use Odd/Even to quickly split duplex scans, or type ranges like 1-10,15,21-24.</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><Zap className="w-5 h-5 text-green-600" /></div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Export</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ZIP filename</label>
                    <input value={outputName} onChange={(e) => setOutputName(e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Summary</label>
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">
                      {selectedPages.size} of {numPages} pages selected
                    </div>
                  </div>
                </div>
                <button type="button" onClick={exportSelected} disabled={!canExport} className={`mt-6 w-full group relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${canExport ? 'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'}`}>
                  {isProcessing ? (<span className="inline-flex items-center gap-2"><Spinner /> Exporting…</span>) : (<span className="inline-flex items-center gap-2">Export Selected <ArrowRight className="w-5 h-5" /></span>)}
                  {!isProcessing && canExport && (<div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />)}
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="space-y-6">
              {isProcessing && (
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
              {zipUrl && !isProcessing ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">Ready</h3>
                  </div>
                  <a className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" href={zipUrl} download={outputName || 'pages.zip'}>
                    <Download className="w-5 h-5" /> Download {outputName || 'pages.zip'}
                  </a>
                </div>
              ) : (
                <div className="card-premium p-6 sm:p-8">
                  <div className="text-sm text-gray-600 dark:text-gray-400">No export yet. Select pages and click Export.</div>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <div className="text-sm text-red-800 dark:text-red-200">{errorMessage}</div>
                </div>
              )}

              {/* Help */}
              <div className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-3xl shadow-xl border border-sky-200 dark:border-sky-800 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-xl"><Info className="w-5 h-5 text-sky-600" /></div>
                  <h3 className="text-lg font-bold text-sky-800 dark:text-sky-200">Tips</h3>
                </div>
                <ul className="text-sm text-sky-900/80 dark:text-sky-200/90 space-y-2 list-disc list-inside">
                  <li>Use Odd/Even to quickly select every other page.</li>
                  <li>Switch to Single mode to select exactly one page at a time.</li>
                  <li>Large PDFs may take a moment to process after clicking Export.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">🔒 Splitting runs locally in your browser. Nothing is uploaded.</p>
        </div>
      </div>
    </div>
  );
}
