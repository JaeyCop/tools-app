"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";

function colorDistanceSq(a: [number, number, number], b: [number, number, number]) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [picked, setPicked] = useState<[number, number, number] | null>(null);
  const [tolerance, setTolerance] = useState<number>(900); // squared distance (0..~195k)
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const img = accepted.find((f) => f.type.startsWith("image/"));
    if (img) {
      setFile(img);
      const url = URL.createObjectURL(img);
      setImageUrl(url);
      setOutputUrl(null);
    }
  }, []);

  const canProcess = useMemo(() => !!file && !!picked && !isProcessing, [file, picked, isProcessing]);

  const onImageLoad = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
  };

  const onPickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const idx = (y * canvas.width + x) * 4;
    const color: [number, number, number] = [data.data[idx], data.data[idx + 1], data.data[idx + 2]];
    setPicked(color);
  };

  const removeBg = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !picked) return;
    setIsProcessing(true);
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (colorDistanceSq([r, g, b], picked) <= tolerance) {
          data[i + 3] = 0; // make transparent
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/png", 0.92));
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Background Remover</h1>
      <p className="text-sm text-black/70 dark:text-white/60">Pick a background color on the image, adjust tolerance, and export a transparent PNG.</p>

      <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-black/[.02] dark:bg-white/[.03]">
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the image here…</p> : <p>Drag and drop an image, or click to select</p>}
          </div>
        )}
      </Dropzone>

      {imageUrl && (
        <div className="space-y-3">
          <img ref={imgRef} src={imageUrl} alt="Source" className="max-w-full h-auto rounded border" onLoad={onImageLoad} />
          <div className="space-y-2">
            <div className="text-sm">Pick background color by clicking on the canvas below:</div>
            <canvas ref={canvasRef} className="w-full max-w-full rounded border cursor-crosshair" onClick={onPickColor} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm">Tolerance</label>
            <input type="range" min={50} max={20000} step={50} value={tolerance} onChange={(e) => setTolerance(parseInt(e.target.value, 10))} />
            {picked && (
              <span className="text-xs">picked rgb({picked[0]}, {picked[1]}, {picked[2]})</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={removeBg} disabled={!canProcess} className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50">
              {isProcessing ? <span className="inline-flex items-center gap-2"><Spinner /> Processing…</span> : "Remove Background"}
            </button>
          </div>
        </div>
      )}

      {outputUrl && (
        <div className="space-y-3">
          <img src={outputUrl} alt="Result" className="max-w-full h-auto rounded border bg-white" />
          <a className="inline-flex items-center rounded border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10" href={outputUrl} download>
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
}
