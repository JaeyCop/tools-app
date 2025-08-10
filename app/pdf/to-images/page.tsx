"use client";

import { useCallback, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";

export default function PdfToImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const first = accepted.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (first) {
      setFile(first);
      setImageUrls([]);
      setZipUrl(null);
      setErrorMessage(null);
    }
  }, []);

  const canExport = useMemo(() => !!file && !isProcessing, [file, isProcessing]);

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setImageUrls([]);
    setZipUrl(null);
    try {
      const [{ GlobalWorkerOptions, getDocument }, { default: JSZip }] = await Promise.all([
        import("pdfjs-dist").then((m) => ({
          GlobalWorkerOptions: m.GlobalWorkerOptions,
          getDocument: (m as any).getDocument,
        })),
        import("jszip"),
      ]);
      // Use ESM worker path available in pdfjs-dist (no ?url)
      GlobalWorkerOptions.workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs")).default as unknown as string;

      const data = await file.arrayBuffer();
      const pdf = await getDocument({ data }).promise;

      const zip = new JSZip();
      const urls: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unsupported");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx as any, viewport }).promise;
        const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/png", 0.92));
        const url = URL.createObjectURL(blob);
        urls.push(url);
        const buf = await blob.arrayBuffer();
        zip.file(`page-${pageNum}.png`, buf);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipObjectUrl = URL.createObjectURL(zipBlob);
      setImageUrls(urls);
      setZipUrl(zipObjectUrl);
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to convert PDF to images.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">PDF to Images</h1>
      <p className="text-sm text-black/70 dark:text-white/60">Convert each page of a PDF to PNG and optionally download as ZIP.</p>

      <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-black/[.02] dark:bg-white/[.03]">
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the PDF here…</p> : <p>Drag and drop a PDF, or click to select</p>}
          </div>
        )}
      </Dropzone>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={convert}
          disabled={!canExport}
          className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="inline-flex items-center gap-2"><Spinner /> Converting…</span>
          ) : (
            "Convert"
          )}
        </button>
      </div>

      {imageUrls.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {imageUrls.map((u, i) => (
            <img key={i} src={u} alt={`Page ${i + 1}`} className="rounded border" />
          ))}
        </div>
      )}

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
