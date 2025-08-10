"use client";

import { useCallback, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";

type Format = "image/png" | "image/jpeg" | "image/webp";

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("image/png");
  const [quality, setQuality] = useState<number>(0.92);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const first = accepted.find((f) => f.type.startsWith("image/"));
    if (first) {
      setFile(first);
      setOutputUrl(null);
    }
  }, []);

  const canConvert = useMemo(() => !!file && !isProcessing, [file, isProcessing]);

  const convert = async () => {
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
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas context");
      ctx.drawImage(img, 0, 0);
      const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), format, quality));
      const outUrl = URL.createObjectURL(blob);
      setOutputUrl(outUrl);
      URL.revokeObjectURL(url);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Image Format Converter</h1>
      <p className="text-sm text-black/70 dark:text-white/60">Convert images between PNG, JPG and WebP with quality control.</p>

      <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-black/[.02] dark:bg-white/[.03]">
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the image here…</p> : <p>Drag and drop an image, or click to select</p>}
          </div>
        )}
      </Dropzone>

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm">Format</label>
        <select className="rounded border px-2 py-1" value={format} onChange={(e) => setFormat(e.target.value as Format)}>
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPG</option>
          <option value="image/webp">WebP</option>
        </select>
        <label className="text-sm">Quality</label>
        <input
          type="range"
          min={0.4}
          max={1}
          step={0.01}
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
        />
        <span className="text-sm tabular-nums">{Math.round(quality * 100)}%</span>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={convert} disabled={!canConvert} className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50">
          {isProcessing ? <span className="inline-flex items-center gap-2"><Spinner /> Converting…</span> : "Convert"}
        </button>
      </div>

      {outputUrl && (
        <div className="space-y-3">
          <img src={outputUrl} alt="Converted" className="max-w-full h-auto rounded border" />
          <a className="inline-flex items-center rounded border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10" href={outputUrl} download>
            Download
          </a>
        </div>
      )}
    </div>
  );
}
