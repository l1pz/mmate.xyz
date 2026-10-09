import { describe, expect, it } from "vitest";
import type { Post } from "../src/features/blog/frontmatter";
import {
    BAR_WIDTH,
    parseRoute,
    renderIndex,
    renderNotFound,
    renderPost,
    scrollFraction,
    statusLine,
    wordCount,
} from "../src/features/blog/page";

const post = (over: Partial<Post> = {}): Post => ({
    title: "A <b> title",
    date: "2026-10-09",
    tags: ["x", "y"],
    slug: "a-post",
    body: "one two three\n\n## Head",
    ...over,
});

describe("parseRoute", () => {
    it("maps the hash to the index or a post", () => {
        expect(parseRoute("")).toEqual({ view: "index" });
        expect(parseRoute("#")).toEqual({ view: "index" });
        expect(parseRoute("#a-post")).toEqual({ view: "post", slug: "a-post" });
        expect(parseRoute("#a%20b")).toEqual({ view: "post", slug: "a b" });
    });
});

describe("scrollFraction", () => {
    it("is 0 at the top, 1 at the bottom, and clamped", () => {
        expect(scrollFraction(0, 2000, 1000)).toBe(0);
        expect(scrollFraction(500, 2000, 1000)).toBe(0.5);
        expect(scrollFraction(1000, 2000, 1000)).toBe(1);
        expect(scrollFraction(5000, 2000, 1000)).toBe(1);
        expect(scrollFraction(-10, 2000, 1000)).toBe(0);
    });

    it("counts a page that fits the window as fully read", () => {
        expect(scrollFraction(0, 800, 1000)).toBe(1);
    });
});

describe("statusLine", () => {
    it("draws a fixed width bar and the percentage", () => {
        const empty = statusLine("x.md", 0);
        const half = statusLine("x.md", 0.5);
        const full = statusLine("x.md", 1);
        expect(empty).toBe(`x.md  [${"░".repeat(BAR_WIDTH)}]   0%`);
        expect(half).toBe(`x.md  [${"█".repeat(10)}${"░".repeat(10)}]  50%`);
        expect(full).toBe(`x.md  [${"█".repeat(BAR_WIDTH)}] 100%`);
        expect(new Set([empty, half, full].map((s) => s.length)).size).toBe(1);
    });
});

describe("wordCount", () => {
    it("counts words", () => {
        expect(wordCount("a  b\nc")).toBe(3);
        expect(wordCount("")).toBe(0);
    });
});

describe("renderIndex", () => {
    it("lists every post as a link to its hash, escaped", () => {
        const html = renderIndex([post()]);
        expect(html).toContain('href="#a-post"');
        expect(html).toContain("A &lt;b&gt; title");
        expect(html).toContain("total 1");
        expect(html).not.toContain("<b>");
    });

    it("handles no posts", () => {
        expect(renderIndex([])).toContain("nothing here yet");
    });
});

describe("renderPost", () => {
    it("has the man header, prompt, title, tags, body and cursor", () => {
        const html = renderPost(post());
        expect(html).toContain("A-POST(1)");
        expect(html).toContain("cat posts/a-post.md");
        expect(html).toContain("A &lt;b&gt; title");
        expect(html).toContain("tags: x, y");
        expect(html).toContain("<h2>");
        expect(html).toContain('class="cursor"');
    });

    it("skips the tags line when there are none", () => {
        expect(renderPost(post({ tags: [] }))).not.toContain("tags:");
    });
});

describe("renderNotFound", () => {
    it("escapes the slug and links back to the list", () => {
        const html = renderNotFound("<x>");
        expect(html).not.toContain("<x>");
        expect(html).toContain('href="#"');
    });
});
