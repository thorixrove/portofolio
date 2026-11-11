import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/three/') || id.includes('three-stdlib') || id.includes('@react-three')) return 'vendor-three';
          if (id.includes('gsap')) return 'vendor-gsap';
        },
      },
    },
  },
});