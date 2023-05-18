import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from "node:path";
import inject from "@rollup/plugin-inject";

export default defineConfig({
    root: "./src",
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(path.resolve(__dirname, './src/manifest.json')),
                    dest: normalizePath(path.resolve(__dirname, './build')),
                },
                {
                    src: normalizePath(path.resolve(__dirname, './src/icons')),
                    dest: normalizePath(path.resolve(__dirname, './build')),
                },
            ]
        }),
        inject({
            $: 'jquery',
            jQuery: 'jquery',
        }),
    ],
    build: {
        outDir: "build",
        rollupOptions: {
              // https://rollupjs.org/configuration-options/
            input: [
                "./src/popup/RegexSearch.html",
                "./src/options/options.html",
            ],
            output:{
                format: "es",
                dir: "build",
                entryFileNames: "[name].js",
            }
        },
      },
});
