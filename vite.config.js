export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:4000',
        changeOrigin: true,
      }
    }
  },
  preview: {           // ← ADD THIS SECTION
    proxy: {
      '/api': {
        target: 'http://backend:4000',  // Docker service name
        changeOrigin: true,
      }
    }
  }
})

