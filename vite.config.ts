import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  console.log('--- VITE ENV DEBUG ---');
  console.log('GEMINI_API_KEY present:', !!env.GEMINI_API_KEY);
  console.log('API_KEY present:', !!env.API_KEY);
  console.log('VITE_GEMINI_API_KEY present:', !!env.VITE_GEMINI_API_KEY);
  console.log('----------------------');
  return {
    base: '/Steam_Forge_V01/', // Absolute base path for GitHub Pages
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3005',
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: 'http://localhost:3005',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
