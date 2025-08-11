"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  Download,
  ImageIcon,
  Zap,
  Settings,
  Info,
  X,
  CheckCircle,
  AlertTriangle,
  Sliders,
  FileImage,
  Maximize2,
  Minimize2
} from "lucide-react";

type CompressionFormat = 'auto' | 'webp' | 'jpeg' | 'png';

interface CompressionOptions {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  format: CompressionFormat;
}

interface CompressionResult {
  url: string;
  sizeKB: number;
  format: string;
  dimensions: { width: number; height: number };
}

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Image comparison slider component
const ImageComparisonSlider: React.FC<{
  beforeImage: string;
  afterImage: string;
}> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-80 w-full overflow-hidden rounded-xl cursor-col-resize select-none bg-gray-50 dark:bg-gray-700"
      onMouseMove={handleMouseMove}
    >
      {/* Before image (original) */}
      <img
        src={beforeImage}
        alt="Original"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* After image (compressed) with clip path */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt="Compressed"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm font-medium">
        Original
      </div>
      <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm font-medium">
        Compressed
      </div>
    </div>
  );
};

export default function ImageCompressor() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Compression options
  const [quality, setQuality] = useState(0.85);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [format, setFormat] = useState<CompressionFormat>('auto');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlsToCleanup = useRef<string[]>([]);

  // Constants
  const MAX_FILE_SIZE = useMemo(() => 50 * 1024 * 1024, []); // 50MB
  const SUPPORTED_FORMATS = useMemo(() => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], []);

  // Cleanup URLs
  const cleanupUrls = useCallback(() => {
    urlsToCleanup.current.forEach(url => URL.revokeObjectURL(url));
    urlsToCleanup.current = [];
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    if (!SUPPORTED_FORMATS.some(format => 
      file.type === `image/${format.replace('image/', '')}` || 
      file.name.toLowerCase().endsWith(`.${format.replace('image/', '')}`)
    )) {
      return 'Unsupported file format. Please use JPEG, PNG, or WebP.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`;
    }
    return null;
  }, [MAX_FILE_SIZE, SUPPORTED_FORMATS]);

  // Handle file selection
  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);
    setResult(null);
    
    // Validate file
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Clean up previous URLs
    cleanupUrls();

    setFile(selectedFile);

    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    urlsToCleanup.current.push(url);

    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setError('Failed to load image');
    };
    img.src = url;
  }, [validateFile, cleanupUrls]);

  // Handle drag and drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFile = acceptedFiles.find(file => file.type.startsWith('image/'));
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, [handleFileSelect]);

  // File input change handler
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }, [handleFileSelect]);

  // Compression logic
  const compressImage = useCallback(async () => {
    if (!file || !previewUrl || !originalDimensions) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create image element
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = previewUrl;
      });

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Calculate target dimensions
      let { width: targetWidth, height: targetHeight } = originalDimensions;

      // Apply max width constraint
      if (maxWidth && targetWidth > maxWidth) {
        const scale = maxWidth / targetWidth;
        targetWidth = Math.floor(targetWidth * scale);
        targetHeight = Math.floor(targetHeight * scale);
      }

      // Apply max height constraint
      if (maxHeight && targetHeight > maxHeight) {
        const scale = maxHeight / targetHeight;
        targetWidth = Math.floor(targetWidth * scale);
        targetHeight = Math.floor(targetHeight * scale);
      }

      // Ensure minimum dimensions
      targetWidth = Math.max(1, targetWidth);
      targetHeight = Math.max(1, targetHeight);

      // Set canvas size
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Configure high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Determine output format
      let outputMime = file.type;
      let outputFormat = file.type.split('/')[1];

      switch (format) {
        case 'webp':
          outputMime = 'image/webp';
          outputFormat = 'webp';
          break;
        case 'jpeg':
          outputMime = 'image/jpeg';
          outputFormat = 'jpeg';
          break;
        case 'png':
          outputMime = 'image/png';
          outputFormat = 'png';
          break;
        case 'auto':
          // Choose best format for compression
          if (file.type === 'image/png') {
            outputMime = 'image/webp';
            outputFormat = 'webp';
          } else {
            outputMime = 'image/jpeg';
            outputFormat = 'jpeg';
          }
          break;
      }

      // Export with quality setting (only for lossy formats)
      const qualityValue = outputMime === 'image/png' ? undefined : quality;

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), outputMime, qualityValue);
      });

      if (!blob) throw new Error('Failed to generate compressed image');

      const outputUrl = URL.createObjectURL(blob);
      urlsToCleanup.current.push(outputUrl);
      
      const sizeKB = Math.round(blob.size / 1024);

      setResult({
        url: outputUrl,
        sizeKB,
        format: outputFormat,
        dimensions: { width: targetWidth, height: targetHeight }
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Compression failed';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [file, previewUrl, originalDimensions, quality, maxWidth, maxHeight, format]);

  // Clear all
  const clearAll = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setOriginalDimensions(null);
    setResult(null);
    setError(null);
    cleanupUrls();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [cleanupUrls]);

  // Computed values
  const canCompress = useMemo(() => 
    !!file && !!originalDimensions && !isProcessing && !error,
    [file, originalDimensions, isProcessing, error]
  );

  const compressionRatio = useMemo(() => {
    if (!file || !result) return null;
    const originalSizeKB = Math.round(file.size / 1024);
    const ratio = ((originalSizeKB - result.sizeKB) / originalSizeKB) * 100;
    return Math.max(0, ratio);
  }, [file, result]);

  const getDownloadFileName = useCallback(() => {
    if (!file || !result) return 'compressed_image';
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const extension = result.format === 'jpeg' ? '.jpg' : `.${result.format}`;
    return `${baseName}_compressed${extension}`;
  }, [file, result]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupUrls();
    };
  }, [cleanupUrls]);

  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Minimize2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Image Compressor
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Reduce your image file sizes while maintaining quality. Perfect for web optimization and storage savings.
            </p>
          </div>
          {file && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Upload Area */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-8">
            <div className="relative border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Upload your image
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  PNG, JPG, JPEG, WebP • Max 50MB
                </p>
              </div>

              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full opacity-50" />
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full opacity-30" />
            </div>

            {/* File Info */}
            {file && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileImage className="w-5 h-5 text-blue-600" />
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
        {file && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Settings Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Compression Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h3>
                </div>

                <div className="space-y-6">
                  {/* Quality */}
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
                      step={0.05}
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Output Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as CompressionFormat)}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
                    >
                      <option value="auto">Auto (Optimized)</option>
                      <option value="webp">WebP</option>
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                    </select>
                  </div>

                  {/* Max Dimensions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Max Dimensions
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
                        <input
                          type="number"
                          value={maxWidth}
                          onChange={(e) => setMaxWidth(parseInt(e.target.value) || 0)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white text-sm"
                          placeholder="1920"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
                        <input
                          type="number"
                          value={maxHeight}
                          onChange={(e) => setMaxHeight(parseInt(e.target.value) || 0)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white text-sm"
                          placeholder="1080"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compress Button */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Compress</h3>
                </div>

                <button
                  type="button"
                  onClick={compressImage}
                  disabled={!canCompress}
                  className={`w-full group relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                    canCompress
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <span className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Compressing...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Minimize2 className="w-5 h-5" />
                      Compress Image
                    </span>
                  )}
                  {!isProcessing && canCompress && (
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Preview and Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Preview */}
              {previewUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Preview</h3>
                  </div>

                  {result ? (
                    <ImageComparisonSlider beforeImage={previewUrl} afterImage={result.url} />
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                      <img
                        src={previewUrl}
                        alt="Original image"
                        className="max-w-full h-auto rounded-lg mx-auto"
                        style={{ maxHeight: '320px' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Compressing Image...
                    </h3>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse" />
                  </div>
                </div>
              )}

              {/* Results */}
              {result && !isProcessing && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                      Compression Complete!
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Original Size</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatFileSize(file?.size || 0)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Compressed Size</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatFileSize(result.sizeKB * 1024)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Space Saved</p>
                      <p className="text-xl font-bold text-green-600">
                        {compressionRatio ? `${compressionRatio.toFixed(1)}%` : '0%'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <a
                      className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      href={result.url}
                      download={getDownloadFileName()}
                    >
                      <Download className="w-5 h-5" />
                      Download Compressed Image
                    </a>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <p className="text-red-800 dark:text-red-200 font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            🔒 All compression happens locally in your browser - your images never leave your device
          </p>
        </div>
      </div>
    </div>
  );
}