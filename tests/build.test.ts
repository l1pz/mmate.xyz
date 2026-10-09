import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { pages } from "../src/core/site";
import { assertShell } from "./helpers/shell";

// Guards against "build passes but the deployed site is broken".
describe("production build", () => {
    beforeAll(() => {
        execSync("npx vite build", { stdio: "pipe" });
    }, 60_000);

    it("contains every page", () => {
        expect(existsSync("dist/index.html")).toBe(true);
        expect(existsSync("dist/blog/index.html")).toBe(true);
        expect(existsSync("dist/experiments/index.html")).toBe(true);
        expect(existsSync("dist/experiments/fluiddynamics/index.html")).toBe(true);
    });

    it("ships the fonts the CSS asks for", () => {
        expect(existsSync("dist/fonts/stylesheet.css")).toBe(true);
        expect(existsSync("dist/fonts/DejaVuSansMono.woff2")).toBe(true);
    });

    it("gives every page in the site map the shell, a status line and the phone viewport", () => {
        for (const page of pages) {
            const html = readFileSync(`dist/${page.path.replace(/^\//, "")}index.html`, "utf8");
            expect(html, page.id).toContain('<body class="shell">');
            expect(html, page.id).toContain('id="status"');
            expect(html, page.id).toContain("viewport-fit=cover");
            expect(html, page.id).toContain("<noscript>");
        }
    });

    it("generates the <noscript> home page from the same code as the JS page", () => {
        const html = readFileSync("dist/index.html", "utf8");
        const noscript = html.slice(html.indexOf("<noscript>"), html.indexOf("</noscript>"));
        expect(noscript).not.toContain("noscript-home"); // placeholder was replaced
        assertShell(noscript);
        for (const part of ["whoami", "cat portrait.txt", "ls ~/blog", "cat contact.txt"]) {
            expect(noscript).toContain(part);
        }
        expect(noscript).toContain('<a href="mailto:mmateka89@gmail.com">');
        expect(noscript).toContain('class="secret dim"');
    });
}, 60_000);
