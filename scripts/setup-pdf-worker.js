const fs = require('fs');
const path = require('path');

// Copy PDF.js worker to public directory
const sourcePath = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const destPath = path.join(__dirname, '../public/pdf.worker.min.mjs');

if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, destPath);
  console.log('✅ PDF.js worker copied to public directory');
} else {
  console.error('❌ PDF.js worker not found in node_modules');
  process.exit(1);
}