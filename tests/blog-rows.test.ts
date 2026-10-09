import { describe, expect, it } from "vitest";
import type { Post } from "../src/features/blog/frontmatter";
import { postRows } from "../src/features/blog/rows";

const post = (slug: string): Post => ({
    slug,
    title: `Title <${slug}>`,
    date: "2026-10-09",
    tags: ["a"],
    body: "one two",
});

describe("postRows", () => {
    it("links relative to the blog page by default", () => {
        expect(postRows([post("x")])).toContain('<a class="row" href="#x">');
    });

    it("links into the blog from another page when given a base", () => {
        expect(postRows([post("x")], "/blog/")).toContain('href="/blog/#x"');
    });

    it("shows word count, date, escaped title and tags, one row per post", () => {
        const html = postRows([post("x"), post("y")]);
        expect(html.match(/class="row"/g)).toHaveLength(2);
        expect(html).toContain("2w");
        expect(html).toContain("2026-10-09");
        expect(html).toContain("Title &lt;x&gt;");
        expect(html).toContain("[a]");
    });

    it("says so when there are no posts", () => {
        expect(postRows([])).toContain("nothing here yet");
    });
});
