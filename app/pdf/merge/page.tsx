"use client";

import { useCallback, useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone, { FileRejection } from "react-dropzone";
import Spinner from "@/components/ui/Spinner";

export default function PdfMergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);

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

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        for (const page of copiedPages) {
          mergedPdf.addPage(page);
        }
      }

      const mergedBytes = await mergedPdf.save(); // Uint8Array
      // Copy into a fresh ArrayBuffer to satisfy BlobPart type (no SharedArrayBuffer)
      const arrayBuffer = new ArrayBuffer(mergedBytes.length);
      new Uint8Array(arrayBuffer).set(mergedBytes);
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to merge PDFs. Please try again.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">PDF Merge</h1>
      <p className="text-sm text-black/70 dark:text-white/60">
        Upload multiple PDF files, reorder them, and download a single merged PDF.
      </p>

      <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-black/[.02] dark:bg-white/[.03]"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the PDF files here…</p>
            ) : (
              <p>Drag and drop PDF files here, or click to select files</p>
            )}
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
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded border"
                  onClick={() => moveFile(index, Math.max(0, index - 1))}
                  disabled={index === 0}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded border"
                  onClick={() => moveFile(index, Math.min(files.length - 1, index + 1))}
                  disabled={index === files.length - 1}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded border text-red-600 border-red-600"
                  onClick={() => removeAtIndex(index)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleMerge}
          disabled={!canMerge}
          className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50"
        >
          {isMerging ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              Merging…
            </span>
          ) : (
            "Merge PDFs"
          )}
        </button>
        <button
          type="button"
          onClick={() => setFiles([])}
          className="rounded border px-4 py-2"
          disabled={files.length === 0 || isMerging}
        >
          Clear
        </button>
      </div>

      {errorMessage && (
        <div className="text-sm text-red-600" role="alert">
          {errorMessage}
        </div>
      )}

      {mergedBlobUrl && (
        <div className="pt-2">
          <a
            className="inline-flex items-center rounded border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10"
            href={mergedBlobUrl}
            download="merged.pdf"
          >
            Download merged.pdf
          </a>
        </div>
      )}
    </div>
  );
}
