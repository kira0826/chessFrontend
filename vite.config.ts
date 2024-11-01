import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true, 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Asegúrate de que 'src' está en el mismo nivel que tu archivo de configuración
    },
  },
});
