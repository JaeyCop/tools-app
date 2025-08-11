/* eslint-disable react/no-unknown-property */
'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import {
  Upload,
  Download,
  ImageIcon,
  Zap,
  Settings,
  Info,
  X,
  Check,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

/**
 * Type definitions
 */
type ImageFile = File & { readonly size: number; readonly type: string };

type CompressionFormat = 'auto' | 'webp' | 'jpeg' | 'png';

interface CompressionOptions {
  quality: number;
  maxWidth: string | number;
  maxHeight: string | number;
  format: CompressionFormat;
}

interface CompressionResult {
  url: string;
  sizeKB: number;
  format: string;
  dimensions: { width: number; height: number };
}

// Custom Skeleton component
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-600 rounded ${className}`} />
);

// Image comparison slider component
const ImageComparisonSlider = ({
  beforeImage,
  afterImage
}: {
  beforeImage: string;
  afterImage: string;
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-96 w-full overflow-hidden rounded-lg cursor-col-resize select-none"
      onMouseMove={handleSliderMove}
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
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/75 text-white px-2 py-1 rounded text-sm">
        Original
      </div>
      <div className="absolute top-4 right-4 bg-black/75 text-white px-2 py-1 rounded text-sm">
        Compressed
      </div>
    </div>
  );
};

export default function EnhancedImageCompressor() {
  /* --------------------------------------------------------------------------- */
  /* State                                                                      */
  /* --------------------------------------------------------------------------- */
  const [file, setFile] = useState<ImageFile | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [maxWidth, setMaxWidth] = useState<string | number>('');
  const [maxHeight, setMaxHeight] = useState<string | number>('');
  const [format, setFormat] = useState<CompressionFormat>('auto');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  /* --------------------------------------------------------------------------- */
  /* Constants and validation                                                   */
  /* --------------------------------------------------------------------------- */
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

  const validateFile = useCallback((file: File): string | null => {
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return 'Unsupported file format. Please use JPEG, PNG, or WebP.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File too large. Maximum size is 50MB.';
    }
    return null;
  }, []);

  /* --------------------------------------------------------------------------- */
  /* Derived values                                                             */
  /* --------------------------------------------------------------------------- */
  const compressionRatio = useMemo((): string | null => {
    if (!originalSizeKB || !result) return null;
    const ratio = ((originalSizeKB - result.sizeKB) / originalSizeKB) * 100;
    return Math.max(0, ratio).toFixed(1);
  }, [originalSizeKB, result]);

  const canCompress = useMemo(() =>
    !!file && !isProcessing && !error,
    [file, isProcessing, error]
  );

  /* --------------------------------------------------------------------------- */
  /* Drag and drop handlers                                                     */
  /* --------------------------------------------------------------------------- */
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer?.files ?? []);
    const imgFile = files.find((f) => f.type.startsWith('image/'));
    if (imgFile) {
      handleFileSelect(imgFile);
    }
  }, []);

  /* --------------------------------------------------------------------------- */
  /* File handling                                                              */
  /* --------------------------------------------------------------------------- */
  const cleanupUrls = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (result?.url) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }
  }, [previewUrl, result]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);

    // Validate file
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Clean up previous URLs
    cleanupUrls();

    setFile(selectedFile as ImageFile);
    setOriginalSizeKB(Math.round(selectedFile.size / 1024));

    // Create preview URL and get dimensions
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  }, [validateFile, cleanupUrls]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect],
  );

  const resetAll = useCallback(() => {
    setFile(null);
    setError(null);
    setOriginalSizeKB(null);
    setOriginalDimensions(null);
    cleanupUrls();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [cleanupUrls]);

  /* --------------------------------------------------------------------------- */
  /* Compression logic                                                         */
  /* --------------------------------------------------------------------------- */
  const compress = useCallback(async () => {
    if (!file || !previewUrl) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Load image
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = previewUrl;
      });

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context not available');

      // Calculate target dimensions
      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;

      const parseNumber = (val: string | number): number | null => {
        if (val === '' || val === null || val === undefined) return null;
        const num = typeof val === 'number' ? val : Number(val);
        return isNaN(num) || num <= 0 ? null : Math.floor(num);
      };

      const maxW = parseNumber(maxWidth);
      const maxH = parseNumber(maxHeight);

      // Apply width constraint
      if (maxW && targetWidth > maxW) {
        const scale = maxW / targetWidth;
        targetWidth = Math.floor(targetWidth * scale);
        targetHeight = Math.floor(targetHeight * scale);
      }

      // Apply height constraint
      if (maxH && targetHeight > maxH) {
        const scale = maxH / targetHeight;
        targetWidth = Math.floor(targetWidth * scale);
        targetHeight = Math.floor(targetHeight * scale);
      }

      // Ensure minimum dimensions
      targetWidth = Math.max(1, targetWidth);
      targetHeight = Math.max(1, targetHeight);

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
          // Auto-choose WebP for better compression, fallback to original format
          if (file.type.includes('png')) {
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
      const sizeKB = Math.round(blob.size / 1024);

      setResult({
        url: outputUrl,
        sizeKB,
        format: outputFormat,
        dimensions: { width: targetWidth, height: targetHeight }
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Compression failed: ${errorMessage}`);
      setError(err instanceof Error ? err.message : "Image compression failed");
    } finally {
      setIsProcessing(false);
    }
  }, [file, previewUrl, quality, maxWidth, maxHeight, format]);

  /* --------------------------------------------------------------------------- */
  /* Effects                                                                    */
  /* --------------------------------------------------------------------------- */

  // Setup drag and drop listeners
  useEffect(() => {
    const handleDragEnterGlobal = (e: DragEvent) => handleDragEnter(e);
    const handleDragLeaveGlobal = (e: DragEvent) => handleDragLeave(e);
    const handleDragOverGlobal = (e: DragEvent) => handleDragOver(e);
    const handleDropGlobal = (e: DragEvent) => handleDrop(e);

    document.addEventListener('dragenter', handleDragEnterGlobal);
    document.addEventListener('dragleave', handleDragLeaveGlobal);
    document.addEventListener('dragover', handleDragOverGlobal);
    document.addEventListener('drop', handleDropGlobal);

    return () => {
      document.removeEventListener('dragenter', handleDragEnterGlobal);
      document.removeEventListener('dragleave', handleDragLeaveGlobal);
      document.removeEventListener('dragover', handleDragOverGlobal);
      document.removeEventListener('drop', handleDropGlobal);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      cleanupUrls();
    };
  }, [cleanupUrls]);

  /* --------------------------------------------------------------------------- */
  /* Utility functions                                                          */
  /* --------------------------------------------------------------------------- */
  const getDownloadFileName = useCallback(() => {
    if (!file) return 'compressed_image';

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const extension = result?.format === 'jpeg' ? '.jpg' : `.${result?.format || 'jpg'}`;
    return `${baseName}_compressed${extension}`;
  }, [file, result]);

  /* --------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* --------------------------------------------------------------------------- */
  return (

    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Image Compressor
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Reduce your image file sizes while maintaining quality. Perfect
            for web optimization, email attachments, and storage savings.
          </p>
        </div>

        {file && (
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Clear all files and reset"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-100">Error</h4>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload area */}
      <div
        role="button"
        aria-label="Upload or drag image files"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-xl p-8 text-center transition-all duration-300 cursor-pointer border-2 border-dashed focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/80'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="sr-only"
          aria-describedby="upload-description"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-colors
                ${file
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-gray-100 dark:bg-gray-700'
              }`}
          >
            {file ? (
              <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {file ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-green-700 dark:text-green-400">
                {file.name}
              </p>

              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>{originalSizeKB} KB • {file.type}</p>
                {originalDimensions && (
                  <p>{originalDimensions.width} × {originalDimensions.height} pixels</p>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetAll();
                }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors focus:ring-2 focus:ring-red-500"
                aria-label="Remove selected file"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {isDragActive
                  ? 'Drop your image here'
                  : 'Click to upload or drag and drop'}
              </p>
              <p id="upload-description" className="text-sm text-gray-600 dark:text-gray-400">
                Supports JPEG, PNG, WebP (max 50MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {file && (
        <>
          {/* Original image preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Original Image
            </h3>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <img
                src={previewUrl || undefined}
                alt="Original image preview"
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Compression controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Compression Settings
              </h3>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                aria-expanded={showAdvanced}
              >
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
              </button>
            </div>

            {/* Quality */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="quality-slider" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quality
                </label>

                <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                  {Math.round(quality * 100)}%
                </span>
              </div>

              <input
                id="quality-slider"
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-describedby="quality-help"
              />

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Smallest</span>
                <span>Balanced</span>
                <span>Best Quality</span>
              </div>

              <p id="quality-help" className="text-xs text-gray-500 dark:text-gray-400">
                Lower quality = smaller file size, higher quality = better image
              </p>
            </div>

            {/* Advanced options */}
            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Format selection */}
                <div className="space-y-2">
                  <label htmlFor="format-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Output Format
                  </label>

                  <select
                    id="format-select"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as CompressionFormat)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="auto">Auto (Recommended)</option>
                    <option value="webp">WebP (Best Compression)</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Auto mode chooses the best format for optimal compression
                  </p>
                </div>

                {/* Resize options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="max-width" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Width (pixels)
                    </label>

                    <input
                      id="max-width"
                      type="number"
                      placeholder="Auto"
                      min="1"
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="max-height" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Height (pixels)
                    </label>

                    <input
                      id="max-height"
                      type="number"
                      placeholder="Auto"
                      min="1"
                      value={maxHeight}
                      onChange={(e) => setMaxHeight(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Leave empty for no resizing. Aspect ratio will be preserved.
                </p>
              </div>
            )}

            {/* Compress button */}
            <button
              type="button"
              onClick={compress}
              disabled={!canCompress}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-describedby="compress-help"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Compress Image
                </>
              )}
            </button>

            <p id="compress-help" className="text-xs text-gray-500 dark:text-gray-400 text-center">
              All processing happens locally in your browser - your images never leave your device
            </p>
          </div>

          {/* Loading skeleton */}
          {isProcessing && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-48 h-6" />
              </div>

              {/* Stats skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                    <Skeleton className="w-24 h-4 mx-auto mb-2" />
                    <Skeleton className="w-16 h-8 mx-auto" />
                  </div>
                ))}
              </div>

              {/* Preview skeleton */}
              <div className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-full h-48 rounded-lg" />
              </div>

              {/* Download button skeleton */}
              <Skeleton className="w-full h-12 rounded-lg" />
            </div>
          )}

          {/* Results */}
          {result && !isProcessing && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                Compression Complete
              </h3>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Original Size
                  </p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {originalSizeKB} KB
                  </p>
                  {originalDimensions && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {originalDimensions.width} × {originalDimensions.height}
                    </p>
                  )}
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Compressed Size
                  </p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {result.sizeKB} KB
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {result.dimensions.width} × {result.dimensions.height}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Space Saved
                  </p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {compressionRatio}%
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {Math.max(0, (originalSizeKB || 0) - result.sizeKB)} KB saved
                  </p>
                </div>
              </div>

              {/* Image comparison */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Before vs After Comparison
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Move your cursor over the image to compare original (left) with compressed (right)
                </p>
                <ImageComparisonSlider
                  beforeImage={previewUrl!}
                  afterImage={result.url}
                />
              </div>

              {/* Download section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Download Options
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Format: {result.format.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href={result.url}
                    download={getDownloadFileName()}
                    className="inline-flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Compressed
                  </a>

                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(result.url)}
                    className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Copy Image URL
                  </button>
                </div>
              </div>

              {/* Quality assessment */}
              {compressionRatio && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Compression Efficiency
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {parseFloat(compressionRatio) > 50 ? 'Excellent' :
                        parseFloat(compressionRatio) > 30 ? 'Good' :
                          parseFloat(compressionRatio) > 10 ? 'Fair' : 'Minimal'}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, parseFloat(compressionRatio))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Help and tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-3">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Tips for Best Results
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Quality Settings
                </h5>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• 70-85% quality for photos</li>
                  <li>• 90-100% for graphics with text</li>
                  <li>• Lower quality = smaller files</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Format Guide
                </h5>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• WebP: Best compression</li>
                  <li>• JPEG: Good for photos</li>
                  <li>• PNG: Lossless, larger files</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Privacy:</strong> All processing happens locally in your browser.
                Your images are never uploaded to any server.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical info for developers */}
      {file && result && (
        <details className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <summary className="p-4 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Technical Details
          </summary>
          <div className="px-4 pb-4 text-xs font-mono text-gray-600 dark:text-gray-400 space-y-2">
            <div>Original: {file.type}, {originalSizeKB} KB, {originalDimensions?.width}×{originalDimensions?.height}px</div>
            <div>Output: image/{result.format}, {result.sizeKB} KB, {result.dimensions.width}×{result.dimensions.height}px</div>
            <div>Quality: {Math.round(quality * 100)}%, Compression: {compressionRatio}%</div>
            <div>Size reduction: {Math.max(0, (originalSizeKB || 0) - result.sizeKB)} KB</div>
          </div>
        </details>
      )}
    </div>

  );
}