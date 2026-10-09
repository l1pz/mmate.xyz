import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { pages } from "../src/core/site";

/** `/blog/` -> `blog/index.html`, `/` -> `index.html`. */
const htmlFor = (path: string) => `${path.replace(/^\//, "")}index.html`;

// The site map and the build must agree, so a new page cannot skip the shell (DESIGN.md 8.5).
describe("site map and vite.config.js", () => {
    let inputs: string[] = [];

    beforeAll(async () => {
        // vite.config.js is plain JavaScript without type declarations, so import it by a variable path.
        const file = "../vite.config.js";
        const { default: config } = await import(file);
        inputs = Object.values(config.build.rollupOptions.input as Record<string, string>);
    });

    it("every page in the site map is a build input", () => {
        for (const p of pages) expect(inputs, p.id).toContain(resolve(htmlFor(p.path)));
    });

    it("every build input is in the site map", () => {
        const known = pages.map((p) => resolve(htmlFor(p.path)));
        for (const input of inputs) expect(known, input).toContain(input);
    });
});
