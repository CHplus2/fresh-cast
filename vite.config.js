import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// /api stays same-origin in the browser, preserving Django sessions and CSRF.
// The upstream is server configuration, never an authentication credential.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'FRESHCAST_');
  const target = env.FRESHCAST_API_TARGET || 'http://127.0.0.1:8001';
  const url = new URL(target);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('FRESHCAST_API_TARGET must be an HTTP(S) URL without credentials.');
  }
  if (url.protocol === 'http:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    throw new Error('Use HTTPS for an API outside your local computer.');
  }
  const proxy = { '/api': { target: url.origin, changeOrigin: true } };
  return {
    plugins: [react()],
    server: { host: '127.0.0.1', port: 5174, strictPort: true, proxy },
    preview: { host: '127.0.0.1', port: 5174, strictPort: true, proxy },
  };
});
