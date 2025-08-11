"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import {
  Upload,
  Image,
  Download,
  Loader2,
  CheckCircle,
  Scissors,
  Pipette,
  Sliders,
  Eye,
  EyeOff,
  RotateCcw,
  Zap,
  Target,
  Palette,
  MousePointer,
  X,
  Brush
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

const Spinner = () => <Loader2 className="w-4 h-4 animate-spin" />;

function colorDistanceSq(a: [number, number, number], b: [number, number, number]) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [picked, setPicked] = useState<[number, number, number] | null>(null);
  const [tolerance, setTolerance] = useState<number>(900);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pickingMode, setPickingMode] = useState(false);
  const [brushSize, setBrushSize] = useState<number>(20);
  const [brushMode, setBrushMode] = useState<string>('erase');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const onDrop = useCallback((accepted: File[]) => {
    const img = accepted.find((f) => f.type.startsWith("image/"));
    if (img) {
      setFile(img);
      const url = URL.createObjectURL(img);
      setImageUrl(url);
      setOutputUrl(null);
      setPreviewUrl(null);
      setPicked(null);
      setPickingMode(false);
    }
  }, []);

  const canProcess = useMemo(() => !!file && !!picked && !isProcessing, [file, picked, isProcessing]);

  const onImageLoad = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
  };

  const onPickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pickingMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const idx = (y * canvas.width + x) * 4;
    const color: [number, number, number] = [data.data[idx], data.data[idx + 1], data.data[idx + 2]];
    setPicked(color);
    setPickingMode(false);
    generatePreview(color, tolerance);
  };

  const generatePreview = async (color: [number, number, number], currentTolerance: number) => {
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!canvas || !previewCanvas) return;

    const ctx = canvas.getContext("2d");
    const previewCtx = previewCanvas.getContext("2d");
    if (!ctx || !previewCtx) return;

    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const previewData = new ImageData(new Uint8ClampedArray(imageData.data), canvas.width, canvas.height);

    for (let i = 0; i < previewData.data.length; i += 4) {
      const r = previewData.data[i];
      const g = previewData.data[i + 1];
      const b = previewData.data[i + 2];
      if (colorDistanceSq([r, g, b], color) <= currentTolerance) {
        previewData.data[i + 3] = 0; // make transparent
      }
    }

    previewCtx.putImageData(previewData, 0, 0);
    const blob: Blob = await new Promise((resolve) => previewCanvas.toBlob((b) => resolve(b as Blob), "image/png"));
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  const updateTolerance = (newTolerance: number) => {
    setTolerance(newTolerance);
    if (picked) {
      generatePreview(picked, newTolerance);
    }
  };

  const removeBg = async () => {
    const canvas = canvasRef.current; // Main canvas with original image
    const drawingCanvas = drawingCanvasRef.current; // Canvas with brush strokes
    if (!canvas || !picked || !drawingCanvas) return;

    setIsProcessing(true);
    try {
      const ctx = canvas.getContext("2d");
      const drawingCtx = drawingCanvas.getContext("2d");
      if (!ctx || !drawingCtx) return;

      // Re-draw the original image to canvasRef before processing
      // to ensure we start with the original pixel data.
      const img = imgRef.current;
      if (!img) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // 1. Apply color-based background removal
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (colorDistanceSq([r, g, b], picked) <= tolerance) {
          data[i + 3] = 0; // make transparent
        }
      }

      // 2. Apply brush strokes from drawingCanvas
      const drawingData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
      const drawingPixels = drawingData.data;

      for (let i = 0; i < data.length; i += 4) {
        const drawingAlpha = drawingPixels[i + 3];

        if (drawingAlpha > 0) { // If there was a stroke at this pixel
          const r = drawingPixels[i];
          const g = drawingPixels[i + 1];
          const b = drawingPixels[i + 2];

          // If the stroke was "erase" (black color)
          if (r === 0 && g === 0 && b === 0) {
            data[i + 3] = 0; // Erase (make transparent)
          }
          // If the stroke was "restore" (white color)
          else if (r === 255 && g === 255 && b === 255) {
            data[i + 3] = 255; // Restore (make opaque)
          }
        }
      }

      ctx.putImageData(imageData, 0, 0); // Apply final image data to main canvas

      const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/png", 0.92));
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSelection = () => {
    setPicked(null);
    setPreviewUrl(null);
    setPickingMode(false);
    setShowPreview(false);
  };

  const tolerancePercentage = Math.round((tolerance / 20000) * 100);

  function startDrawing(event: React.MouseEvent<HTMLCanvasElement>): void {
    throw new Error("Function not implemented.");
  }

  function draw(event: React.MouseEvent<HTMLCanvasElement>): void {
    throw new Error("Function not implemented.");
  }

  function endDrawing(event: React.MouseEvent<HTMLCanvasElement>): void {
    throw new Error("Function not implemented.");
  }



  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Background Remover
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Remove backgrounds from your images with precision. Click to select background colors and adjust tolerance for perfect results.
            </p>
          </div>
          {file && (
            <button
              onClick={resetSelection}
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
                        ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 scale-[1.02]'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
                      }
                    `}
                  >
                    <input {...getInputProps()} />

                    <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                      <div className="mb-6">
                        {isDragActive ? (
                          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <Upload className="w-8 h-8 text-purple-500" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-purple-500 transition-colors" />
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
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full opacity-50"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20 rounded-full opacity-30"></div>
                  </div>
                )}
              </Dropzone>

              {/* File Info */}
              {file && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Image className="w-5 h-5 text-purple-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
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
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
              {/* Original Image */}
              <div className="lg:col-span-2 space-y-6">
                {/* Source Image */}
                <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Original Image</h3>
                    </div>

                    {!picked && (
                      <button
                        onClick={() => setPickingMode(!pickingMode)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${pickingMode
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                          }`}
                      >
                        <Pipette className="w-4 h-4" />
                        {pickingMode ? 'Click on background' : 'Pick background color'}
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <img
                      ref={imgRef}
                      src={imageUrl}
                      alt="Original image for background removal"
                      className="max-w-full h-auto rounded-xl shadow-sm mx-auto block"
                      onLoad={onImageLoad}
                      style={{ maxHeight: '500px' }}
                    />
                    <canvas
                      ref={canvasRef} // This is the original canvas for color picking
                      className={`absolute inset-0 w-full h-full opacity-0 rounded-xl ${pickingMode ? 'cursor-crosshair z-10' : 'pointer-events-none'
                        }`}
                      onClick={onPickColor}
                      style={{ maxHeight: '500px' }}
                    />
                    <canvas
                      ref={drawingCanvasRef} // New canvas for drawing
                      className="absolute inset-0 w-full h-full rounded-xl z-20 cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={endDrawing}
                      onMouseLeave={endDrawing}
                      style={{ maxHeight: '500px' }}
                    />

                    {pickingMode && (
                      <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium animate-pulse">
                        <div className="flex items-center gap-2">
                          <MousePointer className="w-4 h-4" />
                          Click on the background to select
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                {(previewUrl || outputUrl) && (
                  <div className="card-premium p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Target className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {outputUrl ? 'Final Result' : 'Live Preview'}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {showPreview ? 'Hide checkerboard' : 'Show transparency'}
                        </button>
                      </div>
                    </div>

                    <div className={`relative rounded-xl overflow-hidden ${showPreview ? 'bg-transparent' : 'bg-white dark:bg-gray-700'}`}>
                      {showPreview && (
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                            linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                            linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                            linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                          }}
                        />
                      )}
                      <img
                        alt="Processed image with background removed"
                        src={(outputUrl || previewUrl) || ""}
                        className="max-w-full h-auto shadow-sm mx-auto block relative z-10"
                        style={{ maxHeight: '500px' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-6">
                {/* Brush Settings */}
                {file && (
                  <div className="card-premium p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Brush className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Brush Settings</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Brush Size */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brush Size</label>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">{brushSize}px</span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={100}
                          step={1}
                          value={brushSize}
                          onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                          className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Brush Mode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mode</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBrushMode('erase')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${brushMode === 'erase' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                          >
                            Erase
                          </button>
                          <button
                            onClick={() => setBrushMode('restore')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${brushMode === 'restore' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {picked && (
                  <div className="card-premium p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Palette className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Selected Color</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                          style={{ backgroundColor: rgbToHex(picked[0], picked[1], picked[2]) }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            RGB({picked[0]}, {picked[1]}, {picked[2]})
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {rgbToHex(picked[0], picked[1], picked[2]).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={resetSelection}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset Selection
                      </button>
                    </div>
                  </div>
                )}

                {/* Tolerance Control */}
                {picked && (
                  <div className="card-premium p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Sliders className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tolerance</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Sensitivity
                        </span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                          {tolerancePercentage}%
                        </span>
                      </div>

                      <input
                        type="range"
                        min={50}
                        max={20000}
                        step={50}
                        value={tolerance}
                        onChange={(e) => updateTolerance(parseInt(e.target.value, 10))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${tolerancePercentage}%, #e5e7eb ${tolerancePercentage}%, #e5e7eb 100%)`
                        }}
                      />

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Precise</span>
                        <span>Flexible</span>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Tip:</strong> Lower values remove colors more precisely, higher values remove similar colors too.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Process Button */}
                {canProcess && (
                  <div className="card-premium p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Process Image</h3>
                    </div>

                    <button
                      onClick={removeBg}
                      disabled={!canProcess}
                      className={`
                        w-full group relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform
                        ${canProcess
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {isProcessing && (
                        <Spinner />
                      )}
                      {isProcessing ? "Processing..." : "Remove Background"}

                      {!isProcessing && canProcess && (
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </button>
                  </div>
                )}

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
                  <div className="bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-900/20 dark:to-purple-900/20 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                        Background Removed!
                      </h3>
                    </div>

                    <p className="text-green-700 dark:text-green-300 mb-6">
                      Your image has been processed with a transparent background. Download as PNG to preserve transparency.
                    </p>

                    <a
                      className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      href={outputUrl}
                      download={`no-bg-${file?.name?.replace(/\.[^/.]+$/, ".png")}`}
                    >
                      <Download className="w-5 h-5" />
                      Download Transparent PNG
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for preview generation */}
        <canvas ref={previewCanvasRef} className="hidden" />

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            🔒 All processing happens locally in your browser - your images never leave your device
          </p>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}