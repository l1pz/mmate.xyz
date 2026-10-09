import { describe, expect, it } from "vitest";
import { getPost, getPosts, loadPosts } from "../src/features/blog/posts";

const post = (title: string, date: string, extra = "") => `---\ntitle: ${title}\ndate: ${date}\n${extra}---\nbody`;

describe("loadPosts", () => {
    it("sorts newest first", () => {
        const posts = loadPosts({
            "./posts/old.md": post("Old", "2025-01-01"),
            "./posts/new.md": post("New", "2026-01-01"),
        });
        expect(posts.map((p) => p.slug)).toEqual(["new", "old"]);
    });

    it("throws on a duplicate slug", () => {
        expect(() =>
            loadPosts({
                "./posts/a.md": post("A", "2025-01-01"),
                "./posts/b.md": post("B", "2025-01-02", "slug: a\n"),
            }),
        ).toThrow(/duplicate slug "a"/);
    });
});

describe("bundled posts", () => {
    it("loads whatever is in posts/, every post valid", () => {
        for (const p of getPosts()) {
            expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
            expect(p.title).not.toBe("");
            expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(getPost(p.slug)).toBe(p);
        }
        expect(getPost("nope")).toBeUndefined();
    });
});
