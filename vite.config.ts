import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// MPA: cada pagina es su propia entrada HTML, asi que /faq y /codigo-de-conducta
// no arrastran el JS de la landing (de hecho no arrastran ningun JS).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "src") },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        faq: resolve(import.meta.dirname, "faq/index.html"),
        conducta: resolve(import.meta.dirname, "codigo-de-conducta/index.html"),
      },
    },
  },
})
