import { describe, expect, it } from "vitest";
import { parseFrontmatter, parsePost } from "../src/features/blog/frontmatter";

const valid = "---\ntitle: Hi: there\ndate: 2026-10-02\ntags: [a, b]\n---\n\nbody\n";

describe("parseFrontmatter", () => {
    it("parses values, lists and the body", () => {
        const { data, body } = parseFrontmatter(valid);
        expect(data).toEqual({ title: "Hi: there", date: "2026-10-02", tags: ["a", "b"] });
        expect(body).toBe("body\n");
    });

    it("handles CRLF and a BOM", () => {
        const { data, body } = parseFrontmatter(`﻿${valid.replace(/\n/g, "\r\n")}`);
        expect(data.title).toBe("Hi: there");
        expect(body).toBe("body\n");
    });

    it("parses an empty list", () => {
        expect(parseFrontmatter("---\ntags: []\n---\n").data.tags).toEqual([]);
    });

    it("throws on a missing or unclosed fence", () => {
        expect(() => parseFrontmatter("title: x")).toThrow(/start with/);
        expect(() => parseFrontmatter("---\ntitle: x\n")).toThrow(/not closed/);
    });

    it("throws on a line that is not key: value", () => {
        expect(() => parseFrontmatter("---\njunk\n---\n")).toThrow(/key: value/);
    });
});

describe("parsePost", () => {
    it("defaults the slug to the filename and tags to empty", () => {
        const post = parsePost("---\ntitle: T\ndate: 2026-01-02\n---\nx", "./posts/my-post.md");
        expect(post).toEqual({ title: "T", date: "2026-01-02", tags: [], slug: "my-post", body: "x" });
    });

    it("uses an explicit slug", () => {
        expect(parsePost("---\ntitle: T\ndate: 2026-01-02\nslug: other\n---\n", "a.md").slug).toBe("other");
    });

    it("names the file in errors", () => {
        expect(() => parsePost("---\ndate: 2026-01-02\n---\n", "a.md")).toThrow(/a\.md: missing title/);
        expect(() => parsePost("---\ntitle: T\ndate: 2026-1-2\n---\n", "a.md")).toThrow(/YYYY-MM-DD/);
        expect(() => parsePost("---\ntitle: T\ndate: 2026-01-02\nslug: Bad Slug\n---\n", "a.md")).toThrow(/slug/);
        expect(() => parsePost("---\ntitle: T\ndate: 2026-01-02\ntags: a\n---\n", "a.md")).toThrow(/tags/);
    });
});

describe("secret", () => {
    const raw = (extra: string) => `---\ntitle: t\ndate: 2026-10-10\n${extra}---\nbody`;

    it("is optional", () => {
        expect(parsePost(raw(""), "a.md").secret).toBeUndefined();
    });

    it("is kept when given", () => {
        expect(parsePost(raw("secret: hello there\n"), "a.md").secret).toBe("hello there");
    });

    it("is rejected when empty, a list or too long", () => {
        expect(() => parsePost(raw("secret:\n"), "a.md")).toThrow(/a\.md: secret/);
        expect(() => parsePost(raw("secret: [a, b]\n"), "a.md")).toThrow(/secret/);
        expect(() => parsePost(raw(`secret: ${"x".repeat(33)}\n`), "a.md")).toThrow(/32/);
    });
});
