"use client";
import { useCallback, useMemo, useState, useRef } from "react";
import Dropzone from "react-dropzone";
import {
  Upload,
  Image,
  Download,
  Loader2,
  CheckCircle,
  RefreshCw,
  Settings,
  Zap,
  Eye,
  FileImage,
  ArrowRight,
  Info,
  Gauge,
  X
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import ToolSeoContent from "@/components/ToolSeoContent";
import SeoHowToJsonLd from "@/components/SeoHowToJsonLd";
import SeoFaqJsonLd from "@/components/SeoFaqJsonLd";
import { ToolLayout } from '@/components/ToolLayout';

const Spinner = () => <Loader2 className="w-4 h-4 animate-spin" />;

type Format = "image/png" | "image/jpeg" | "image/webp";

const formatInfo = {
  "image/png": {
    name: "PNG",
    description: "Lossless compression with transparency support",
    extension: ".png",
    supportsQuality: false,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
  },
  "image/jpeg": {
    name: "JPEG",
    description: "Lossy compression, smaller file sizes",
    extension: ".jpg",
    supportsQuality: true,
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
  },
  "image/webp": {
    name: "WebP",
    description: "Modern format with excellent compression",
    extension: ".webp",
    supportsQuality: true,
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
  }
};

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("image/png");
  const [quality, setQuality] = useState<number>(0.92);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number, height: number } | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback((accepted: File[]) => {
    const first = accepted.find((f) => f.type.startsWith("image/"));
    if (first) {
      setFile(first);
      setOutputUrl(null);
      setOutputSize(null);
      const url = URL.createObjectURL(first);
      setImageUrl(url);
    }
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setOutputUrl(null);
    setOutputSize(null);
    setImageUrl(null);
    setOriginalDimensions(null);
    setIsProcessing(false);
  }, []);

  const onImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    setOriginalDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

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

      // Enable high quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0);
      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b as Blob), format, quality)
      );

      const outUrl = URL.createObjectURL(blob);
      setOutputUrl(outUrl);
      setOutputSize(blob.size);
      URL.revokeObjectURL(url);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentFormatInfo = formatInfo[format];
  const originalFormat = file?.type as Format;
  const originalFormatInfo = originalFormat ? formatInfo[originalFormat] : null;
  const compressionRatio = file && outputSize ? ((1 - outputSize / file.size) * 100) : 0;

  const presetFormats = [
    { format: "image/png" as Format, use: "Logos, icons, transparency" },
    { format: "image/jpeg" as Format, use: "Photos, social media" },
    { format: "image/webp" as Format, use: "Web optimization, modern browsers" }
  ];

  const sidebarContent = (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileImage className="h-5 w-5 text-primary" />
          Output Format
        </h3>
        {presetFormats.map((preset) => (
          <button
            key={preset.format}
            onClick={() => setFormat(preset.format)}
            className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${format === preset.format
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/30 hover:bg-surface-elevated/50'
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${formatInfo[preset.format].color}`}>
                {formatInfo[preset.format].name}
              </span>
              {format === preset.format && <CheckCircle className="w-4 h-4 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {formatInfo[preset.format].description}
            </p>
            <p className="text-xs text-muted-foreground">
              Best for: {preset.use}
            </p>
          </button>
        ))}

        {/* Current Selection Display */}
        {originalFormat && format !== originalFormat && (file &&
          <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className={`px-2 py-1 rounded-full font-medium ${originalFormatInfo?.color}`}>
                {originalFormatInfo?.name}
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className={`px-2 py-1 rounded-full font-medium ${currentFormatInfo.color}`}>
                {currentFormatInfo.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quality Settings */}
      {currentFormatInfo.supportsQuality && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            Quality Settings
          </h3>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Compression Quality
            </label>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {Math.round(quality * 100)}%
            </span>
          </div>

          <input
            type="range"
            min={0.4}
            max={1}
            step={0.01}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Smaller file</span>
            <span>Higher quality</span>
          </div>

          <div className="bg-primary/5 rounded-xl p-3 border border-primary/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                <strong>Quality Guide:</strong> 90%+ for print, 80-90% for web, 60-80% for thumbnails
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Convert Button */}
      {file && (
        <button
          onClick={convert}
          disabled={!canConvert}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner />
              <span>Converting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Convert to {currentFormatInfo.name}</span>
            </div>
          )}
        </button>
      )}

      {file && (
        <button
          onClick={reset}
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
      title="Image Format Converter"
      description="Convert between PNG, JPEG, and WebP formats with quality control. Optimize your images for any use case."
      icon={<RefreshCw className="h-8 w-8 text-primary" />}
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
        {file && (!isProcessing &&
          <div className="p-4 bg-muted/50 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{file.name}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  {originalFormatInfo && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${originalFormatInfo.color}`}>
                      {originalFormatInfo.name}
                    </span>
                  )}
                  {originalDimensions && (
                    <span>{originalDimensions.width} × {originalDimensions.height}</span>
                  )}
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            </div>
          </div>
        )}

        {/* Original Image Preview */}
        {file && imageUrl && (
          <div className="bg-card rounded-xl p-6 border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Image Preview</h3>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Original image preview"
                className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
                onLoad={onImageLoad}
                style={{ maxHeight: '500px' }}
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
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-semibold text-foreground">{formatFileSize(file.size)}</p>
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
                Conversion Complete!
              </h3>
            </div>

            {/* Conversion Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">New Size</p>
                <p className="text-lg font-bold text-foreground">
                  {outputSize ? formatFileSize(outputSize) : 'Calculating...'}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">Space {compressionRatio > 0 ? 'Saved' : 'Change'}</p>
                <p className={`text-lg font-bold ${compressionRatio > 0 ? 'text-success' : compressionRatio < 0 ? 'text-error' : 'text-foreground'}`}>
                  {compressionRatio > 0 ? `${compressionRatio.toFixed(1)}%` :
                    compressionRatio < 0 ? `+${Math.abs(compressionRatio).toFixed(1)}%` : 'Same size'}
                </p>
              </div>
            </div>

            <a
              className="w-full inline-flex items-center justify-center gap-3 bg-success hover:bg-success/90 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              href={outputUrl}
              download={`converted-${file?.name?.replace(/\.[^/.]+$/, currentFormatInfo.extension)}`}
            >
              <Download className="w-5 h-5" />
              Download {currentFormatInfo.name}
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-muted-foreground">
        <p className="text-sm">
          🔒 All conversions happen locally in your browser - your images never leave your device
        </p>
      </div>

      {/* Educational Content Section */}
      <div className="mt-16 space-y-12">
        {/* Understanding Image Formats */}
        <section className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-xl">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            Understanding Image Formats
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">PNG</div>
                <h3 className="text-xl font-semibold text-foreground">PNG Format</h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Portable Network Graphics uses lossless compression, preserving every pixel of your original image with full transparency support.
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Perfect quality preservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Full transparency support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Ideal for graphics and logos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Larger file sizes</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">JPG</div>
                <h3 className="text-xl font-semibold text-foreground">JPEG Format</h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Joint Photographic Experts Group format uses lossy compression, optimized for photographic images with excellent size reduction.
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Excellent for photographs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Small file sizes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Universal compatibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                  <span>No transparency support</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-green-200 dark:border-green-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">WebP</div>
                <h3 className="text-xl font-semibold text-foreground">WebP Format</h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Modern format by Google offering superior compression with both lossy and lossless modes, plus transparency and animation support.
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>25-50% smaller than JPEG/PNG</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Transparency support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>Animation capabilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                  <span>Limited older browser support</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">🎯 Format Selection Guide</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-orange-700 dark:text-orange-300">Choose PNG for:</span>
                <p className="text-orange-600 dark:text-orange-400">Logos, graphics, screenshots, images needing transparency</p>
              </div>
              <div>
                <span className="font-medium text-orange-700 dark:text-orange-300">Choose JPEG for:</span>
                <p className="text-orange-600 dark:text-orange-400">Photographs, complex images, maximum compatibility</p>
              </div>
              <div>
                <span className="font-medium text-orange-700 dark:text-orange-300">Choose WebP for:</span>
                <p className="text-orange-600 dark:text-orange-400">Web optimization, modern browsers, best compression</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conversion Scenarios */}
        <section className="bg-surface/80 border border-border rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
            Common Conversion Scenarios
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Popular Conversions</h3>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">PNG</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">JPG</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Reduce File Size</h4>
                  <p className="text-sm text-muted-foreground">Convert PNG to JPEG to dramatically reduce file size for web use or email sharing.</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">JPG</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">PNG</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Add Transparency</h4>
                  <p className="text-sm text-muted-foreground">Convert JPEG to PNG when you need to add transparent backgrounds or preserve quality.</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">PNG</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">WebP</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Web Optimization</h4>
                  <p className="text-sm text-muted-foreground">Convert to WebP for modern websites to achieve the best compression with quality retention.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Use Case Examples</h3>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    Social Media Sharing
                  </h4>
                  <p className="text-sm text-muted-foreground">Convert high-resolution PNGs to JPEG for faster uploads and better platform compatibility.</p>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-indigo-500" />
                    Website Performance
                  </h4>
                  <p className="text-sm text-muted-foreground">Convert images to WebP for 25-50% smaller file sizes and faster page loading times.</p>
                </div>

                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-teal-500" />
                    Design Workflows
                  </h4>
                  <p className="text-sm text-muted-foreground">Convert between formats to match specific design tool requirements or client specifications.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">📊 Compression Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200 dark:border-amber-700">
                    <th className="text-left py-2 text-amber-800 dark:text-amber-200">Format</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Compression</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Quality</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Transparency</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-amber-700 dark:text-amber-300">
                  <tr className="border-b border-amber-100 dark:border-amber-800">
                    <td className="py-2 font-medium">PNG</td>
                    <td className="text-center py-2">Lossless</td>
                    <td className="text-center py-2">Perfect</td>
                    <td className="text-center py-2">✓</td>
                    <td className="text-center py-2">Graphics, Logos</td>
                  </tr>
                  <tr className="border-b border-amber-100 dark:border-amber-800">
                    <td className="py-2 font-medium">JPEG</td>
                    <td className="text-center py-2">Lossy</td>
                    <td className="text-center py-2">Very Good</td>
                    <td className="text-center py-2">✗</td>
                    <td className="text-center py-2">Photos</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">WebP</td>
                    <td className="text-center py-2">Both</td>
                    <td className="text-center py-2">Excellent</td>
                    <td className="text-center py-2">✓</td>
                    <td className="text-center py-2">Web Images</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Quality and Optimization */}
        <section className="bg-gradient-to-r from-green-50 via-teal-50 to-blue-50 dark:from-green-900/20 dark:via-teal-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-xl">
              <Gauge className="h-6 w-6 text-white" />
            </div>
            Quality Optimization Tips
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Conversion Best Practices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Start with highest quality:</span>
                    <span className="text-muted-foreground ml-2">Always convert from the highest quality source available</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Avoid multiple conversions:</span>
                    <span className="text-muted-foreground ml-2">Each lossy conversion reduces quality further</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Test quality settings:</span>
                    <span className="text-muted-foreground ml-2">Find the optimal balance between size and quality</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Consider your audience:</span>
                    <span className="text-muted-foreground ml-2">Match format choice to target platform capabilities</span>
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
                  <p className="text-sm text-muted-foreground">For professional work, print materials, or when quality is paramount.</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Balanced (75-90%)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Optimal for web use, social media, and general sharing purposes.</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Compressed (60-75%)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">For email attachments and when file size is the primary concern.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ToolSeoContent
        title="Online Image Converter"
        overview="Easily convert your images to different formats like PNG, JPG, and WebP. Our tool gives you full control over the conversion process, allowing you to adjust the quality and optimize your images for any use case. The entire process is secure and happens right in your browser."
        steps={[
          "Upload Your Image: Drag and drop your image file into the upload area, or click to select it from your device.",
          "Choose Your Output Format: Select your desired format from the options provided (PNG, JPG, or WebP).",
          "Adjust Quality (for JPG/WebP): If you've selected JPG or WebP, you can use the quality slider to find the perfect balance between file size and visual quality.",
          "Convert & Download: Click the 'Convert' button. Our tool will instantly process your image and provide a download link for your new file.",
        ]}
        tips={[
          "For best results, start with the highest quality image you have.",
          "Use PNG for graphics and images needing transparency.",
          "Use JPEG for photographs and maximum compatibility.",
          "Use WebP for web optimization and smallest file sizes.",
        ]}
        faq={[
          { q: "Is it safe to convert my images here?", a: "Yes, it is completely secure. The entire conversion process happens in your browser, meaning your images never leave your computer. Your privacy is fully protected." },
          { q: "What is the best format to convert to?", a: "It depends on your needs. For photos, JPG is a good choice. For images with transparency, PNG is the best option. For the web, WebP offers the best balance of quality and file size." },
          { q: "Will converting an image reduce its quality?", a: "If you are converting to a lossy format like JPG or WebP, there may be a slight reduction in quality, especially at lower quality settings. Converting to a lossless format like PNG will not reduce the quality." },
          { q: "Can I convert multiple images at once?", a: "Currently, our tool processes one image at a time to give you the most control over the conversion settings." },
        ]}
      />

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </ToolLayout>
  );
}