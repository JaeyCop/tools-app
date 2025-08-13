"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import {
  Upload,
  Image,
  Download,
  Loader2,
  CheckCircle,
  Maximize2,
  Lock,
  Unlock,
  RotateCcw,
  Zap,
  Eye,
  Settings,
  X
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import ToolSeoContent from "@/components/ToolSeoContent";
import SeoHowToJsonLd from "@/components/SeoHowToJsonLd";
import SeoFaqJsonLd from "@/components/SeoFaqJsonLd";
import { ToolLayout } from "@/components/ToolLayout";

type Dimensions = { width: number; height: number };

const Spinner = () => <Loader2 className="w-4 h-4 animate-spin" />;

export default function ImageResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<Dimensions | null>(null);
  const [targetDimensions, setTargetDimensions] = useState<Dimensions | null>(null);
  const [keepAspect, setKeepAspect] = useState(true);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState<number>(0.92);
  const [format, setFormat] = useState<string>("original");
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

  const canExport = useMemo(() => !!file && !!targetDimensions && !isProcessing, [file, targetDimensions, isProcessing]);

  const exportImage = async () => {
    if (!file || !targetDimensions) return;

    setIsProcessing(true);

    // Add a small delay to show the processing state
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const imgEl = imageRef.current;
    if (!imgEl) {
      setIsProcessing(false);
      return;
    }

    canvas.width = targetDimensions.width;
    canvas.height = targetDimensions.height;

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

    const outputFormat = format === "original" ? file.type : format;
    const mime = outputFormat || "image/png";

    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), mime, quality)
    );

    const url = URL.createObjectURL(blob);
    setOutputUrl(url);
    setIsProcessing(false);
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

  const resetDimensions = () => {
    if (originalDimensions) {
      setTargetDimensions(originalDimensions);
    }
  };

  const presetSizes = [
    { name: "Instagram Post", width: 1080, height: 1080 },
    { name: "Instagram Story", width: 1080, height: 1920 },
    { name: "Facebook Cover", width: 1200, height: 630 },
    { name: "Twitter Header", width: 1500, height: 500 },
    { name: "YouTube Thumbnail", width: 1280, height: 720 },
    { name: "Avatar", width: 400, height: 400 }
  ];

  const aspectRatio = originalDimensions ? (originalDimensions.width / originalDimensions.height).toFixed(2) : null;

  const sidebarContent = (
    <div className="space-y-6">
      {/* Resize Controls */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Resize Settings
        </h3>

        {/* Dimension Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Width (px)
            </label>
            <input
              type="number"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={targetDimensions?.width ?? ""}
              min={1}
              max={10000}
              onChange={(e) => updateWidth(parseInt(e.target.value || "0", 10))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Height (px)
            </label>
            <input
              type="number"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={targetDimensions?.height ?? ""}
              min={1}
              max={10000}
              onChange={(e) => updateHeight(parseInt(e.target.value || "0", 10))}
            />
          </div>
        </div>

        {/* Aspect Ratio & Reset */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              id="keep"
              type="checkbox"
              className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              checked={keepAspect}
              onChange={(e) => setKeepAspect(e.target.checked)}
            />
            <label htmlFor="keep" className="flex items-center gap-2 text-sm font-medium text-foreground">
              {keepAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              Keep aspect ratio
            </label>
          </div>

          <button
            type="button"
            onClick={resetDimensions}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Preset Sizes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presetSizes.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setTargetDimensions({ width: preset.width, height: preset.height })}
                className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm"
              >
                <div className="font-medium text-foreground">{preset.name}</div>
                <div className="text-muted-foreground">{preset.width} × {preset.height}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Export Options
        </h3>

        {/* Quality Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">
              Quality
            </label>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {Math.round(quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Output Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="original">Keep Original ({file?.type.split('/')[1].toUpperCase()})</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>

      {/* Export Button */}
      {file && (
        <button
          type="button"
          onClick={exportImage}
          disabled={!canExport}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Maximize2 className="h-5 w-5" />
              <span>Resize Image</span>
            </div>
          )}
        </button>
      )}

      {file && (
        <button
          onClick={() => { setFile(null); setImageUrl(null); setOutputUrl(null); }}
          className="w-full px-4 py-2 bg-red-500/10 text-red-600 rounded-xl text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize your images to any dimension with precision. Perfect for social media, web, and print."
      icon={<Maximize2 className="h-8 w-8 text-primary" />}
      sidebar={sidebarContent}
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"] }} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center cursor-pointer transition-all duration-300 group ${isDragActive
                  ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
            >
              <input {...getInputProps()} />

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full opacity-50 animate-pulse" />
              <div className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />

              <div className={`relative transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                <div className="mb-6">
                  {isDragActive ? (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mx-auto group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                      <Image className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {isDragActive ? "Drop your image here!" : "Upload Image File"}
                  </h3>
                  <p className="text-muted-foreground">
                    Drag & drop an image file or click to browse
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Single file</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Max 10MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dropzone>

        {/* File Info */}
        {file && (
          <div className="p-4 bg-muted/50 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                  {originalDimensions && (
                    <> • {originalDimensions.width} × {originalDimensions.height}</>
                  )}
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            </div>
          </div>
        )}

        {/* Image Preview */}
        {imageUrl && (
          <div className="bg-card rounded-xl p-6 border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Preview</h3>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Original image preview"
                onLoad={onImageLoad}
                className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>

            {originalDimensions && (
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Width</p>
                  <p className="font-semibold text-foreground">{originalDimensions.width}px</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Height</p>
                  <p className="font-semibold text-foreground">{originalDimensions.height}px</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Ratio</p>
                  <p className="font-semibold text-foreground">{aspectRatio}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Download Result */}
        {isProcessing && (
          <div className="bg-card rounded-xl p-6 border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-success/10 rounded-lg">
                <Skeleton className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                <Skeleton className="w-48 h-6" />
              </h3>
            </div>
            <Skeleton className="w-full h-12" />
          </div>
        )}
        {outputUrl && !isProcessing && (
          <div className="bg-gradient-to-r from-success/5 to-accent/5 rounded-xl shadow-lg border border-success/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-success/10 rounded-xl">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Image Resized!
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">New Dimensions</p>
                <p className="text-lg font-bold text-foreground">
                  {targetDimensions?.width} × {targetDimensions?.height}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">Format</p>
                <p className="text-lg font-bold text-foreground">
                  {format === "original" ? file?.type.split('/')[1].toUpperCase() : format.split('/')[1].toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <a
                className="inline-flex items-center justify-center gap-3 bg-success hover:bg-success/90 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                href={outputUrl}
                download={`resized-${file?.name}`}
              >
                <Download className="w-5 h-5" />
                Download Resized Image
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-muted-foreground">
        <p className="text-sm">
            🔒 All processing happens locally in your browser - your images never leave your device
          </p>
        </div>

      <ToolSeoContent
        title="Resize Image"
        overview="Resize images for web, social, or email while maintaining aspect ratio."
        steps={["Upload an image", "Set width/height or choose a preset", "Keep aspect ratio to avoid distortion", "Download the resized image"]}
        tips={["Use PNG for UI screenshots", "Use JPG/WebP for photos"]}
        privacyNote="Processing runs locally in your browser; nothing is uploaded."
      />
      <SeoHowToJsonLd
        name="How to resize an image"
        description="Resize images online while maintaining quality."
        steps={[{ name: "Upload an image" }, { name: "Set target dimensions" }, { name: "Click Download" }]}
      />
      <SeoFaqJsonLd id="resize-image" items={[{ question: "Are my files uploaded?", answer: "No, all processing stays in your browser." }]} />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </ToolLayout>
  );
}