import { resolve } from "node:path";
import { defineConfig } from "vite";
import noscriptCards from "./plugins/noscript-cards.js";

const page = (path) => resolve(import.meta.dirname, path);

// Every HTML page must be listed here, or it is missing from the production build.
export default defineConfig({
    plugins: [noscriptCards()],
    build: {
        rollupOptions: {
            input: {
                main: page("index.html"),
                blog: page("blog/index.html"),
                experiments: page("experiments/index.html"),
                fluiddynamics: page("experiments/fluiddynamics/index.html"),
            },
        },
    },
});
