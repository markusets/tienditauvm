import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import 'dotenv/config'

const API_URL = process.env.VITE_PUBLIC_BACKEND_URL;
console.log('API_URL (server)', API_URL);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
