import { describe, expect, it } from "vitest";
import type { Post } from "../src/features/blog/frontmatter";
import { parseRoute, renderIndex, renderNotFound, renderPost } from "../src/features/blog/page";
import { wordCount } from "../src/features/blog/rows";
import { assertShell } from "./helpers/shell";

const TODAY = "2026-10-10";

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

describe("wordCount", () => {
    it("counts words", () => {
        expect(wordCount("a  b\nc")).toBe(3);
        expect(wordCount("")).toBe(0);
    });
});

describe("renderIndex", () => {
    it("has the whole shell, with today's date in the man header", () => {
        const html = renderIndex([post()], TODAY);
        assertShell(html);
        expect(html).toContain("BLOG(1)");
        expect(html).toContain(TODAY);
        expect(html).toContain("ls -l ~/blog");
    });

    it("lists every post as a link to its hash, escaped", () => {
        const html = renderIndex([post()], TODAY);
        expect(html).toContain('<a class="row" href="#a-post">');
        expect(html).toContain("A &lt;b&gt; title");
        expect(html).toContain("total 1");
        expect(html).not.toContain("<b>");
    });

    it("handles no posts and still has the shell", () => {
        const html = renderIndex([], TODAY);
        assertShell(html);
        expect(html).toContain("nothing here yet");
    });
});

describe("renderPost", () => {
    it("has the whole shell with the post's own date and name", () => {
        const html = renderPost(post());
        assertShell(html);
        expect(html).toContain("A-POST(1)");
        expect(html).toContain("2026-10-09");
        expect(html).toContain("cat posts/a-post.md");
    });

    it("has the title, tags and body", () => {
        const html = renderPost(post());
        expect(html).toContain("A &lt;b&gt; title");
        expect(html).toContain("tags: x, y");
        expect(html).toContain("<h2>");
    });

    it("links the blog crumb back to the list", () => {
        expect(renderPost(post())).toContain('<a href="#">blog</a> / a-post');
    });

    it("skips the tags line when there are none", () => {
        expect(renderPost(post({ tags: [] }))).not.toContain("tags:");
    });

    it("shows the post's secret above the end prompt, only when it has one", () => {
        expect(renderPost(post())).not.toContain("secret");
        const html = renderPost(post({ secret: "hello" }));
        assertShell(html);
        expect(html).toContain('class="secret dim"');
    });
});

describe("renderNotFound", () => {
    it("has the whole shell, escapes the slug and links back to the list", () => {
        const html = renderNotFound("<x>", TODAY);
        assertShell(html);
        expect(html).not.toContain("<x>");
        expect(html).toContain('href="#"');
    });
});
