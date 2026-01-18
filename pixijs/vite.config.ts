import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';
import { viteSingleFile } from 'vite-plugin-singlefile';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 3 },
      mozjpeg: { quality: 75 },
      optipng: { optimizationLevel: 5 },
      pngquant: { quality: [0.65, 0.85], speed: 4 },
      webp: { quality: 75 },
    }),
    viteSingleFile(),
    {
      name: 'bundle-size-log',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        const htmlPath = path.join(distDir, 'index.html');
        if (!fs.existsSync(htmlPath)) return;
        const stat = fs.statSync(htmlPath);
        const sizeKb = (stat.size / 1024).toFixed(1);
        const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
        console.log(`[build] dist/index.html size: ${sizeKb} KB (${sizeMb} MB)`);

        const html = fs.readFileSync(htmlPath, 'utf8');
        const dataUriRegex = /data:([^;,\s]+)[^,]*,([A-Za-z0-9+/=]+)/g;
        const byMime = new Map<string, number>();
        const entries: { mime: string; bytes: number }[] = [];
        let match: RegExpExecArray | null;
        while ((match = dataUriRegex.exec(html))) {
          const mime = match[1];
          const b64 = match[2];
          const bytes = Math.floor((b64.length * 3) / 4);
          entries.push({ mime, bytes });
          byMime.set(mime, (byMime.get(mime) ?? 0) + bytes);
        }
        if (entries.length === 0) return;

        console.log('[build] asset breakdown (data URIs):');
        const sortedMimes = [...byMime.entries()].sort((a, b) => b[1] - a[1]);
        for (const [mime, bytes] of sortedMimes) {
          const kb = (bytes / 1024).toFixed(1);
          console.log(`  - ${mime}: ${kb} KB`);
        }

        const top = entries.sort((a, b) => b.bytes - a.bytes).slice(0, 10);
        console.log('[build] top 10 data URIs:');
        top.forEach((item, index) => {
          const kb = (item.bytes / 1024).toFixed(1);
          console.log(`  ${index + 1}. ${item.mime} ${kb} KB`);
        });
      },
    },
  ],
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
