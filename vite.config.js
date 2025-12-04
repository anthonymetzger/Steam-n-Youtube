import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vitejs.dev
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with '/steam-api'
      '/api': {
        target: 'https://store.steampowered.com',
        changeOrigin: true,
        secure: false,
        // Rewrite the path to remove the prefix when forwarding
        rewrite: (path) => path.replace(/^\/steam-api/, ''),
      },
      // You may need one for Google APIs if they cause issues:
      '/youtube': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/youtube/, ''),
      },
    },
  },
});

