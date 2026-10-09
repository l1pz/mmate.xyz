import { describe, expect, it } from "vitest";
import { escapeHtml } from "../src/core/html";
import { crumbs, endPrompt, manHeader, promptLine } from "../src/core/shell";

describe("escapeHtml", () => {
    it("escapes markup and quotes", () => {
        expect(escapeHtml(`<a href="x">&</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;");
    });
});

describe("crumbs", () => {
    it("links the parts that have an href and leaves the last one plain", () => {
        expect(crumbs([{ label: "1000110.xyz", href: "/" }, { label: "blog", href: "#" }, { label: "post" }])).toBe(
            '<nav class="crumbs"><a href="/">1000110.xyz</a> / <a href="#">blog</a> / post</nav>',
        );
    });

    it("escapes labels and hrefs", () => {
        const html = crumbs([{ label: "<b>", href: '"x' }]);
        expect(html).not.toContain("<b>");
        expect(html).toContain("&lt;b&gt;");
        expect(html).toContain("&quot;x");
    });
});

describe("manHeader", () => {
    it("uppercases the name and adds (1)", () => {
        expect(manHeader("hello-world", "blog", "2026-10-02")).toBe(
            '<header class="man"><span>HELLO-WORLD(1)</span><span>blog</span><span>2026-10-02</span></header>',
        );
    });

    it("escapes its parts", () => {
        expect(manHeader("<x>", "a&b", "d")).not.toContain("<x>");
    });
});

describe("promptLine and endPrompt", () => {
    it("draws a dim $ and the command, escaped", () => {
        expect(promptLine("cat a.md")).toBe('<p class="prompt"><span class="dim">$</span> cat a.md</p>');
        expect(promptLine("<script>")).not.toContain("<script>");
    });

    it("ends with the blinking cursor", () => {
        expect(endPrompt()).toContain('<span class="cursor"></span>');
    });
});
