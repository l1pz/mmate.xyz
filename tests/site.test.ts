import { describe, expect, it } from "vitest";
import { binaryLines } from "../src/core/binary";
import { isoDate, renderPage, SECRET_BYTES, secretBlock } from "../src/core/shell";
import { crumbTrail, currentWindow, getPage, pages, windows } from "../src/core/site";
import { assertShell } from "./helpers/shell";

describe("site map", () => {
    it("has unique ids and well formed paths", () => {
        expect(new Set(pages.map((p) => p.id)).size).toBe(pages.length);
        expect(new Set(pages.map((p) => p.path)).size).toBe(pages.length);
        for (const p of pages) expect(p.path).toMatch(/^\/([a-z0-9-]+\/)*$/);
    });

    it("has parents that exist, and windows only for top level pages", () => {
        for (const p of pages) if (p.parent) expect(() => getPage(p.parent as string)).not.toThrow();
        expect(windows().every((p) => !p.parent && p.window !== "")).toBe(true);
        expect(windows()[0].id).toBe("home");
    });

    it("keeps the parent window current on a child page", () => {
        expect(currentWindow(getPage("fluiddynamics")).id).toBe("experiments");
        expect(currentWindow(getPage("blog")).id).toBe("blog");
    });

    it("throws a helpful error for an unknown page", () => {
        expect(() => getPage("nope")).toThrow(/site\.ts/);
    });
});

describe("crumbTrail", () => {
    it("is just the site name on the home page", () => {
        expect(crumbTrail(getPage("home"))).toEqual([{ label: "1000110.xyz" }]);
    });

    it("links every part but the page you are on", () => {
        expect(crumbTrail(getPage("blog"))).toEqual([{ label: "1000110.xyz", href: "/" }, { label: "blog" }]);
        expect(crumbTrail(getPage("fluiddynamics"))).toEqual([
            { label: "1000110.xyz", href: "/" },
            { label: "experiments", href: "/experiments/" },
            { label: "fluiddynamics" },
        ]);
    });

    it("links the page itself when something follows, and allows another href", () => {
        expect(crumbTrail(getPage("blog"), "a-post", "#")).toEqual([
            { label: "1000110.xyz", href: "/" },
            { label: "blog", href: "#" },
            { label: "a-post" },
        ]);
    });
});

describe("binaryLines", () => {
    it("groups bytes per line and pads the last line", () => {
        expect(binaryLines("hi", 4)).toEqual(["01101000 01101001 00100000 00100000"]);
        expect(binaryLines("abcde", 4)).toHaveLength(2);
        expect(binaryLines("", 4)).toEqual([]);
    });
});

describe("secretBlock", () => {
    it("is dim, hidden from screen readers and fits the page width", () => {
        const html = secretBlock("keep writing");
        expect(html).toContain('aria-hidden="true"');
        expect(html).toContain('class="secret dim"');
        expect(html.split("<br>")).toHaveLength(Math.ceil(12 / SECRET_BYTES));
    });
});

describe("renderPage", () => {
    const base = { page: getPage("blog"), command: "ls -l ~/blog", body: "<p>x</p>", date: "2026-10-10" };

    it("builds every part of the frame, in order, with the body in the middle", () => {
        const html = renderPage(base);
        assertShell(html);
        expect(html.indexOf("<p>x</p>")).toBeGreaterThan(html.indexOf("ls -l ~/blog"));
        expect(html.indexOf("<p>x</p>")).toBeLessThan(html.lastIndexOf('class="cursor"'));
    });

    it("takes the man header from the site map unless overridden", () => {
        expect(renderPage(base)).toContain("<span>BLOG(1)</span><span>blog</span><span>2026-10-10</span>");
        expect(renderPage({ ...base, name: "a-post" })).toContain("A-POST(1)");
    });

    it("adds the secret just above the end prompt only when given", () => {
        expect(renderPage(base)).not.toContain("secret");
        const html = renderPage({ ...base, secret: "hi" });
        assertShell(html);
        expect(html.indexOf("secret")).toBeLessThan(html.lastIndexOf('class="cursor"'));
        expect(html.indexOf("secret")).toBeGreaterThan(html.indexOf("<p>x</p>"));
    });

    it("uses a custom trail when given", () => {
        expect(renderPage({ ...base, trail: [{ label: "only" }] })).toContain('<nav class="crumbs">only</nav>');
    });
});

describe("isoDate", () => {
    it("pads month and day, local time", () => {
        expect(isoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
    });
});
