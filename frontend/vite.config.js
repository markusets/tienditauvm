import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import 'dotenv/config'

const API_URL = process.env.VITE_BACKEND_URL;
console.log('API_URL', API_URL);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true, 
        secure: false, 
      },
      '/uploads': {
        target: API_URL,
        changeOrigin: true, 
        secure: false,
      },
    },
  },
});


