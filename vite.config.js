import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import inject from "@rollup/plugin-inject";

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: './manifest.json',
                    dest: '.',
                },
                {
                    src: './icons',
                    dest: '.',
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
                "./popup/RegexSearch.html",
                "./options/options.html",
            ],
            output:{
                format: "es",
                dir: "build",
                entryFileNames: "[name].js",
            }
        },
      },
});
