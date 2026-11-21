import { fileURLToPath } from 'node:url';
import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {},
  preload: {
    build: {
      rollupOptions: {
        output: { format: 'cjs', entryFileNames: 'index.cjs' }
      }
    }
  },
  renderer: {
    envDir: fileURLToPath(new URL('..', import.meta.url)),
    server: { host: '127.0.0.1', port: 5173, strictPort: true },
    plugins: [
      react(),
      {
        name: 'csp-local-development',
        transformIndexHtml(html, context) {
          // React Refresh e o WebSocket são permitidos somente no servidor local de dev.
          if (!context.server) return html;
          return html
            .replace("script-src 'self'", "script-src 'self' 'unsafe-inline'")
            .replace("connect-src 'self'", "connect-src 'self' ws://127.0.0.1:5173");
        }
      }
    ]
  }
});
