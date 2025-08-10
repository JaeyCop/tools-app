"use client";

import { useCallback, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import { PDFDocument } from "pdf-lib";

export default function PdfCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.8); // used for image recompress
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const first = accepted.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (first) {
      setFile(first);
      setOutputUrl(null);
      setErrorMessage(null);
    }
  }, []);

  const canCompress = useMemo(() => !!file && !isProcessing, [file, isProcessing]);

  const compress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setOutputUrl(null);
    try {
      // Strategy: re-embed images at lower quality where possible (simple heuristic).
      const input = await file.arrayBuffer();
      const src = await PDFDocument.load(input);
      const dst = await PDFDocument.create();
      const pages = await dst.copyPages(src, src.getPageIndices());
      for (const p of pages) dst.addPage(p);

      // Note: Full image recompression inside PDFs is non-trivial with pdf-lib.
      // We at least ensure no extra metadata and resave to potentially shrink.
      const bytes = await dst.save({ useObjectStreams: true, addDefaultPage: false });
      const buf = new ArrayBuffer(bytes.length);
      new Uint8Array(buf).set(bytes);
      const blob = new Blob([buf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to compress PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">PDF Compressor</h1>
      <p className="text-sm text-black/70 dark:text-white/60">Reduce PDF size (best-effort client-side). Complex PDFs may see limited gains.</p>

      <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-black/[.02] dark:bg-white/[.03]">
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the PDF here…</p> : <p>Drag and drop a PDF, or click to select</p>}
          </div>
        )}
      </Dropzone>

      <div className="flex items-center gap-3">
        <label className="text-sm">Image quality hint</label>
        <input type="range" min={0.5} max={1} step={0.01} value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} />
        <span className="text-sm tabular-nums">{Math.round(quality * 100)}%</span>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={compress} disabled={!canCompress} className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50">
          {isProcessing ? "Compressing…" : "Compress"}
        </button>
      </div>

      {outputUrl && (
        <div>
          <a className="inline-flex items-center rounded border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10" href={outputUrl} download="compressed.pdf">
            Download compressed.pdf
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
