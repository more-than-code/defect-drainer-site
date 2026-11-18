import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Ports 8898-8899 are this slice's (never the shared 8788/5174).
export default defineConfig({
  plugins: [sveltekit()],
  server: { host: '127.0.0.1', port: 8898, strictPort: true },
  preview: { host: '127.0.0.1', port: 8898, strictPort: true },
});
