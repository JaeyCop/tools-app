#!/usr/bin/env node

/**
 * Favicon Generation Script for JaeyGuides
 * 
 * This script generates PNG favicon files from the SVG source.
 * You'll need to install sharp: npm install sharp
 * 
 * Usage: node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('⚠️  Sharp not found. Install it with: npm install sharp');
  console.log('📝 For now, you can manually convert the SVG files to PNG using:');
  console.log('   - Online tools like favicon.io');
  console.log('   - Browser: Open SVG and save as PNG');
  console.log('   - Image editing software');
  process.exit(1);
}

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

async function generateFavicons() {
  const svgPath = path.join(__dirname, '../public/favicon.svg');
  const outputDir = path.join(__dirname, '../public');

  if (!fs.existsSync(svgPath)) {
    console.error('❌ favicon.svg not found in public directory');
    process.exit(1);
  }

  console.log('🎨 Generating favicon files...');

  for (const { name, size } of sizes) {
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, name));
      
      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${name}:`, error.message);
    }
  }

  console.log('\n🎉 Favicon generation complete!');
  console.log('📁 Files created in /public directory');
}

generateFavicons().catch(console.error);