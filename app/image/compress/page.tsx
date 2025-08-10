"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.7);
  const [maxWidth, setMaxWidth] = useState<number | "">("");
  const [maxHeight, setMaxHeight] = useState<number | "">("");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSizeKB, setOutputSizeKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const img = accepted.find((f) => f.type.startsWith("image/"));
    if (img) {
      setFile(img);
      setOutputUrl(null);
      setOutputSizeKB(null);
    }
  }, []);

  const canCompress = useMemo(() => !!file && !isProcessing, [file, isProcessing]);

  const compress = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      let targetW = img.naturalWidth;
      let targetH = img.naturalHeight;
      if (typeof maxWidth === "number" && maxWidth > 0 && targetW > maxWidth) {
        const scale = maxWidth / targetW;
        targetW = Math.round(targetW * scale);
        targetH = Math.round(targetH * scale);
      }
      if (typeof maxHeight === "number" && maxHeight > 0 && targetH > maxHeight) {
        const scale = maxHeight / targetH;
        targetW = Math.round(targetW * scale);
        targetH = Math.round(targetH * scale);
      }
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas context");
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const mime = file.type.includes("png") ? "image/webp" : file.type; // prefer webp for PNG to compress better
      const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), mime, quality));
      const outUrl = URL.createObjectURL(blob);
      setOutputUrl(outUrl);
      setOutputSizeKB(Math.max(1, Math.round(blob.size / 1024)));
      URL.revokeObjectURL(url);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Image Compressor</h1>
      <p className="text-sm text-black/70 dark:text-white/60">Reduce file size by adjusting quality, and optionally limit max width/height.</p>

      <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-black/[.02] dark:bg-white/[.03]">
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the image here…</p> : <p>Drag and drop an image, or click to select</p>}
          </div>
        )}
      </Dropzone>

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm">Quality</label>
        <input type="range" min={0.3} max={1} step={0.01} value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} />
        <span className="text-sm tabular-nums">{Math.round(quality * 100)}%</span>

        <label className="text-sm">Max W</label>
        <input type="number" placeholder="auto" className="w-24 rounded border px-2 py-1" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value ? parseInt(e.target.value, 10) : "")} />
        <label className="text-sm">Max H</label>
        <input type="number" placeholder="auto" className="w-24 rounded border px-2 py-1" value={maxHeight} onChange={(e) => setMaxHeight(e.target.value ? parseInt(e.target.value, 10) : "")} />
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={compress} disabled={!canCompress} className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50">
          {isProcessing ? <span className="inline-flex items-center gap-2"><Spinner /> Compressing…</span> : "Compress"}
        </button>
      </div>

      {outputUrl && (
        <div className="space-y-3">
          <img src={outputUrl} alt="Compressed" className="max-w-full h-auto rounded border" />
          <div className="text-sm text-black/70 dark:text-white/60">Output size: {outputSizeKB} KB</div>
          <a className="inline-flex items-center rounded border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10" href={outputUrl} download>
            Download
          </a>
        </div>
      )}
    </div>
  );
}
