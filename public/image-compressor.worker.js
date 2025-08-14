'use strict';

// Enhanced image compression worker with better browser compatibility
self.onmessage = async (event) => {
  const { imageData, quality, maxWidth, maxHeight, format, originalType } = event.data;

  try {
    // Parse dimensions constraints
    const parseNumber = (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const num = typeof val === 'number' ? val : Number(val);
      return isNaN(num) || num <= 0 ? null : Math.floor(num);
    };

    // Create image from data URL - handle worker context
    let img;
    
    // Try different approaches for image creation in worker context
    if (typeof Image !== 'undefined') {
      img = new Image();
    } else if (typeof self.Image !== 'undefined') {
      img = new self.Image();
    } else {
      // Fallback: use createImageBitmap if available
      try {
        const response = await fetch(imageData);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        
        // Process with ImageBitmap
        const targetWidth = imageBitmap.width;
        const targetHeight = imageBitmap.height;
        
        // Apply dimension constraints (same logic as before)
        let finalWidth = targetWidth;
        let finalHeight = targetHeight;
        
        const maxW = parseNumber(maxWidth);
        const maxH = parseNumber(maxHeight);

        if (maxW && finalWidth > maxW) {
          const scale = maxW / finalWidth;
          finalWidth = Math.floor(finalWidth * scale);
          finalHeight = Math.floor(finalHeight * scale);
        }

        if (maxH && finalHeight > maxH) {
          const scale = maxH / finalHeight;
          finalWidth = Math.floor(finalWidth * scale);
          finalHeight = Math.floor(finalHeight * scale);
        }
        
        finalWidth = Math.max(1, finalWidth);
        finalHeight = Math.max(1, finalHeight);

        // Use OffscreenCanvas with ImageBitmap
        const canvas = new OffscreenCanvas(finalWidth, finalHeight);
        const ctx = canvas.getContext('2d');
        
        if (!ctx) throw new Error('Canvas 2D context not available');
        
        ctx.imageSmoothingEnabled = true;
        if (ctx.imageSmoothingQuality) {
          ctx.imageSmoothingQuality = 'high';
        }
        
        ctx.drawImage(imageBitmap, 0, 0, finalWidth, finalHeight);
        
        // Determine output format (same logic as main path)
        let outputMime = originalType;
        let outputFormat = originalType.split('/')[1];

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
            if (originalType.includes('png') && quality < 0.9) {
              outputMime = 'image/webp';
              outputFormat = 'webp';
            } else if (originalType.includes('png')) {
              outputMime = 'image/png';
              outputFormat = 'png';
            } else {
              outputMime = 'image/jpeg';
              outputFormat = 'jpeg';
            }
            break;
        }

        const qualityValue = outputMime === 'image/png' ? undefined : quality;
        const blob = await canvas.convertToBlob({ 
          type: outputMime, 
          quality: qualityValue 
        });

        const sizeKB = Math.round(blob.size / 1024);

        self.postMessage({
          status: 'success',
          payload: {
            blob,
            sizeKB,
            format: outputFormat,
            dimensions: { width: finalWidth, height: finalHeight },
          },
        });
        
        return; // Exit early on success
        
      } catch (e) {
        throw new Error('Image processing not supported in this browser context');
      }
    }
    
    // Standard Image approach
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('Failed to load image data'));
      img.src = imageData;
    });

    // Calculate target dimensions
    let targetWidth = img.naturalWidth;
    let targetHeight = img.naturalHeight;

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

    // Create canvas for processing
    let canvas, ctx;
    
    // Try OffscreenCanvas first (better performance)
    if (typeof OffscreenCanvas !== 'undefined') {
      try {
        canvas = new OffscreenCanvas(targetWidth, targetHeight);
        ctx = canvas.getContext('2d');
      } catch (e) {
        // Fallback if OffscreenCanvas fails
        canvas = null;
      }
    }
    
    // Fallback to regular canvas if OffscreenCanvas not available
    if (!canvas) {
      canvas = new (self.HTMLCanvasElement || Object)();
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx = canvas.getContext('2d');
    }

    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }

    // Configure high-quality rendering
    ctx.imageSmoothingEnabled = true;
    if (ctx.imageSmoothingQuality) {
      ctx.imageSmoothingQuality = 'high';
    }

    // Clear canvas and draw resized image
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Determine output format
    let outputMime = originalType;
    let outputFormat = originalType.split('/')[1];

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
        // Smart format selection
        if (originalType.includes('png') && quality < 0.9) {
          // Convert PNG to WebP for better compression
          outputMime = 'image/webp';
          outputFormat = 'webp';
        } else if (originalType.includes('png')) {
          // Keep PNG for high quality
          outputMime = 'image/png';
          outputFormat = 'png';
        } else {
          // Use JPEG for photos
          outputMime = 'image/jpeg';
          outputFormat = 'jpeg';
        }
        break;
    }

    // Generate compressed image
    let blob;
    const qualityValue = outputMime === 'image/png' ? undefined : quality;

    if (canvas.convertToBlob) {
      // OffscreenCanvas method
      blob = await canvas.convertToBlob({ 
        type: outputMime, 
        quality: qualityValue 
      });
    } else {
      // Fallback for regular canvas
      const dataUrl = canvas.toDataURL(outputMime, qualityValue);
      const response = await fetch(dataUrl);
      blob = await response.blob();
    }

    if (!blob) {
      throw new Error('Failed to generate compressed image');
    }

    const sizeKB = Math.round(blob.size / 1024);

    // Send success response
    self.postMessage({
      status: 'success',
      payload: {
        blob,
        sizeKB,
        format: outputFormat,
        dimensions: { width: targetWidth, height: targetHeight },
      },
    });

  } catch (err) {
    console.error('Worker error:', err);
    self.postMessage({
      status: 'error',
      payload: err instanceof Error ? err.message : 'An unexpected error occurred in worker',
    });
  }
};
