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

  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl shadow-lg">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Image Format Converter
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Convert between PNG, JPEG, and WebP formats with quality control. Optimize your images for any use case.
            </p>
          </div>
          {file && (
            <button
              onClick={() => {
                setFile(null);
                setImageUrl(null);
                setOutputUrl(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-8">
          {/* Upload Area */}
          <div className="card-premium shadow-premium overflow-hidden">
            <div className="p-8">
              <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"] }} multiple={false}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    className={`
                      relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                      ${isDragActive
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 scale-[1.02]'
                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
                      }
                    `}
                  >
                    <input {...getInputProps()} />

                    <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                      <div className="mb-6">
                        {isDragActive ? (
                          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <Upload className="w-8 h-8 text-orange-500" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                          {isDragActive ? "Drop your image here!" : "Upload your image"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          PNG, JPG, JPEG, WebP, GIF, BMP • Max 10MB
                        </p>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-full opacity-50"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-yellow-100 to-red-100 dark:from-yellow-900/20 dark:to-red-900/20 rounded-full opacity-30"></div>
                  </div>
                )}
              </Dropzone>

              {/* File Info */}
              {file && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Image className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          {file && imageUrl && (
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 items-start">
              {/* Original Image Preview */}
                              <div className="lg:col-span-2 card-premium p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Image Preview</h3>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
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
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">Width</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{originalDimensions.width}px</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">Height</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{originalDimensions.height}px</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">Size</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-6">
                {/* Format Selection */}
                <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <FileImage className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Output Format</h3>
                  </div>

                  <div className="space-y-4">
                    {presetFormats.map((preset) => (
                      <button
                        key={preset.format}
                        onClick={() => setFormat(preset.format)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${format === preset.format
                            ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${formatInfo[preset.format].color}`}>
                            {formatInfo[preset.format].name}
                          </span>
                          {format === preset.format && <CheckCircle className="w-5 h-5 text-orange-500" />}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {formatInfo[preset.format].description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Best for: {preset.use}
                        </p>
                      </button>
                    ))}

                    {/* Current Selection Display */}
                    {originalFormat && format !== originalFormat && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-center gap-3 text-sm">
                          <span className={`px-2 py-1 rounded-full font-medium ${originalFormatInfo?.color}`}>
                            {originalFormatInfo?.name}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className={`px-2 py-1 rounded-full font-medium ${currentFormatInfo.color}`}>
                            {currentFormatInfo.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quality Settings */}
                {currentFormatInfo.supportsQuality && (
                  <div className="card-premium p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Gauge className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quality Settings</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Compression Quality
                        </label>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
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
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #f97316 0%, #f97316 ${(quality - 0.4) * 166.67}%, #e5e7eb ${(quality - 0.4) * 166.67}%, #e5e7eb 100%)`
                        }}
                      />

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Smaller file</span>
                        <span>Higher quality</span>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            <strong>Quality Guide:</strong> 90%+ for print, 80-90% for web, 60-80% for thumbnails
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Convert Button */}
                <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Convert Image</h3>
                  </div>

                  <button
                    onClick={convert}
                    disabled={!canConvert}
                    className={`
                      w-full group relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform
                      ${canConvert
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {isProcessing && <Spinner />}
                    {isProcessing ? "Converting..." : `Convert to ${currentFormatInfo.name}`}

                    {!isProcessing && canConvert && (
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                </div>

                {/* Download Result */}
                {isProcessing && (
                  <div className="card-premium p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Skeleton className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        <Skeleton className="w-48 h-6" />
                      </h3>
                    </div>
                    <Skeleton className="w-full h-12" />
                  </div>
                )}
                {outputUrl && !isProcessing && (
                  <div className="bg-gradient-to-r from-green-50 to-orange-50 dark:from-green-900/20 dark:to-orange-900/20 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                        Conversion Complete!
                      </h3>
                    </div>

                    {/* Conversion Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">New Size</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {outputSize ? formatFileSize(outputSize) : 'Calculating...'}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Space {compressionRatio > 0 ? 'Saved' : 'Change'}</p>
                        <p className={`text-lg font-bold ${compressionRatio > 0 ? 'text-green-600' : compressionRatio < 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                          {compressionRatio > 0 ? `${compressionRatio.toFixed(1)}%` :
                            compressionRatio < 0 ? `+${Math.abs(compressionRatio).toFixed(1)}%` : 'Same size'}
                        </p>
                      </div>
                    </div>

                    <a
                      className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      href={outputUrl}
                      download={`converted-${file?.name?.replace(/\.[^/.]+$/, currentFormatInfo.extension)}`}
                    >
                      <Download className="w-5 h-5" />
                      Download {currentFormatInfo.name}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            🔒 All conversions happen locally in your browser - your images never leave your device
          </p>
        </div>
      </div>

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
    </div>
  );
}