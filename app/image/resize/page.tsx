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

      {/* Educational Content Section */}
      <div className="mt-16 space-y-12">
        {/* Understanding Image Resizing */}
        <section className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-xl">
              <Maximize2 className="h-6 w-6 text-white" />
            </div>
            Understanding Image Resizing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Resampling Algorithms</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Image resizing uses sophisticated resampling algorithms to calculate new pixel values. Our tool employs high-quality algorithms that preserve image clarity and minimize artifacts.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Bicubic interpolation for smooth gradients</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Lanczos filtering for sharp details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Anti-aliasing to prevent jagged edges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Gamma correction for accurate colors</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Aspect Ratio Guide</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-foreground">Locked Aspect Ratio</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Maintains original proportions, preventing distortion. Recommended for most use cases.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Unlock className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold text-foreground">Free Aspect Ratio</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Allows independent width/height adjustment. Use carefully to avoid stretching.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Settings className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-foreground">Smart Cropping</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Automatically crops to fit exact dimensions while preserving important content.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-6 border border-green-200 dark:border-green-700">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">💡 Pro Tip: Resolution vs. File Size</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-700 dark:text-green-300">Higher Resolution:</span>
                <p className="text-green-600 dark:text-green-400">Better quality but larger file sizes. Ideal for print and high-DPI displays.</p>
              </div>
              <div>
                <span className="font-medium text-green-700 dark:text-green-300">Lower Resolution:</span>
                <p className="text-green-600 dark:text-green-400">Smaller files that load faster. Perfect for web use and email attachments.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Use Cases */}
        <section className="bg-surface/80 border border-border rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Eye className="h-6 w-6 text-white" />
            </div>
            Popular Resize Dimensions
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="font-semibold text-foreground mb-4">Social Media</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instagram Post</span>
                  <span className="font-medium text-foreground">1080×1080</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instagram Story</span>
                  <span className="font-medium text-foreground">1080×1920</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Facebook Cover</span>
                  <span className="font-medium text-foreground">1200×630</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Twitter Header</span>
                  <span className="font-medium text-foreground">1500×500</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
              <h3 className="font-semibold text-foreground mb-4">Web & Email</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blog Featured</span>
                  <span className="font-medium text-foreground">1200×630</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email Header</span>
                  <span className="font-medium text-foreground">600×200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website Banner</span>
                  <span className="font-medium text-foreground">1920×400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thumbnail</span>
                  <span className="font-medium text-foreground">300×200</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
              <h3 className="font-semibold text-foreground mb-4">Print & Professional</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business Card</span>
                  <span className="font-medium text-foreground">1050×600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">A4 Document</span>
                  <span className="font-medium text-foreground">2480×3508</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Poster (A3)</span>
                  <span className="font-medium text-foreground">3508×4961</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profile Photo</span>
                  <span className="font-medium text-foreground">400×400</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">📐 Aspect Ratio Quick Reference</h4>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-amber-700 dark:text-amber-300">1:1 (Square)</div>
                <div className="text-amber-600 dark:text-amber-400">Instagram posts, profile pictures</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-amber-700 dark:text-amber-300">16:9 (Widescreen)</div>
                <div className="text-amber-600 dark:text-amber-400">YouTube thumbnails, presentations</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-amber-700 dark:text-amber-300">4:3 (Standard)</div>
                <div className="text-amber-600 dark:text-amber-400">Traditional photos, documents</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-amber-700 dark:text-amber-300">3:2 (Photography)</div>
                <div className="text-amber-600 dark:text-amber-400">DSLR photos, prints</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality and Performance */}
        <section className="bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-red-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Quality & Performance Optimization
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Best Practices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Start with high resolution:</span>
                    <span className="text-muted-foreground ml-2">Always resize down from a larger source for best quality</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Choose the right format:</span>
                    <span className="text-muted-foreground ml-2">JPEG for photos, PNG for graphics with transparency</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Consider your use case:</span>
                    <span className="text-muted-foreground ml-2">Web images can be smaller than print images</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Test on target devices:</span>
                    <span className="text-muted-foreground ml-2">Verify quality on the devices where images will be viewed</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Quality Settings Guide</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">High Quality (90-100%)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">For professional photography, print materials, and archival purposes.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Balanced (80-90%)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Optimal for web use, social media, and general sharing.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Compressed (60-80%)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">For email attachments and when file size is critical.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ToolSeoContent
        title="Online Image Resizer"
        overview="Quickly resize any image to your exact specifications. Whether you need to shrink a photo for a social media profile, a blog post, or an email attachment, our tool provides a fast, easy, and private solution. Adjust dimensions, maintain aspect ratio, and optimize quality without ever uploading your file."
        steps={[
          "Upload Your Image: Drag and drop your image file (PNG, JPG, WebP, etc.) into the upload area, or click to select a file from your device.",
          "Set Your Dimensions: Enter your desired width or height in pixels. To prevent distortion, keep the 'Lock aspect ratio' option checked. You can also choose from a list of popular presets for social media and more.",
          "Adjust and Download: Fine-tune the image quality and select your preferred output format (like JPG, PNG, or WebP). Click 'Resize Image' and your newly sized image will be ready for instant download.",
        ]}
        tips={[
          "Start with a high-resolution image for best results.",
          "Lock aspect ratio to avoid distortion.",
          "Choose the right format for your use case (JPEG for photos, PNG for graphics).",
          "Use the quality slider to balance file size and clarity.",
          "All processing is local—your images never leave your device."
        ]}
        faq={[
          { q: "Is resizing images on this site secure?", a: "Yes, it is completely secure. Because the entire process runs in your browser, your image files are never uploaded to our or any other server. Your privacy is fully protected." },
          { q: "Will resizing the image reduce its quality?", a: "Shrinking an image generally preserves quality well. Enlarging an image can sometimes result in a loss of sharpness. Our tool uses high-quality resampling algorithms to maintain the best possible result. You can also control the quality with the slider for formats like JPG and WebP." },
          { q: "What is the maximum file size I can use?", a: "While there is no strict server-side limit, performance depends on your device's capabilities. For best results, we recommend using images under 10MB." },
          { q: "Can I resize multiple images at once?", a: "Currently, our tool processes one image at a time to provide the most detailed control and a clear preview. For batch processing, you would need to resize each image individually." },
        ]}
      />
    </ToolLayout>
  );
}