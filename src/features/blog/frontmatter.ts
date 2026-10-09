export type FrontmatterValue = string | string[];

export interface PostMeta {
    title: string;
    /** YYYY-MM-DD */
    date: string;
    tags: string[];
    slug: string;
}

export interface Post extends PostMeta {
    body: string;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Splits `---` fenced frontmatter from the body. Supports `key: value` and inline `[a, b]` lists only.
 * Throws `Error` on a missing or unclosed fence or a line that is not `key: value`.
 */
export function parseFrontmatter(raw: string): { data: Record<string, FrontmatterValue>; body: string } {
    const lines = raw.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
    if (lines[0]?.trim() !== "---") throw new Error("frontmatter must start with a --- line");
    const end = lines.indexOf("---", 1);
    if (end === -1) throw new Error("frontmatter is not closed with a --- line");

    const data: Record<string, FrontmatterValue> = {};
    for (const line of lines.slice(1, end)) {
        if (line.trim() === "") continue;
        const colon = line.indexOf(":");
        const key = colon === -1 ? "" : line.slice(0, colon).trim();
        if (!key) throw new Error(`frontmatter line is not "key: value": ${line}`);
        data[key] = parseValue(line.slice(colon + 1).trim());
    }
    return {
        data,
        body: lines
            .slice(end + 1)
            .join("\n")
            .replace(/^\n+/, ""),
    };
}

function parseValue(value: string): FrontmatterValue {
    if (value.startsWith("[") && value.endsWith("]")) {
        return value
            .slice(1, -1)
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "");
    }
    return value;
}

/** Parses and validates one post. `filename` (e.g. `hello-world.md`) is the default slug and appears in errors. */
export function parsePost(raw: string, filename: string): Post {
    try {
        const { data, body } = parseFrontmatter(raw);
        const title = data.title;
        const date = data.date;
        if (typeof title !== "string" || title === "") throw new Error("missing title");
        if (typeof date !== "string" || !DATE.test(date)) throw new Error(`date must be YYYY-MM-DD, got "${date}"`);
        const slug = data.slug ?? filename.replace(/^.*\//, "").replace(/\.md$/, "");
        if (typeof slug !== "string" || !SLUG.test(slug)) throw new Error(`invalid slug "${slug}"`);
        const tags = data.tags ?? [];
        if (!Array.isArray(tags)) throw new Error("tags must be a list like [a, b]");
        return { title, date, tags, slug, body };
    } catch (error) {
        throw new Error(`${filename}: ${(error as Error).message}`);
    }
}
