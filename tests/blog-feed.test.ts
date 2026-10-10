import { describe, expect, it } from "vitest";
import { buildFeed, cdata } from "../src/features/blog/feed";
import type { Post } from "../src/features/blog/frontmatter";

const site = { url: "https://example.test", title: "Site & Co", description: "Posts <here>" };
const post = (over: Partial<Post> = {}): Post => ({
    title: "Hello",
    date: "2026-10-10",
    tags: [],
    slug: "hello",
    body: "text",
    ...over,
});

describe("buildFeed", () => {
    it("builds an RSS 2.0 skeleton with an absolute self link", () => {
        const xml = buildFeed([post()], site);
        expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"')).toBe(true);
        expect(xml).toContain('<atom:link href="https://example.test/feed.xml" rel="self"');
        expect(xml).toContain("<link>https://example.test/blog/</link>");
        expect(xml.trimEnd().endsWith("</rss>")).toBe(true);
    });

    it("is valid with no posts and has no lastBuildDate", () => {
        const xml = buildFeed([], site);
        expect(xml).toContain("<channel>");
        expect(xml).not.toContain("<item>");
        expect(xml).not.toContain("lastBuildDate");
    });

    it("keeps the given order and takes lastBuildDate from the first post", () => {
        const xml = buildFeed(
            [
                post({ title: "New", slug: "new", date: "2026-10-10" }),
                post({ title: "Old", slug: "old", date: "2026-01-02" }),
            ],
            site,
        );
        expect(xml.indexOf("<title>New</title>")).toBeLessThan(xml.indexOf("<title>Old</title>"));
        expect(xml).toContain("<lastBuildDate>Sat, 10 Oct 2026 00:00:00 GMT</lastBuildDate>");
        expect(xml).toContain("<pubDate>Fri, 02 Jan 2026 00:00:00 GMT</pubDate>");
    });

    it("links and ids items by hash url and adds one category per tag", () => {
        const xml = buildFeed([post({ tags: ["a", "b&c"] })], site);
        expect(xml).toContain("<link>https://example.test/blog/#hello</link>");
        expect(xml).toContain('<guid isPermaLink="true">https://example.test/blog/#hello</guid>');
        expect(xml).toContain("<category>a</category>");
        expect(xml).toContain("<category>b&amp;c</category>");
    });

    it("escapes text so a post cannot break the XML", () => {
        const xml = buildFeed([post({ title: 'A <b> & "q"' })], site);
        expect(xml).toContain("<title>Site &amp; Co</title>");
        expect(xml).toContain("<description>Posts &lt;here&gt;</description>");
        expect(xml).toContain("<title>A &lt;b&gt; &amp; &quot;q&quot;</title>");
    });

    it("carries the rendered body with absolute links", () => {
        const xml = buildFeed([post({ body: "see [a](/blog/#x) and [b](//other.test/) and **bold**" })], site);
        expect(xml).toContain('<a href="https://example.test/blog/#x">a</a>');
        expect(xml).toContain('<a href="//other.test/">b</a>');
        expect(xml).toContain("<strong>bold</strong>");
    });
});

describe("cdata", () => {
    it("splits a literal ]]> so the section cannot end early", () => {
        expect(cdata("a]]>b")).toBe("<![CDATA[a]]]]><![CDATA[>b]]>");
    });
});
