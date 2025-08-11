"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  Upload,
  Image as ImageIcon,
  Download,
  Loader2,
  CheckCircle,
  Layers,
  Settings,
  Zap,
  ChevronUp,
  ChevronDown,
  X,
  RotateCcw,
  FileImage,
  Grid3X3,
  ArrowUpDown,
  Info,
  Sparkles
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

const Spinner = () => <Loader2 className="w-4 h-4 animate-spin" />;

type PageSize = "auto" | "a4" | "letter" | "a3" | "custom";
type Orientation = "portrait" | "landscape";
type Layout = "fit" | "fill" | "stretch";

interface PageSettings {
  size: PageSize;
  orientation: Orientation;
  layout: Layout;
  margin: number;
  customWidth?: number;
  customHeight?: number;
}

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    size: "auto",
    orientation: "portrait",
    layout: "fit",
    margin: 20
  });
  const [filename, setFilename] = useState<string>("images.pdf");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const urlsToRevokeRef = useRef<string[]>([]);

  useEffect(() => {
    // Cleanup URLs on unmount
    return () => {
      urlsToRevokeRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    // Create preview URLs for uploaded images
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    urlsToRevokeRef.current = [...urlsToRevokeRef.current, ...urls];
    
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback((accepted: File[]) => {
    const imgs = accepted.filter((f) => 
      f.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(f.name)
    );
    if (imgs.length) {
      setFiles((prev) => [...prev, ...imgs]);
      setPdfUrl(null);
      setErrorMessage(null);
    }
  }, []);

  const moveFile = (from: number, to: number) => {
    setFiles((prev) => {
      const clone = [...prev];
      const [item] = clone.splice(from, 1);
      clone.splice(to, 0, item);
      return clone;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canExport = useMemo(() => files.length > 0 && !isProcessing, [files.length, isProcessing]);

  const getPageDimensions = () => {
    const { size, orientation, customWidth, customHeight } = pageSettings;
    
    let width = 595; // A4 width in points
    let height = 842; // A4 height in points
    
    switch (size) {
      case "a4":
        width = 595;
        height = 842;
        break;
      case "letter":
        width = 612;
        height = 792;
        break;
      case "a3":
        width = 842;
        height = 1191;
        break;
      case "custom":
        width = customWidth || 595;
        height = customHeight || 842;
        break;
      case "auto":
        return null; // Will be determined by first image
    }
    
    if (orientation === "landscape") {
      [width, height] = [height, width];
    }
    
    return { width, height };
  };

  const buildPdf = async () => {
    if (!files.length) return;
    
    setIsProcessing(true);
    setPdfUrl(null);
    setErrorMessage(null);
    
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      let pageDimensions = getPageDimensions();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bytes = await file.arrayBuffer();
        
        let image;
        try {
          if (file.type.includes("png") || file.name.toLowerCase().endsWith('.png')) {
            image = await doc.embedPng(bytes);
          } else {
            image = await doc.embedJpg(bytes);
          }
        } catch {
          // Fallback: try the other format
          try {
            image = file.type.includes("png") ? await doc.embedJpg(bytes) : await doc.embedPng(bytes);
          } catch {
            throw new Error(`Failed to embed image: ${file.name}`);
          }
        }

        const { width: imgWidth, height: imgHeight } = image.scale(1);
        
        // Determine page size
        if (!pageDimensions && pageSettings.size === "auto") {
          // Use first image dimensions for auto mode
          pageDimensions = { width: imgWidth, height: imgHeight };
        }
        
        const pageWidth = pageDimensions?.width || imgWidth;
        const pageHeight = pageDimensions?.height || imgHeight;
        const page = doc.addPage([pageWidth, pageHeight]);
        
        // Calculate image placement
        const margin = pageSettings.margin;
        const availableWidth = pageWidth - (margin * 2);
        const availableHeight = pageHeight - (margin * 2);
        
        let drawWidth = imgWidth;
        let drawHeight = imgHeight;
        let x = margin;
        let y = margin;
        
        switch (pageSettings.layout) {
          case "fit":
            // Scale to fit while maintaining aspect ratio
            const scaleX = availableWidth / imgWidth;
            const scaleY = availableHeight / imgHeight;
            const scale = Math.min(scaleX, scaleY);
            drawWidth = imgWidth * scale;
            drawHeight = imgHeight * scale;
            x = (pageWidth - drawWidth) / 2;
            y = (pageHeight - drawHeight) / 2;
            break;
          case "fill":
            // Scale to fill, may crop
            const fillScaleX = availableWidth / imgWidth;
            const fillScaleY = availableHeight / imgHeight;
            const fillScale = Math.max(fillScaleX, fillScaleY);
            drawWidth = imgWidth * fillScale;
            drawHeight = imgHeight * fillScale;
            x = (pageWidth - drawWidth) / 2;
            y = (pageHeight - drawHeight) / 2;
            break;
          case "stretch":
            // Stretch to fill exactly
            drawWidth = availableWidth;
            drawHeight = availableHeight;
            break;
        }
        
        page.drawImage(image, { 
          x, 
          y, 
          width: drawWidth, 
          height: drawHeight 
        });
      }

      const out = await doc.save();
      const buf = new ArrayBuffer(out.length);
      new Uint8Array(buf).set(out);
      const blob = new Blob([buf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      urlsToRevokeRef.current.push(url);
      setPdfUrl(url);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "PDF creation failed";
      setErrorMessage(`Failed to create PDF: ${errorMsg}`);
      console.error("PDF creation error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Images to PDF
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Combine multiple images into a single PDF document. Drag to reorder, customize layout and page settings.
            </p>
          </div>
          {files.length > 0 && (
            <button
              onClick={() => {
                setFiles([]);
                setPdfUrl(null);
                setErrorMessage(null);
              }}
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
            <Dropzone onDrop={onDrop} accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"] }}>
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
                          <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        {isDragActive ? "Drop your images here!" : "Upload your images"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        PNG, JPG, JPEG, WebP, GIF, BMP • Multiple files supported
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full opacity-50" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full opacity-30" />
                </div>
              )}
            </Dropzone>

            {/* File Summary */}
            {files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FileImage className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {files.length} image{files.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total size: {formatFileSize(totalSize)}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {files.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Images List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Grid3X3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Image Order</h3>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                    {files.length} files
                  </span>
                </div>

                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                    >
                      {/* Preview */}
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                        {previewUrls[index] && (
                          <img
                            src={previewUrls[index]}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs font-medium">
                          {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => moveFile(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFile(index, Math.min(files.length - 1, index + 1))}
                          disabled={index === files.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Generate PDF</h3>
                </div>

                <button
                  type="button"
                  onClick={buildPdf}
                  disabled={!canExport}
                  className={`w-full group relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                    canExport
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner />
                      Creating PDF...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <FileImage className="w-5 h-5" />
                      Create PDF
                    </span>
                  )}
                  {!isProcessing && canExport && (
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            <div className="space-y-6">
              {/* Page Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Page Settings</h3>
                </div>

                <div className="space-y-4">
                  {/* Page Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Page Size
                    </label>
                    <select
                      value={pageSettings.size}
                      onChange={(e) => setPageSettings({...pageSettings, size: e.target.value as PageSize})}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
                    >
                      <option value="auto">Auto (fit to first image)</option>
                      <option value="a4">A4 (210 × 297 mm)</option>
                      <option value="letter">Letter (8.5 × 11 in)</option>
                      <option value="a3">A3 (297 × 420 mm)</option>
                    </select>
                  </div>

                  {/* Orientation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['portrait', 'landscape'] as Orientation[]).map((orientation) => (
                        <button
                          key={orientation}
                          type="button"
                          onClick={() => setPageSettings({...pageSettings, orientation})}
                          className={`p-3 rounded-lg border transition-all ${
                            pageSettings.orientation === orientation
                              ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <ArrowUpDown className={`w-4 h-4 ${orientation === 'landscape' ? 'rotate-90' : ''}`} />
                            {orientation.charAt(0).toUpperCase() + orientation.slice(1)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layout */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image Layout
                    </label>
                    <select
                      value={pageSettings.layout}
                      onChange={(e) => setPageSettings({...pageSettings, layout: e.target.value as Layout})}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
                    >
                      <option value="fit">Fit (maintain aspect ratio)</option>
                      <option value="fill">Fill (may crop)</option>
                      <option value="stretch">Stretch (may distort)</option>
                    </select>
                  </div>

                  {/* Margin */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Margin
                      </label>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        {pageSettings.margin}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={pageSettings.margin}
                      onChange={(e) => setPageSettings({...pageSettings, margin: parseInt(e.target.value)})}
                      className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Filename */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filename
                    </label>
                    <input
                      type="text"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
                      placeholder="images.pdf"
                    />
                  </div>
                </div>
              </div>

              {/* Processing/Results */}
              {isProcessing && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
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

              {pdfUrl && !isProcessing && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                      PDF Created!
                    </h3>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                      Successfully combined {files.length} image{files.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <a
                      className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      href={pdfUrl}
                      download={filename}
                    >
                      <Download className="w-5 h-5" />
                      Download {filename}
                    </a>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl shadow-xl border border-orange-200 dark:border-orange-800 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200">Pro Tips</h3>
                </div>
                <ul className="text-sm text-orange-900/80 dark:text-orange-200/90 space-y-2 list-disc list-inside">
                  <li>Use &quot;Auto&quot; page size to match your first image dimensions</li>
                  <li>Drag images up/down to reorder them in the PDF</li>
                  <li>&quot;Fit&quot; maintains image quality, &quot;Fill&quot; prevents white space</li>
                  <li>Higher quality images work best for professional documents</li>
                </ul>
              </div>

              {/* Error Display */}
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-800 dark:text-red-200 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            🔒 All processing happens locally in your browser - your images never leave your device
          </p>
        </div>
      </div>
    </div>
  );
}
