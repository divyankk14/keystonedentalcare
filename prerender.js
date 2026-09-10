/**
 * prerender.js — Post-build script for SEO
 *
 * Launches a headless browser against the built SPA (dist/index.html),
 * waits for React to render, then saves the fully-rendered HTML back.
 * This ensures Google sees real content instead of an empty <div id="root">.
 */

import { launch } from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = resolve(__dirname, 'dist');
const PORT = 4173;

// Simple static file server for the dist folder
function startStaticServer() {
  const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
  };

  const server = createServer((req, res) => {
    let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      const content = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch {
      // Fallback to index.html for SPA routing
      try {
        const content = readFileSync(join(DIST_DIR, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not Found');
      }
    }
  });

  return new Promise((resolvePromise) => {
    server.listen(PORT, () => {
      console.log(`  Static server running on http://localhost:${PORT}`);
      resolvePromise(server);
    });
  });
}

async function prerender() {
  console.log('\n🔍 Prerendering for SEO...\n');

  // 1. Start a local static server
  const server = await startStaticServer();

  // 2. Launch headless browser
  const browser = await launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 3. Navigate to the built site
    await page.goto(`http://localhost:${PORT}/`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // 4. Wait a bit more for any async React rendering
    await new Promise((r) => setTimeout(r, 2000));

    // 5. Get the fully rendered HTML
    const renderedHtml = await page.content();

    // 6. Write it back to dist/index.html
    writeFileSync(resolve(DIST_DIR, 'index.html'), renderedHtml, 'utf-8');

    console.log('  ✅ Prerendered dist/index.html with full content');
    console.log('  📄 Google will now see your services, reviews, and all text content\n');
  } catch (err) {
    console.error('  ❌ Prerendering failed:', err.message);
    console.error('  ℹ️  The build still succeeded — only prerendering was skipped.\n');
  } finally {
    await browser.close();
    server.close();
  }
}

prerender();
