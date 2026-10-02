import { resolve } from "node:path";
import { defineConfig } from "vite";

const page = (path) => resolve(import.meta.dirname, path);

// Every HTML page must be listed here, or it is missing from the production build.
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: page("index.html"),
                experiments: page("experiments/index.html"),
                fluiddynamics: page("experiments/fluiddynamics/index.html"),
            },
        },
    },
});
