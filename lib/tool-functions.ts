'use client';

// This file will contain the core logic for each processing tool,
// refactored into reusable functions that can be called from anywhere,
// including the new workflow engine.

// Consolidated Imports
import { PDFDocument, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
// pdfjs-dist is now dynamically imported within pdfToImages function

// --- Image Compression ---
export interface CompressionOptions {
  quality: number;
  maxWidth: string | number;
  maxHeight: string | number;
  format: 'auto' | 'webp' | 'jpeg' | 'png';
}

/**
 * Compresses an image using the web worker.
 * @param file The image file to compress.
 * @param options The compression options.
 * @returns A promise that resolves with the compressed blob.
 */
export function compressImage(file: File, options: CompressionOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/image-compressor.worker.js');

    worker.onmessage = (event) => {
      const { status, payload } = event.data;
      if (status === 'success') {
        resolve(payload.blob);
      } else {
        reject(new Error(payload));
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      reject(new Error(`Worker error: ${err.message}`));
      worker.terminate();
    };

    const previewUrl = URL.createObjectURL(file);

    worker.postMessage({
      file,
      previewUrl,
      ...options,
    });
    
    });
}

// --- Image Resizing ---
export interface ResizeOptions {
  width: number;
  height: number;
  keepAspect: boolean;
  quality: number;
  format: string; // e.g., 'image/jpeg', 'image/png', 'image/webp'
}

/**
 * Resizes an image.
 * @param file The image file to resize.
 * @param options The resize options.
 * @returns A promise that resolves with the resized blob.
 */
export function resizeImage(file: File, options: ResizeOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas 2D context not available'));
      }

      let targetWidth = options.width;
      let targetHeight = options.height;

      if (options.keepAspect) {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        if (targetWidth && !targetHeight) {
          targetHeight = targetWidth / aspectRatio;
        } else if (targetHeight && !targetWidth) {
          targetWidth = targetHeight * aspectRatio;
        } else if (targetWidth && targetHeight) {
          const scale = Math.min(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
          targetWidth = img.naturalWidth * scale;
          targetHeight = img.naturalHeight * scale;
        } else {
          targetWidth = img.naturalWidth;
          targetHeight = img.naturalHeight;
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const outputFormat = options.format === "original" ? file.type : options.format;
      const mime = outputFormat || "image/png";

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate resized image blob'));
        }
      }, mime, options.quality);
    };

    img.onerror = () => reject(new Error('Failed to load image for resizing'));
    img.src = URL.createObjectURL(file);
  });
}

// --- Image Conversion ---
export interface ConvertOptions {
  format: 'image/png' | 'image/jpeg' | 'image/webp';
  quality: number;
}

/**
 * Converts an image to a specified format.
 * @param file The image file to convert.
 * @param options The conversion options.
 * @returns A promise that resolves with the converted blob.
 */
export function convertImage(file: File, options: ConvertOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas 2D context not available'));
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate converted image blob'));
        }
      }, options.format, options.quality);
    };

    img.onerror = () => reject(new Error('Failed to load image for conversion'));
    img.src = URL.createObjectURL(file);
  });
}

// --- PDF Compression ---
export interface PdfCompressionOptions {
  quality?: number; // Placeholder for future use if pdf-lib exposes more direct quality control
}

/**
 * Compresses a PDF file.
 * @param file The PDF file to compress.
 * @param options The compression options (currently quality is a placeholder).
 * @returns A promise that resolves with the compressed PDF blob.
 */
export function compressPdf(file: File, options: PdfCompressionOptions): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
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

      // Ensure proper ArrayBuffer for Blob constructor
      const buffer = (bytes as Uint8Array).buffer.slice(
        (bytes as Uint8Array).byteOffset,
        (bytes as Uint8Array).byteOffset + (bytes as Uint8Array).byteLength
      ) as ArrayBuffer;
      const blob = new Blob([buffer], { type: "application/pdf" });
      resolve(blob);
    } catch (error) {
      reject(new Error(`Failed to compress PDF: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}

// --- PDF Splitting ---
export interface PdfSplitOptions {
  selectedPages: number[]; // 0-indexed page numbers to extract
}

/**
 * Splits a PDF file into selected pages and returns them as a ZIP file.
 * @param file The PDF file to split.
 * @param options The split options.
 * @returns A promise that resolves with a Blob containing the ZIP file of split PDFs.
 */
export function splitPdf(file: File, options: PdfSplitOptions): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const zip = new JSZip();
      const srcBytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(srcBytes);

      const indices = options.selectedPages.sort((a, b) => a - b);

      for (const idx of indices) {
        if (idx < 0 || idx >= srcPdf.getPageCount()) {
          console.warn(`Page index ${idx + 1} is out of bounds. Skipping.`);
          continue;
        }
        const outDoc = await PDFDocument.create();
        const [copied] = await outDoc.copyPages(srcPdf, [idx]);
        outDoc.addPage(copied);
        const bytes = await outDoc.save();
        const buffer = (bytes as Uint8Array).buffer.slice(
          (bytes as Uint8Array).byteOffset,
          (bytes as Uint8Array).byteOffset + (bytes as Uint8Array).byteLength
        ) as ArrayBuffer;
        const blob = new Blob([buffer], { type: "application/pdf" });
        zip.file(`page-${idx + 1}.pdf`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      resolve(zipBlob);
    } catch (error) {
      reject(new Error(`Failed to split PDF: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}

// --- PDF Merging ---
export interface PdfMergeOptions {
  filesToMerge: File[]; // Array of files to merge
  mode: "append" | "interleave";
  optimize: boolean;
  pageLabels: boolean;
}

/**
 * Merges multiple PDF files into one.
 * @param filesToMerge An array of PDF files to merge.
 * @param options The merge options.
 * @returns A promise that resolves with the merged PDF blob.
 */
export function mergePdfs(filesToMerge: File[], options: PdfMergeOptions): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      if (filesToMerge.length < 2) {
        return reject(new Error("Please provide at least two PDF files to merge."));
      }

      const mergedPdf = await PDFDocument.create();
      let labelFont = options.pageLabels ? await mergedPdf.embedFont(StandardFonts.Helvetica) : null;

      const loadedPdfs = await Promise.all(filesToMerge.map(f => f.arrayBuffer().then(ab => PDFDocument.load(ab))));

      if (options.mode === "append") {
        for (let i = 0; i < loadedPdfs.length; i++) {
          const pdf = loadedPdfs[i];
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          for (const page of copiedPages) {
            mergedPdf.addPage(page);
            if (options.pageLabels && labelFont) {
              const p = mergedPdf.getPage(mergedPdf.getPageCount() - 1);
              p.drawText(filesToMerge[i].name, { x: 12, y: 12, size: 10, font: labelFont });
            }
          }
        }
      } else { // interleave mode
        const maxPages = Math.max(...loadedPdfs.map(p => p.getPageCount()));
        for (let i = 0; i < maxPages; i++) {
          for (let idx = 0; idx < loadedPdfs.length; idx++) {
            const src = loadedPdfs[idx];
            if (i >= src.getPageCount()) continue;
            const [copied] = await mergedPdf.copyPages(src, [i]);
            mergedPdf.addPage(copied);
            if (options.pageLabels && labelFont) {
              const p = mergedPdf.getPage(mergedPdf.getPageCount() - 1);
              p.drawText(filesToMerge[idx].name, { x: 12, y: 12, size: 10, font: labelFont });
            }
          }
        }
      }

      const bytes = await mergedPdf.save({ useObjectStreams: options.optimize, addDefaultPage: false });
      // Convert Uint8Array to a concrete ArrayBuffer to satisfy DOM Blob types
      const buffer = (bytes as Uint8Array).buffer.slice(
        (bytes as Uint8Array).byteOffset,
        (bytes as Uint8Array).byteOffset + (bytes as Uint8Array).byteLength
      ) as ArrayBuffer;
      const blob = new Blob([buffer], { type: "application/pdf" });
      resolve(blob);
    } catch (error) {
      reject(new Error(`Failed to merge PDFs: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}

// --- PDF to Images ---
export interface PdfToImagesOptions {
  scale: number;
  outputFormat: 'image/png' | 'image/jpeg';
  jpegQuality: number;
  includeRange: string;
  zipName: string;
}

/**
 * Converts PDF pages to images (PNG or JPEG) and returns them as a ZIP file.
 * @param file The PDF file to convert.
 * @param options The conversion options.
 * @returns A promise that resolves with a Blob containing the ZIP file of images.
 */
export function pdfToImages(file: File, options: PdfToImagesOptions): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");

      if (typeof window !== 'undefined' && !GlobalWorkerOptions.workerSrc) {
        GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }

      const data = await file.arrayBuffer();
      const pdf = await getDocument({ data }).promise;

      const parseRange = (text: string, max: number): number[] => {
        if (!text.trim()) return Array.from({ length: max }, (_, i) => i + 1);
        const parts = text.split(/[,\s]+/).filter(Boolean);
        const result = new Set<number>();
        for (const part of parts) {
          const m = part.match(/^(\d+)(?:-(\d+))?$/);
          if (!m) continue;
          const start = Math.max(1, Math.min(max, parseInt(m[1], 10)));
          const end = m[2] ? Math.max(1, Math.min(max, parseInt(m[2], 10))) : start;
          const [lo, hi] = start <= end ? [start, end] : [end, start];
          for (let p = lo; p <= hi; p++) result.add(p);
        }
        return Array.from(result).sort((a, b) => a - b);
      };

      const pagesToProcess = parseRange(options.includeRange, pdf.numPages);

      const zip = new JSZip();

      for (let i = 0; i < pagesToProcess.length; i++) {
        const pageNum = pagesToProcess[i];
        if (pageNum < 1 || pageNum > pdf.numPages) {
          console.warn(`Page number ${pageNum} is out of bounds. Skipping.`);
          continue;
        }
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: Math.max(1, Math.min(4, options.scale)) });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unsupported");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;

        const mime: 'image/png' | 'image/jpeg' = options.outputFormat;
        const quality = mime === "image/jpeg" ? options.jpegQuality : 0.92;

        const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b as Blob), mime, quality));

        const ext = mime === "image/jpeg" ? "jpg" : "png";
        zip.file(`page-${pageNum}.${ext}`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      resolve(zipBlob);
    } catch (error) {
      reject(new Error(`Failed to convert PDF to images: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}
