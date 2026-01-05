import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/urbanshade-OS/',
  plugins: [react()],
  resolve: {
    alias: {
      // Map `@` to the `src` directory so imports like "@/components/..." work
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
