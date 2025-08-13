'use strict';

self.onmessage = async (event) => {
  const { file, previewUrl, quality, maxWidth, maxHeight, format } = event.data;

  try {
    // The OffscreenCanvas is not available in all browsers, and the logic to load the image
    // is also tricky in a worker. A simpler approach for now is to send the image data.
    // However, for a truly off-thread experience, we'd use OffscreenCanvas and fetch.
    // Let's simulate the processing part for now.

    // Fetch the image data
    const response = await fetch(previewUrl);
    const imageBlob = await response.blob();
    const imageBitmap = await createImageBitmap(imageBlob);

    // Calculate target dimensions
    let targetWidth = imageBitmap.width;
    let targetHeight = imageBitmap.height;

    const parseNumber = (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const num = typeof val === 'number' ? val : Number(val);
      return isNaN(num) || num <= 0 ? null : Math.floor(num);
    };

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

    // Use OffscreenCanvas for rendering
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available in worker');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

    // Determine output format
    let outputMime = file.type;
    let outputFormat = file.type.split('/')[1];

    switch (format) {
      case 'webp': outputMime = 'image/webp'; outputFormat = 'webp'; break;
      case 'jpeg': outputMime = 'image/jpeg'; outputFormat = 'jpeg'; break;
      case 'png': outputMime = 'image/png'; outputFormat = 'png'; break;
      case 'auto':
        if (file.type.includes('png')) {
            outputMime = 'image/webp';
            outputFormat = 'webp';
        } else {
            outputMime = 'image/jpeg';
            outputFormat = 'jpeg';
        }
        break;
    }

    const qualityValue = outputMime === 'image/png' ? undefined : quality;
    const blob = await canvas.convertToBlob({ type: outputMime, quality: qualityValue });

    if (!blob) throw new Error('Failed to generate compressed image');

    const sizeKB = Math.round(blob.size / 1024);

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
    self.postMessage({
      status: 'error',
      payload: err instanceof Error ? err.message : 'An unexpected error occurred in worker',
    });
  }
};
