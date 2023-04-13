import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3001,
    hmr: {
      host: 'localhost',
      port: 24678,
    }
  },
  plugins: [react()]
});
