import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import seasonalTheme from './seasonal-theme.js'

export default defineConfig({
  plugins: [seasonalTheme(), react()]
})
