import { defineConfig, normalizePath } from "vite";

export default defineConfig({
    build: {
        emptyOutDir: false,
        outDir: "build",
        rollupOptions: {
            // https://rollupjs.org/configuration-options/
            input: "./content_scripts/main.js",
            output:{
                inlineDynamicImports: true,
                format: "iife",
                extend: true,
                entryFileNames: "content_script.js",
                dir: "build",
            }
        },
      },
});
