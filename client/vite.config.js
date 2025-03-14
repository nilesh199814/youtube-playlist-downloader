import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Explicitly set to a safe port
    strictPort: true, // Fail if port is in use
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Updated to match server port
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
      },
    },
  },
});