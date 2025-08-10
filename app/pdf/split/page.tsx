"use client";

import { useCallback, useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(async (accepted: File[]) => {
    const first = accepted.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!first) return;
    setFile(first);
    setZipUrl(null);
    setErrorMessage(null);
    try {
      const ab = await first.arrayBuffer();
      const pdf = await PDFDocument.load(ab);
      setNumPages(pdf.getPageCount());
      setSelectedPages(new Set());
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to read PDF.");
    }
  }, []);

  const togglePage = (pageIndex: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageIndex)) next.delete(pageIndex);
      else next.add(pageIndex);
      return next;
    });
  };

  const canExport = useMemo(() => file && selectedPages.size > 0 && !isProcessing, [file, selectedPages.size, isProcessing]);

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
      setZipUrl(url);
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to split PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">PDF Splitter</h1>
      <p className="text-sm text-black/70 dark:text-white/60">Select pages to extract into separate PDFs.</p>

      <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-black/[.02] dark:bg-white/[.03]">
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the PDF here…</p> : <p>Drag and drop a PDF, or click to select</p>}
          </div>
        )}
      </Dropzone>

      {typeof numPages === "number" && numPages > 0 && (
        <div className="space-y-3">
          <div className="text-sm">Pages: click to select/deselect</div>
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: numPages }).map((_, i) => {
              const selected = selectedPages.has(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => togglePage(i)}
                  className={`h-9 rounded border text-sm ${selected ? "bg-black text-white dark:bg-white dark:text-black" : "bg-transparent"}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={exportSelected}
          disabled={!canExport}
          className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="inline-flex items-center gap-2"><Spinner /> Exporting…</span>
          ) : (
            "Export Selected"
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedPages(new Set());
            setZipUrl(null);
          }}
          className="rounded border px-4 py-2"
          disabled={isProcessing || selectedPages.size === 0}
        >
          Clear selection
        </button>
      </div>

      {zipUrl && (
        <div>
          <a className="inline-flex items-center rounded border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10" href={zipUrl} download="pages.zip">
            Download pages.zip
          </a>
        </div>
      )}

      {errorMessage && (
        <div className="text-sm text-red-600" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
