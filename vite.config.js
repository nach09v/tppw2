import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' permite que funcione en cualquier URL de GitHub Pages sin romperse
export default defineConfig({
  plugins: [react()],
  base: './',
});
