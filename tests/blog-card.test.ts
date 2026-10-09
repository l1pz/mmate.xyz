import { describe, expect, it } from "vitest";
import { borders } from "../src/borders";
import { buildBlogCard } from "../src/features/blog";
import type { Post } from "../src/features/blog/frontmatter";

const post = (slug: string, date: string, title = slug): Post => ({ slug, date, title, tags: [], body: "" });

describe("blog card", () => {
    it("lists posts in the given order with links to the reading view", () => {
        const html = buildBlogCard([post("b", "2026-02-01"), post("a", "2026-01-01")], 41, 32).toHtml();
        expect(html).toContain('<a href="/blog/#b">2026-02-01  b</a>');
        expect(html.indexOf("#b")).toBeLessThan(html.indexOf("#a"));
    });

    it("shows at most 5 posts", () => {
        const posts = Array.from({ length: 8 }, (_, i) => post(`p${i}`, "2026-01-01"));
        expect(buildBlogCard(posts, 41, 32).toHtml().match(/<a /g)).toHaveLength(5);
    });

    it("truncates long titles so they fit inside every border", () => {
        const long = post("long", "2026-01-01", "x".repeat(80));
        for (const style of [null, ...Object.values(borders)]) {
            const card = buildBlogCard([long], 41, 32, style);
            expect(card.toString()).toContain("…");
            expect(card.rows).toBe(32);
        }
    });

    it("draws the typewriter above the list", () => {
        const text = buildBlogCard([post("a", "2026-01-01")], 41, 32).toString();
        expect(text.indexOf("_m_______m_")).toBeGreaterThan(-1);
        expect(text.indexOf("_m_______m_")).toBeLessThan(text.indexOf("2026-01-01"));
    });

    it("fits 5 posts plus the binary footer in every border", () => {
        const posts = Array.from({ length: 5 }, (_, i) => post(`p${i}`, "2026-01-01", "x".repeat(80)));
        for (const style of [null, ...Object.values(borders)]) {
            const lines = buildBlogCard(posts, 41, 32, style).toString().split("\n");
            expect(lines.slice(26, 30).every((l) => /[01]{8}/.test(l))).toBe(true);
        }
    });

    it("shows a message when there are no posts, footer still at the bottom", () => {
        const lines = buildBlogCard([], 41, 32).toString().split("\n");
        expect(lines.join("\n")).toContain("no posts yet");
        expect(lines.slice(26, 30).every((l) => /[01]{8}/.test(l))).toBe(true);
    });
});
