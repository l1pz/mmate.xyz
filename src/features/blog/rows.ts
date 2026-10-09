import { escapeHtml } from "../../core/html";
import type { Post } from "./frontmatter";

export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

/**
 * Post list rows drawn like `ls -l`; each row is one link, so the whole line is a tap target.
 * `base` is the path the links are relative to: "" on the blog page itself, "/blog/" from other pages.
 */
export function postRows(posts: Post[], base = ""): string {
    if (posts.length === 0) return '<p class="dim">(nothing here yet)</p>';
    return posts
        .map(
            (p) =>
                `<a class="row" href="${base}#${encodeURIComponent(p.slug)}"><span class="dim perm">-rw-r--r--</span> ${String(wordCount(p.body)).padStart(5)}w ` +
                `<span class="dim">${p.date}</span> ${escapeHtml(p.title)}` +
                `${p.tags.length ? ` <span class="dim">[${escapeHtml(p.tags.join(", "))}]</span>` : ""}</a>`,
        )
        .join("\n");
}
