"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Spinner from "@/components/ui/Spinner";

type Dimensions = { width: number; height: number };

export default function ImageResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<Dimensions | null>(null);
  const [targetDimensions, setTargetDimensions] = useState<Dimensions | null>(null);
  const [keepAspect, setKeepAspect] = useState(true);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onDrop = (acceptedFiles: File[]) => {
    const img = acceptedFiles.find((f) => f.type.startsWith("image/"));
    if (img) {
      setFile(img);
      setOutputUrl(null);
    }
  };

  const onImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    const width = target.naturalWidth;
    const height = target.naturalHeight;
    setOriginalDimensions({ width, height });
    setTargetDimensions((prev) => prev ?? { width, height });
  };

  const canExport = useMemo(() => !!file && !!targetDimensions, [file, targetDimensions]);

  const exportImage = async () => {
    if (!file || !targetDimensions) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgEl = imageRef.current;
    if (!imgEl) return;

    canvas.width = targetDimensions.width;
    canvas.height = targetDimensions.height;

    ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

    const mime = file.type || "image/png";
    const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), mime, 0.92));
    const url = URL.createObjectURL(blob);
    setOutputUrl(url);
  };

  const updateWidth = (value: number) => {
    setTargetDimensions((prev) => {
      if (!prev) return prev;
      if (!keepAspect || !originalDimensions) return { ...prev, width: value };
      const aspect = originalDimensions.height / originalDimensions.width;
      return { width: value, height: Math.round(value * aspect) };
    });
  };

  const updateHeight = (value: number) => {
    setTargetDimensions((prev) => {
      if (!prev) return prev;
      if (!keepAspect || !originalDimensions) return { ...prev, height: value };
      const aspect = originalDimensions.width / originalDimensions.height;
      return { width: Math.round(value * aspect), height: value };
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Image Resize</h1>
      <p className="text-sm text-black/70 dark:text-white/60">Resize an image to custom dimensions.</p>

      <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-black/[.02] dark:bg-white/[.03]"
          >
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the image here…</p> : <p>Drag and drop an image, or click to select</p>}
          </div>
        )}
      </Dropzone>

      {imageUrl && (
        <div className="grid gap-4 md:grid-cols-2 items-start">
          <div>
            <img
              ref={imageRef}
              src={imageUrl}
              onLoad={onImageLoad}
              alt="Preview"
              className="max-w-full h-auto rounded border"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm w-16">Width</label>
              <input
                type="number"
                className="w-full max-w-[200px] rounded border px-2 py-1"
                value={targetDimensions?.width ?? ""}
                min={1}
                onChange={(e) => updateWidth(parseInt(e.target.value || "0", 10))}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm w-16">Height</label>
              <input
                type="number"
                className="w-full max-w-[200px] rounded border px-2 py-1"
                value={targetDimensions?.height ?? ""}
                min={1}
                onChange={(e) => updateHeight(parseInt(e.target.value || "0", 10))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input id="keep" type="checkbox" className="h-4 w-4" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} />
              <label htmlFor="keep" className="text-sm">Keep aspect ratio</label>
            </div>
            <button
              type="button"
              onClick={exportImage}
              disabled={!canExport}
              className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2">
                {!outputUrl && <Spinner />}
                Export
              </span>
            </button>
            {outputUrl && (
              <div>
                <a className="inline-flex items-center rounded border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10" href={outputUrl} download>
                  Download image
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
