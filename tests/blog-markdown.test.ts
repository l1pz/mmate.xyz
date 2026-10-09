import { describe, expect, it } from "vitest";
import { renderInline, renderMarkdown } from "../src/features/blog/markdown";

describe("renderInline", () => {
    it("handles bold, italic, code and safe links", () => {
        expect(renderInline("**b** *i* `c`")).toBe("<strong>b</strong> <em>i</em> <code>c</code>");
        expect(renderInline("[x](https://a.b/c)")).toBe('<a href="https://a.b/c">x</a>');
        expect(renderInline("[x](/blog/)")).toBe('<a href="/blog/">x</a>');
    });

    it("escapes HTML everywhere", () => {
        expect(renderInline("<script>alert(1)</script> & co")).toBe("&lt;script&gt;alert(1)&lt;/script&gt; &amp; co");
        expect(renderInline("`<b>`")).toBe("<code>&lt;b&gt;</code>");
    });

    it("leaves unsafe links as text", () => {
        expect(renderInline("[x](javascript:alert(1))")).not.toContain("<a ");
        expect(renderInline("[x](data:text/html,hi)")).not.toContain("<a ");
    });

    it("does not format inside code spans", () => {
        expect(renderInline("`**not bold**`")).toBe("<code>**not bold**</code>");
    });
});

describe("renderMarkdown", () => {
    it("renders headings with a visible marker", () => {
        expect(renderMarkdown("## Hi")).toBe('<h2><span class="mark">##</span> Hi</h2>');
    });

    it("joins wrapped lines into one paragraph and splits on blank lines", () => {
        expect(renderMarkdown("a\nb\n\nc")).toBe("<p>a b</p>\n<p>c</p>");
    });

    it("renders bullet and numbered lists, with wrapped items", () => {
        expect(renderMarkdown("- a\n- b\n  more")).toBe("<ul><li>a</li><li>b more</li></ul>");
        expect(renderMarkdown("1. a\n2. b")).toBe("<ol><li>a</li><li>b</li></ol>");
    });

    it("renders quotes and rules", () => {
        expect(renderMarkdown("> one\n> two")).toBe("<blockquote>one two</blockquote>");
        expect(renderMarkdown("---")).toBe("<hr>");
    });

    it("draws code blocks as an escaped text box with the language as label", () => {
        const html = renderMarkdown("```ts\nlet a = <1>;\nx\n```");
        const lines = html.replace(/<\/?pre[^>]*>/g, "").split("\n");
        expect(lines[0]).toBe("┌─ ts ─────────┐");
        expect(lines[1]).toBe("│ let a = &lt;1&gt;; │");
        expect(lines.at(-1)).toBe("└──────────────┘");
        expect(html).not.toContain("<1>");
    });

    it("keeps code lines the same width, so the box lines up", () => {
        const html = renderMarkdown("```\nshort\na much longer line\n```");
        const rows = html.replace(/<\/?pre[^>]*>/g, "").split("\n");
        expect(new Set(rows.map((r) => r.length)).size).toBe(1);
    });

    it("does not hang on an unclosed code block or empty input", () => {
        expect(renderMarkdown("```\nabc")).toContain("abc");
        expect(renderMarkdown("")).toBe("");
    });

    it("never lets markup through", () => {
        const html = renderMarkdown("# <img src=x onerror=alert(1)>\n\n<div>hi</div>");
        expect(html).not.toContain("<img");
        expect(html).not.toContain("<div>");
    });
});
