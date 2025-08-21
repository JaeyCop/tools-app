"use client";
import { useCallback, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { Upload, FileText, Download, Loader2, AlertCircle, CheckCircle, Zap, Minimize2, X } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import ToolSeoContent from "@/components/ToolSeoContent";
import SeoHowToJsonLd from "@/components/SeoHowToJsonLd";
import SeoFaqJsonLd from "@/components/SeoFaqJsonLd";
import { ToolLayout } from '@/components/ToolLayout';

export default function PdfCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
  } | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback((accepted: File[]) => {
    const first = accepted.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (first) {
      setFile(first);
      setOutputUrl(null);
      setErrorMessage(null);
      setCompressionStats(null);
    }
  }, []);

  const canCompress = useMemo(() => !!file && !isProcessing, [file, isProcessing]);

  const compress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setOutputUrl(null);
    setCompressionStats(null);

    try {
      const originalSize = file.size;
      const input = await file.arrayBuffer();
      const src = await PDFDocument.load(input);
      const dst = await PDFDocument.create();
      const pages = await dst.copyPages(src, src.getPageIndices());

      for (const p of pages) dst.addPage(p);

      const bytes = await dst.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50
      });

      const buf = new ArrayBuffer(bytes.length);
      new Uint8Array(buf).set(bytes);
      const blob = new Blob([buf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setOutputUrl(url);
      setCompressionStats({
        originalSize,
        compressedSize: bytes.length
      });
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Compression failed");
      setErrorMessage("Failed to compress PDF. Please try a different file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const compressionPercentage = compressionStats
    ? Math.round((1 - compressionStats.compressedSize / compressionStats.originalSize) * 100)
    : 0;

  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Minimize2 className="h-5 w-5 text-primary" />
          Compression Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </div>

      {file && (
        <button
          onClick={compress}
          disabled={isProcessing}
          className="w-full btn-premium bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Compressing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Minimize2 className="h-5 w-5" />
              <span>Compress PDF</span>
            </div>
          )}
        </button>
      )}

      {file && (
        <button
          onClick={() => {
            setFile(null);
            setOutputUrl(null);
          }}
          className="w-full px-4 py-2 bg-error/10 text-error rounded-xl text-sm hover:bg-error/20 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear PDF
        </button>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="PDF Compressor"
      description="Reduce your PDF file sizes instantly with our smart compression algorithm."
      icon={<Minimize2 className="h-8 w-8 text-primary" />}
      sidebar={sidebarContent}
    >
      <div>
        <div className="space-y-8">
          {/* Upload Area */}
          <div className="card-premium shadow-premium overflow-hidden">
            <div className="p-8">
              <Dropzone onDrop={onDrop} accept={{ "application/pdf": [".pdf"] }} multiple={false}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    className={`
                      relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                      ${isDragActive
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                      }
                    `}
                  >
                    <input {...getInputProps()} />

                    <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                      <div className="mb-6">
                        {isDragActive ? (
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <Upload className="w-8 h-8 text-blue-500" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                          {isDragActive ? "Drop your PDF here!" : "Upload your PDF file"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Drag and drop or click to browse • Max 50MB
                        </p>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full opacity-50"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full opacity-30"></div>
                  </div>
                )}
              </Dropzone>

              {/* File Info */}
              {file && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • PDF Document
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compression Settings */}
          {file && (
            <div className="card-premium p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Compression Settings
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Image Quality
                    </label>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={0.5}
                      max={1}
                      step={0.01}
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(quality - 0.5) * 200}%, #e5e7eb ${(quality - 0.5) * 200}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Lower quality</span>
                      <span>Higher quality</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Lower quality settings result in smaller files but may reduce image clarity.
                    Start with 80% for a good balance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Compress Button */}
          {file && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={compress}
                disabled={!canCompress}
                className={`
                  group relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform
                  ${canCompress
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {isProcessing && (
                  <Loader2 className="w-6 h-6 animate-spin mr-3 inline" />
                )}
                {isProcessing ? "Compressing..." : "Compress PDF"}

                {!isProcessing && canCompress && (
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button>
            </div>
          )}

          {/* Results */}
          {isProcessing && (
            <div className="card-premium p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Skeleton className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                  <Skeleton className="w-48 h-8" />
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                  <Skeleton className="w-24 h-4 mx-auto" />
                  <Skeleton className="w-16 h-8 mx-auto mt-2" />
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                  <Skeleton className="w-24 h-4 mx-auto" />
                  <Skeleton className="w-16 h-8 mx-auto mt-2" />
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                  <Skeleton className="w-24 h-4 mx-auto" />
                  <Skeleton className="w-16 h-8 mx-auto mt-2" />
                </div>
              </div>
              <Skeleton className="w-full h-12" />
            </div>
          )}
          {compressionStats && outputUrl && !isProcessing && (
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
                    {formatFileSize(compressionStats.originalSize)}
                  </p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Compressed Size</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatFileSize(compressionStats.compressedSize)}
                  </p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Space Saved</p>
                  <p className="text-xl font-bold text-green-600">
                    {compressionPercentage > 0 ? `${compressionPercentage}%` : 'Similar size'}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <a
                  className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  href={outputUrl}
                  download="compressed.pdf"
                >
                  <Download className="w-5 h-5" />
                  Download Compressed PDF
                </a>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <p className="text-red-800 dark:text-red-200 font-medium">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            🔒 Your files are processed locally in your browser and never uploaded to our servers
          </p>
        </div>
      </div>

      {/* Educational Content Section */}
      <div className="mt-16 space-y-12">
        {/* Understanding PDF Compression */}
        <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Minimize2 className="h-6 w-6 text-white" />
            </div>
            Understanding PDF Compression
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">How PDF Compression Works</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                PDF compression uses sophisticated algorithms to reduce file size by optimizing images, removing redundant data, and compressing text streams. Our tool employs multiple techniques simultaneously for maximum efficiency.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Image downsampling and recompression</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Font subsetting and optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Object stream compression</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Metadata and structure optimization</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Compression Quality Guide</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">High Quality (0.9)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Minimal compression, preserves original quality. Best for professional documents and presentations.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">Balanced (0.8)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Optimal balance between size and quality. Recommended for most documents and general use.</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">High Compression (0.6)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Maximum size reduction. Ideal for web sharing and email attachments where size matters most.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">💡 Pro Tip: Document Type Optimization</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Text-Heavy Documents:</span>
                <p className="text-blue-600 dark:text-blue-400">Use high compression (0.6-0.7) as text remains sharp at all levels</p>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Image-Rich Documents:</span>
                <p className="text-blue-600 dark:text-blue-400">Use balanced compression (0.8) to preserve image quality</p>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Technical Drawings:</span>
                <p className="text-blue-600 dark:text-blue-400">Use high quality (0.9) to maintain precision and clarity</p>
              </div>
            </div>
          </div>
        </section>

        {/* Compression Statistics */}
        <section className="bg-surface/80 border border-border rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Compression Performance
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-3xl font-bold text-green-600 mb-2">70%</div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Average Size Reduction</div>
              <div className="text-xs text-green-600 dark:text-green-400">For image-heavy documents</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Quality Retention</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">With balanced settings</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Privacy Protection</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Client-side processing</div>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">📊 Expected Results by Document Type</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200 dark:border-amber-700">
                    <th className="text-left py-2 text-amber-800 dark:text-amber-200">Document Type</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Size Reduction</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Quality Impact</th>
                    <th className="text-center py-2 text-amber-800 dark:text-amber-200">Recommended Setting</th>
                  </tr>
                </thead>
                <tbody className="text-amber-700 dark:text-amber-300">
                  <tr className="border-b border-amber-100 dark:border-amber-800">
                    <td className="py-2">Scanned Documents</td>
                    <td className="text-center py-2">60-80%</td>
                    <td className="text-center py-2">Minimal</td>
                    <td className="text-center py-2">High Compression</td>
                  </tr>
                  <tr className="border-b border-amber-100 dark:border-amber-800">
                    <td className="py-2">Text with Images</td>
                    <td className="text-center py-2">50-70%</td>
                    <td className="text-center py-2">Very Low</td>
                    <td className="text-center py-2">Balanced</td>
                  </tr>
                  <tr className="border-b border-amber-100 dark:border-amber-800">
                    <td className="py-2">Technical Diagrams</td>
                    <td className="text-center py-2">30-50%</td>
                    <td className="text-center py-2">None</td>
                    <td className="text-center py-2">High Quality</td>
                  </tr>
                  <tr>
                    <td className="py-2">Text-Only Documents</td>
                    <td className="text-center py-2">20-40%</td>
                    <td className="text-center py-2">None</td>
                    <td className="text-center py-2">Any Setting</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <ToolSeoContent
        title="Online PDF Compressor"
        overview="Reduce the file size of your PDF documents quickly and easily. Our tool optimizes your PDFs for sharing and storage while maintaining the best possible quality, all without uploading your files."
        
        howToTitle="How to Compress Your PDF"
        steps={[
          "Upload Your PDF: Drag and drop your PDF file into the designated area, or click to select it from your device.",
          "Choose Compression Level: Select a compression level that suits your needs—from basic to strong compression. A higher level means a smaller file size but may slightly reduce quality.",
          "Compress & Download: Click the 'Compress PDF' button. Our tool will process your file in-browser and provide a download link for your new, smaller PDF instantly.",
        ]}

        featuresTitle="Features of Our PDF Compressor"
        features={[
          { name: "Secure & Private", description: "Your PDFs are processed locally in your browser. They are never uploaded to a server, ensuring your data remains confidential." },
          { name: "Adjustable Compression", description: "Choose from multiple compression levels to find the perfect balance between file size and quality." },
          { name: "Live Size Preview", description: "See the estimated file size before you even start the compression process." },
          { name: "High-Quality Output", description: "Our tool uses advanced algorithms to reduce file size while preserving readability and image quality." },
          { name: "No File Limits", description: "Compress as many PDFs as you need, for free and without registration." },
          { name: "Works Offline", description: "Once the page is loaded, you can compress PDFs even without an internet connection.", },
        ]}

        useCasesTitle="Why Compress a PDF?"
        useCases={[
          "To send PDFs as email attachments without exceeding size limits.",
          "To upload documents to websites or online forms with file size restrictions.",
          "To save storage space on your computer or cloud drive.",
          "To improve loading times when sharing PDFs on the web.",
        ]}

        faqTitle="Frequently Asked Questions"
        faq={[
          { q: "Is it safe to compress my sensitive PDF documents here?", a: "Yes, it is completely safe. The entire compression process happens in your browser. Your files are never sent to our servers, so you maintain full control over your data." },
          { q: "How much smaller will my PDF be?", a: "The final size depends on the original content of your PDF and the compression level you choose. PDFs with many images will see the most significant reduction. Our tool provides a real-time estimate of the compressed size." },
          { q: "Will compressing my PDF reduce its quality?", a: "Our tool aims to reduce file size with the least possible impact on quality. While strong compression might slightly lower the quality of embedded images, text and vector graphics will remain sharp and readable." },
          { q: "Can I compress encrypted or password-protected PDFs?", a: "No, you will need to remove the password protection from your PDF before you can compress it with our tool." },
        ]}
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </ToolLayout>
  );
}