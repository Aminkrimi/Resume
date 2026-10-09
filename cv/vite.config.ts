import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  // The résumé reads the portfolio's data from ../src.
  server: { fs: { allow: ['..'] } },
});
