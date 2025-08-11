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

  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-lg">
                <Maximize2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Image Resizer
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Resize your images to any dimension with precision. Perfect for social media, web, and print.
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
                        ? 'border-green-400 bg-green-50 dark:bg-green-900/20 scale-[1.02]'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/10'
                      }
                    `}
                  >
                    <input {...getInputProps()} />

                    <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                      <div className="mb-6">
                        {isDragActive ? (
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <Upload className="w-8 h-8 text-green-500" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors" />
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
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full opacity-50"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full opacity-30"></div>
                  </div>
                )}
              </Dropzone>

              {/* File Info */}
              {file && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Image className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                        {originalDimensions && (
                          <> • {originalDimensions.width} × {originalDimensions.height}</>
                        )}
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          {imageUrl && (
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-start">
              {/* Image Preview */}
                              <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Preview</h3>
                  </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
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
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">Width</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{originalDimensions.width}px</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">Height</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{originalDimensions.height}px</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">Ratio</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{aspectRatio}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-6">
                {/* Resize Controls */}
                <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Resize Settings</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Dimension Controls */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Width (px)
                        </label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                          value={targetDimensions?.width ?? ""}
                          min={1}
                          max={10000}
                          onChange={(e) => updateWidth(parseInt(e.target.value || "0", 10))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Height (px)
                        </label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
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
                          className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                          checked={keepAspect}
                          onChange={(e) => setKeepAspect(e.target.checked)}
                        />
                        <label htmlFor="keep" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {keepAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          Keep aspect ratio
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={resetDimensions}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>

                    {/* Preset Sizes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Quick Presets
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {presetSizes.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setTargetDimensions({ width: preset.width, height: preset.height })}
                            className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-sm"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">{preset.name}</div>
                            <div className="text-gray-500 dark:text-gray-400">{preset.width} × {preset.height}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Export Options</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Quality Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quality
                        </label>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
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
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${quality * 100}%, #e5e7eb ${quality * 100}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>

                    {/* Format Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Output Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                      >
                        <option value="original">Keep Original ({file?.type.split('/')[1].toUpperCase()})</option>
                        <option value="image/jpeg">JPEG</option>
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WebP</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Export Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={exportImage}
                    disabled={!canExport}
                    className={`
                      group relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform
                      ${canExport
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {isProcessing && <Spinner />}
                    {isProcessing ? "Processing..." : "Resize Image"}

                    {!isProcessing && canExport && (
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
                  <div className="card-premium bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                        Image Resized!
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">New Dimensions</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {targetDimensions?.width} × {targetDimensions?.height}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Format</p>
                        <p className="text-lg font-bold text-green-600">
                          {format === "original" ? file?.type.split('/')[1].toUpperCase() : format.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <a
                        className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            🔒 All processing happens locally in your browser - your images never leave your device
          </p>
        </div>
      </div>

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
    </div>
  );
}