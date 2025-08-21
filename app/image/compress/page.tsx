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
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import ToolSeoContent from '@/components/ToolSeoContent';
import SeoHowToJsonLd from '@/components/SeoHowToJsonLd';
import SeoFaqJsonLd from '@/components/SeoFaqJsonLd';
import { ToolLayout } from '@/components/ToolLayout';
import { div } from 'framer-motion/client';


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
      <div className="absolute top-4 left-4 bg-background/80 text-foreground px-2 py-1 rounded text-sm">
        Original
      </div>
      <div className="absolute top-4 right-4 bg-background/80 text-foreground px-2 py-1 rounded text-sm">
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
  const MAX_FILE_SIZE = useMemo(() => 50 * 1024 * 1024, []); // 50MB
  const SUPPORTED_FORMATS = useMemo(() => ['image/jpeg', 'image/png', 'image/webp'], []);

  const validateFile = useCallback((file: File): string | null => {
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return 'Unsupported file format. Please use JPEG, PNG, or WebP.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File too large. Maximum size is 50MB.';
    }
    return null;
  }, [MAX_FILE_SIZE, SUPPORTED_FORMATS]);

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
  /* File handling                                                              */
  /* --------------------------------------------------------------------------- */
  const cleanupUrls = useCallback(() => {
    setPreviewUrl(prev => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    setResult(prev => {
      if (prev?.url) {
        URL.revokeObjectURL(prev.url);
      }
      return null;
    });
  }, []);

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
  }, [handleFileSelect]);

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
  // Fallback compression function (no worker)
  const compressImageDirect = useCallback(async () => {
    if (!file || !previewUrl) {
      return;
    }

    const parseNumber = (val: string | number) => {
      if (val === '' || val === null || val === undefined) return null;
      const num = typeof val === 'number' ? val : Number(val);
      return isNaN(num) || num <= 0 ? null : Math.floor(num);
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = previewUrl;
    });

    // Calculate target dimensions
    let targetWidth = img.naturalWidth;
    let targetHeight = img.naturalHeight;

    const maxW = parseNumber(maxWidth);
    const maxH = parseNumber(maxHeight);

    if (maxW && targetWidth > maxW) {
      const scale = maxW / targetWidth;
      targetWidth = Math.floor(targetWidth * scale);
      targetHeight = Math.floor(targetHeight * scale);
    }

    if (maxH && targetHeight > maxH) {
      const scale = maxH / targetHeight;
      targetWidth = Math.floor(targetWidth * scale);
      targetHeight = Math.floor(targetHeight * scale);
    }

    targetWidth = Math.max(1, targetWidth);
    targetHeight = Math.max(1, targetHeight);

    // Create canvas and draw image
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) {
      ctx.imageSmoothingQuality = 'high';
    }
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
        if (file.type.includes('png') && quality < 0.9) {
          outputMime = 'image/webp';
          outputFormat = 'webp';
        } else if (file.type.includes('png')) {
          outputMime = 'image/png';
          outputFormat = 'png';
        } else {
          outputMime = 'image/jpeg';
          outputFormat = 'jpeg';
        }
        break;
    }

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      const qualityValue = outputMime === 'image/png' ? undefined : quality;

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, outputMime, qualityValue);
    });

    const sizeKB = Math.round(blob.size / 1024);
    const outputUrl = URL.createObjectURL(blob);

    setResult({
      url: outputUrl,
      sizeKB,
      format: outputFormat,
      dimensions: { width: targetWidth, height: targetHeight },
    });
  }, [file, previewUrl, quality, maxWidth, maxHeight, format]);

  const compress = useCallback(async () => {
    if (!file || !previewUrl) return;

    setIsProcessing(true);
    setError(null);

    try {
      await compressImageDirect();
    } catch (err) {
      setError(`Failed to process image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }, [file, previewUrl, quality, maxWidth, maxHeight, format, compressImageDirect]);

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
  const sidebarContent = (
    <div className="space-y-6">
      {/* Compression controls */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Compression Settings
        </h3>

        {/* Quality */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="quality-slider" className="text-sm font-medium text-foreground">
              Quality
            </label>

            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
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
            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            aria-describedby="quality-help"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Smallest</span>
            <span>Balanced</span>
            <span>Best Quality</span>
          </div>

          <p id="quality-help" className="text-xs text-muted-foreground">
            Lower quality = smaller file size, higher quality = better image
          </p>
        </div>

        {/* Advanced options */}
        <div className="space-y-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-primary hover:text-primary/80 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1 flex items-center justify-between"
            aria-expanded={showAdvanced}
          >
            <span>Advanced Options</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              {/* Format selection */}
              <div className="space-y-2">
                <label htmlFor="format-select" className="text-sm font-medium text-foreground">
                  Output Format
                </label>

                <select
                  id="format-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as CompressionFormat)}
                  className="w-full p-2 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                >
                  <option value="auto">Auto (Recommended)</option>
                  <option value="webp">WebP (Best Compression)</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>

                <p className="text-xs text-muted-foreground">
                  Auto mode chooses the best format for optimal compression
                </p>
              </div>

              {/* Resize options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="max-width" className="text-sm font-medium text-foreground">
                    Max Width (pixels)
                  </label>

                  <input
                    id="max-width"
                    type="number"
                    placeholder="Auto"
                    min="1"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(e.target.value)}
                    className="w-full p-2 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="max-height" className="text-sm font-medium text-foreground">
                    Max Height (pixels)
                  </label>

                  <input
                    id="max-height"
                    type="number"
                    placeholder="Auto"
                    min="1"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(e.target.value)}
                    className="w-full p-2 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Leave empty for no resizing. Aspect ratio will be preserved.
              </p>
            </div>
          )}
        </div>

        {/* Compress button */}
        {file && (
          <button
            type="button"
            onClick={compress}
            disabled={!canCompress}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby="compress-help"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compressing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Compress Image</span>
              </div>
            )}
          </button>
        )}

        {file && (
          <button
            onClick={resetAll}
            className="w-full px-4 py-2 bg-red-500/10 text-red-600 rounded-xl text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>
    </div>
  )

  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce your image file sizes while maintaining quality. Perfect for web optimization, email attachments, and storage savings."
      icon={<Zap className="h-8 w-8 text-primary" />}
      sidebar={sidebarContent}
    >
      <div className="space-y-6">
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
          className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center cursor-pointer transition-all duration-300 group ${isDragActive
            ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20'
            : 'border-border hover:border-primary/50 hover:bg-primary/5'
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
                  <ImageIcon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
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
                  <span>Max 50MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {file && (
          <>
            {/* File Info */}
            <div className="p-4 bg-muted/50 rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {originalDimensions?.width} × {originalDimensions?.height} pixels
                  </p>
                </div>
              </div>
            </div>

            {/* Original image preview */}
            <div className="bg-card rounded-xl p-6 border">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Original Image
              </h3>

              <div className="bg-muted/50 rounded-lg p-4">
                <img
                  src={previewUrl || undefined}
                  alt="Original image preview"
                  className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </>
        )}

        {/* Loading skeleton */}
        {isProcessing && (
          <div className="bg-card rounded-xl p-6 border space-y-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-48 h-6" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted/50 p-4 rounded-lg text-center">
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
          <div className="bg-card rounded-xl p-6 border space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Check className="w-5 h-5 text-success" />
              Compression Complete
            </h3>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/5 p-4 rounded-lg text-center">
                <p className="text-sm text-primary font-medium">
                  Original Size
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {originalSizeKB} KB
                </p>
                {originalDimensions && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {originalDimensions.width} × {originalDimensions.height}
                  </p>
                )}
              </div>

              <div className="bg-success/5 p-4 rounded-lg text-center">
                <p className="text-sm text-success font-medium">
                  Compressed Size
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {result.sizeKB} KB
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.dimensions.width} × {result.dimensions.height}
                </p>
              </div>

              <div className="bg-purple-500/5 p-4 rounded-lg text-center">
                <p className="text-sm text-purple-500 font-medium">
                  Space Saved
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {compressionRatio}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.max(0, (originalSizeKB || 0) - result.sizeKB)} KB saved
                </p>
              </div>
            </div>

            {/* Image comparison */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">
                Before vs After Comparison
              </h4>
              <p className="text-sm text-muted-foreground">
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
                <h4 className="font-medium text-foreground">
                  Download Options
                </h4>
                <div className="text-sm text-muted-foreground">
                  Format: {result.format.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href={result.url}
                  download={getDownloadFileName()}
                  className="inline-flex items-center justify-center gap-2 w-full bg-success hover:bg-success/90 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-success/50 focus:ring-offset-2"
                >
                  <Download className="w-4 h-4" />
                  Download Compressed
                </a>

                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(result.url)}
                  className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Copy Image URL
                </button>
              </div>
            </div>

            {/* Quality assessment */}
            {compressionRatio && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Compression Efficiency
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {parseFloat(compressionRatio) > 50 ? 'Excellent' :
                      parseFloat(compressionRatio) > 30 ? 'Good' :
                        parseFloat(compressionRatio) > 10 ? 'Fair' : 'Minimal'}
                  </span>
                </div>
                <div className="mt-2 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, parseFloat(compressionRatio))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help and tips */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">
                Tips for Best Results
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">
                    Quality Settings
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 70-85% quality for photos</li>
                    <li>• 90-100% for graphics with text</li>
                    <li>• Lower quality = smaller files</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">
                    Format Guide
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• WebP: Best compression</li>
                    <li>• JPEG: Good for photos</li>
                    <li>• PNG: Lossless, larger files</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Privacy:</strong> All processing happens locally in your browser.
                  Your images are never uploaded to any server.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical info for developers */}
        {file && result && (
          <details className="bg-card rounded-xl border">
            <summary className="p-4 cursor-pointer text-sm font-medium text-foreground hover:text-primary">
              Technical Details
            </summary>
            <div className="px-4 pb-4 text-xs font-mono text-muted-foreground space-y-2">
              <div>Original: {file.type}, {originalSizeKB} KB, {originalDimensions?.width}×{originalDimensions?.height}px</div>
              <div>Output: image/{result.format}, {result.sizeKB} KB, {result.dimensions.width}×{result.dimensions.height}px</div>
              <div>Quality: {Math.round(quality * 100)}%, Compression: {compressionRatio}%</div>
              <div>Size reduction: {Math.max(0, (originalSizeKB || 0) - result.sizeKB)} KB</div>
            </div>
          </details>
        )}
      </div>

      {/* Educational Content Section */}
      <div className="mt-16 space-y-12">
        {/* Understanding Image Compression */}
        <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Understanding Image Compression Science
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Compression Algorithms</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Image compression uses mathematical algorithms to reduce file size by removing redundant data and optimizing color information. Our tool employs state-of-the-art techniques for maximum efficiency.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Lossy compression for dramatic size reduction</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Lossless optimization for metadata removal</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Perceptual quality optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Smart format selection algorithms</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Quality vs Size Balance</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">High Quality (85-95%)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Minimal compression artifacts, ideal for professional photography and print materials.</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Balanced (70-85%)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Optimal for web use, social media, and general sharing with excellent quality retention.</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">High Compression (50-70%)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Maximum size reduction for email attachments and bandwidth-limited scenarios.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">🧠 Smart Compression Technology</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-emerald-700 dark:text-emerald-300">Perceptual Optimization:</span>
                <p className="text-emerald-600 dark:text-emerald-400">Focuses compression on areas less noticeable to human vision</p>
              </div>
              <div>
                <span className="font-medium text-emerald-700 dark:text-emerald-300">Content-Aware Processing:</span>
                <p className="text-emerald-600 dark:text-emerald-400">Adapts compression strategy based on image content and complexity</p>
              </div>
            </div>
          </div>
        </section>

        {/* Format Optimization */}
        <section className="bg-surface/80 border border-border rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            Format-Specific Optimization
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">J</div>
                JPEG Optimization
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• DCT-based compression for photos</li>
                <li>• Chroma subsampling optimization</li>
                <li>• Progressive encoding support</li>
                <li>• Huffman table optimization</li>
              </ul>
              <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <div className="text-xs font-medium text-orange-800 dark:text-orange-200">Best For:</div>
                <div className="text-xs text-orange-600 dark:text-orange-400">Photographs, complex images, natural scenes</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">P</div>
                PNG Optimization
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Lossless compression algorithms</li>
                <li>• Palette optimization for PNG-8</li>
                <li>• Alpha channel compression</li>
                <li>• Metadata stripping</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-xs font-medium text-blue-800 dark:text-blue-200">Best For:</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Graphics, logos, images with transparency</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">W</div>
                WebP Optimization
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• VP8/VP8L compression engines</li>
                <li>• Both lossy and lossless modes</li>
                <li>• Advanced prediction algorithms</li>
                <li>• Superior compression ratios</li>
              </ul>
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-xs font-medium text-green-800 dark:text-green-200">Best For:</div>
                <div className="text-xs text-green-600 dark:text-green-400">Modern web applications, all image types</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">📊 Compression Performance Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200 dark:border-amber-700">
                    <th className="text-left py-2 text-amber-800 dark:text-amber-200">Format</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Compression Ratio</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Quality Loss</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Transparency</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Browser Support</th>
                  </tr>
                </thead>
                <tbody className="text-amber-700 dark:text-amber-300">
                  <tr className="border-b border-amber-100 dark:border-amber-800">
                    <td className="py-2 font-medium">JPEG</td>
                    <td className="text-center py-2">High</td>
                    <td className="text-center py-2">Minimal</td>
                    <td className="text-center py-2">No</td>
                    <td className="text-center py-2">Universal</td>
                  </tr>
                  <tr className="border-b border-amber-100 dark:border-amber-800">
                    <td className="py-2 font-medium">PNG</td>
                    <td className="text-center py-2">Medium</td>
                    <td className="text-center py-2">None</td>
                    <td className="text-center py-2">Yes</td>
                    <td className="text-center py-2">Universal</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">WebP</td>
                    <td className="text-center py-2">Highest</td>
                    <td className="text-center py-2">Minimal</td>
                    <td className="text-center py-2">Yes</td>
                    <td className="text-center py-2">Modern</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Advanced Techniques */}
        <section className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-xl">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            Advanced Compression Techniques
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Optimization Strategies</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Dimension optimization:</span>
                    <span className="text-muted-foreground ml-2">Resize images to target display size before compression</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Quality targeting:</span>
                    <span className="text-muted-foreground ml-2">Adjust quality based on image content and intended use</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Format selection:</span>
                    <span className="text-muted-foreground ml-2">Choose optimal format based on image characteristics</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-foreground">Metadata removal:</span>
                    <span className="text-muted-foreground ml-2">Strip unnecessary EXIF data and color profiles</span>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Use Case Optimization</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Web Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Target 70-85% quality with WebP format for fastest loading times and best user experience.</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Email Sharing</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Use 60-75% quality with size limits to ensure deliverability while maintaining readability.</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-rose-200 dark:border-rose-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Social Media</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Optimize for platform-specific dimensions and compression to prevent quality degradation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🎯 Compression Best Practices</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-purple-700 dark:text-purple-300">Start High Quality:</span>
                <p className="text-purple-600 dark:text-purple-400">Always begin with the highest quality source image available</p>
              </div>
              <div>
                <span className="font-medium text-purple-700 dark:text-purple-300">Test Multiple Settings:</span>
                <p className="text-purple-600 dark:text-purple-400">Compare different quality levels to find the optimal balance</p>
              </div>
              <div>
                <span className="font-medium text-purple-700 dark:text-purple-300">Consider Context:</span>
                <p className="text-purple-600 dark:text-purple-400">Match compression level to intended viewing context and audience</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SEO Components */}
      <ToolSeoContent
        title="Online Image Compressor"
        overview="Drastically reduce the file size of your images while maintaining excellent quality. Our smart compression tool helps you optimize your images for the web, email, and storage, all without sacrificing clarity. The entire process is secure and happens right in your browser."
        steps={[
          "Upload Your Image: Drag and drop your image (JPG, PNG, or WebP) into the upload area, or click to select it from your device.",
          "Adjust Compression Settings: Use the quality slider to find the perfect balance between file size and visual quality. For more control, you can also set a max width or height and choose a specific output format in the advanced options.",
          "Compress & Download: Click the 'Compress Image' button. Our tool will instantly process your image and show you a before-and-after comparison. You can then download your new, smaller image.",
        ]}
        tips={[
          "Use 70-85% quality for photos to balance size and clarity.",
          "Choose WebP format for best compression, JPEG for photos, PNG for graphics with transparency.",
          "Resize images to target display size before compressing for further savings.",
          "All processing happens locally in your browser for complete privacy.",
        ]}
        faq={[
          { q: "Is it safe to compress my photos here?", a: "Yes, it is completely secure. The entire compression process happens in your browser, meaning your images never leave your computer. Your privacy is fully protected." },
          { q: "Will compressing an image reduce its quality?", a: "Compression always involves a trade-off between file size and quality. Our tool is designed to minimize this trade-off, and our quality slider gives you full control to find a result you are happy with. For most web uses, a quality of 75-85% provides excellent results with a significantly smaller file size." },
          { q: "What is the best format to use?", a: "For most cases, our 'Auto' setting is the best choice. It will often convert images to WebP, which offers the best compression. If you need to maintain transparency, choose PNG. For photos, JPEG is a good option." },
          { q: "Can I compress multiple images at once?", a: "Currently, our tool processes one image at a time to give you the most control over the compression settings and to provide a clear before-and-after comparison." },
        ]}
      />
    </ToolLayout>
  );
}