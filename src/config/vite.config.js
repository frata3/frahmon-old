import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  root: path.resolve(__dirname, "../../resources/blog"),
  base: "/assets/dist/",
  build: {
    outDir: path.resolve(__dirname, "../../public/dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        create: path.resolve(__dirname, "../../resources/blog/create.js"),
      },
      output: {
        entryFileNames: "create.js",
        assetFileNames: "create.css", 
      },
    },
  },
})