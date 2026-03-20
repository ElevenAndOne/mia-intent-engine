import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const popupFriendlyHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    origin: 'http://localhost:5173',
    headers: popupFriendlyHeaders,
  },
  preview: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    headers: popupFriendlyHeaders,
  },
});
