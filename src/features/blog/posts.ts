import { type Post, parsePost } from "./frontmatter";

// Posts are bundled into the JS at build time (no runtime fetching).
const files = import.meta.glob("./posts/*.md", { query: "?raw", import: "default", eager: true }) as Record<
    string,
    string
>;

/** Parses every file into posts, newest first. Throws on a duplicate slug. */
export function loadPosts(sources: Record<string, string>): Post[] {
    const posts: Post[] = [];
    const seen = new Map<string, string>();
    for (const [path, raw] of Object.entries(sources)) {
        const post = parsePost(raw, path);
        const other = seen.get(post.slug);
        if (other) throw new Error(`duplicate slug "${post.slug}" in ${other} and ${path}`);
        seen.set(post.slug, path);
        posts.push(post);
    }
    return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

const posts = loadPosts(files);

export function getPosts(): Post[] {
    return posts;
}

export function getPost(slug: string): Post | undefined {
    return posts.find((post) => post.slug === slug);
}
