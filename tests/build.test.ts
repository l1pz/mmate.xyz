import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { initAscii } from "../src/ascii";
import { buildHomeCards } from "../src/cards";

// Guards against "build passes but the deployed site is broken".
describe("production build", () => {
    beforeAll(() => {
        execSync("npx vite build", { stdio: "pipe" });
    }, 60_000);

    it("contains every page", () => {
        expect(existsSync("dist/index.html")).toBe(true);
        expect(existsSync("dist/experiments/index.html")).toBe(true);
        expect(existsSync("dist/experiments/fluiddynamics/index.html")).toBe(true);
    });

    it("ships the fonts the CSS asks for", () => {
        expect(existsSync("dist/fonts/stylesheet.css")).toBe(true);
        expect(existsSync("dist/fonts/DejaVuSansMono.woff2")).toBe(true);
    });

    it("generates the <noscript> cards from the same code as the JS cards", () => {
        const html = readFileSync("dist/index.html", "utf8");
        const noscript = html.slice(html.indexOf("<noscript>"), html.indexOf("</noscript>"));
        expect(noscript).not.toContain("noscript-cards"); // placeholder was replaced
        expect(noscript.match(/<pre>/g)).toHaveLength(4);

        // The art card is random, so compare the fixed ones verbatim.
        initAscii();
        const cards = buildHomeCards();
        for (const id of ["aboutme", "projects", "contact"]) {
            expect(noscript).toContain(cards[id].toHtml());
        }
        expect(noscript).toContain('<a href="mailto:mmateka89@gmail.com">');
    });
}, 60_000);
