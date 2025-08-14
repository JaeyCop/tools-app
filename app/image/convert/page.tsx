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
        {originalFormat && format !== originalFormat && ( file &&
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
        {file && ( !isProcessing &&
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

      <ToolSeoContent
        title="Convert Image Format"
        overview="Convert images between JPG, PNG, and WebP with control over quality and size."
        steps={["Upload an image", "Choose target format", "Adjust quality (if available)", "Download the converted image"]}
        tips={["WebP often gives best balance of quality and size"]}
        privacyNote="Conversion runs in your browser. Files are not uploaded."
      />
      <SeoHowToJsonLd
        name="How to convert images"
        description="Convert images to JPG, PNG, or WebP online."
        steps={[{ name: "Upload an image" }, { name: "Choose output format" }, { name: "Click Convert and download" }]}
      />
      <SeoFaqJsonLd id="convert-image" items={[{ question: "Are my files uploaded?", answer: "No, conversion is performed locally in your browser." }]} />

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