import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  base: './',
  plugins: [solid()],
  server: {
    host: true,
    port: 5173
  }
})
