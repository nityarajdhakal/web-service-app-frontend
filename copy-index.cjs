// Cross-platform CommonJS script to copy index.html to 200.html for Render SPA fallback
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');
const fallbackPath = path.join(distDir, '200.html');

try {
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, fallbackPath);
    console.log('✓ Successfully copied dist/index.html → dist/200.html');
  } else {
    console.warn('⚠ Warning: dist/index.html not found. Skipping 200.html copy.');
  }
} catch (err) {
  console.error('✗ Error copying 200.html:', err);
  process.exit(1);
}
