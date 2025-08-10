"use client";

import { useCallback, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";
import { PDFDocument, StandardFonts } from "pdf-lib";

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
        // Optional filename label at bottom-left
        page.drawText(file.name, { x: 8, y: 8, size: 10, font, color: undefined });
      }

      const out = await doc.save();
      const buf = new ArrayBuffer(out.length);
      new Uint8Array(buf).set(out);
      const blob = new Blob([buf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to build PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Images to PDF</h1>
      <p className="text-sm text-black/70 dark:text-white/60">Combine images into a single PDF; reorder as needed.</p>

      <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-black/[.02] dark:bg-white/[.03]">
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop images here…</p> : <p>Drag and drop images, or click to select</p>}
          </div>
        )}
      </Dropzone>

      {files.length > 0 && (
        <ul className="divide-y rounded-md border bg-white/50 dark:bg-black/20">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-black/60 dark:text-white/60">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="px-2 py-1 text-xs rounded border" onClick={() => move(index, Math.max(0, index - 1))} disabled={index === 0}>
                  Up
                </button>
                <button type="button" className="px-2 py-1 text-xs rounded border" onClick={() => move(index, Math.min(files.length - 1, index + 1))} disabled={index === files.length - 1}>
                  Down
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3">
        <button type="button" onClick={buildPdf} disabled={!canExport} className="rounded bg-black text-white dark:bg_white dark:text-black px-4 py-2 disabled:opacity-50">
          {isProcessing ? <span className="inline-flex items-center gap-2"><Spinner /> Building…</span> : "Build PDF"}
        </button>
        <button type="button" onClick={() => setFiles([])} className="rounded border px-4 py-2" disabled={isProcessing || files.length === 0}>
          Clear
        </button>
      </div>

      {pdfUrl && (
        <div>
          <a className="inline-flex items-center rounded border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10" href={pdfUrl} download="images.pdf">
            Download images.pdf
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
