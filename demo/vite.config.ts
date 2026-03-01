import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const localSrc = path.resolve(__dirname, '../src/index.ts')
const localCss = path.resolve(__dirname, '../src/components/GoeySearch.css')
const useLocalSource = fs.existsSync(localSrc)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ...(useLocalSource
        ? {
            'goey-search/styles.css': localCss,
            'goey-search': localSrc,
          }
        : {}),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'framer-motion': path.resolve(__dirname, 'node_modules/framer-motion'),
    },
  },
})
