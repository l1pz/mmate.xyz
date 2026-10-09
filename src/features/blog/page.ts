import type { Post } from "./frontmatter";
import { escapeHtml, renderMarkdown } from "./markdown";
import { getPost, getPosts } from "./posts";

export const BAR_WIDTH = 20;

export type Route = { view: "index" } | { view: "post"; slug: string };

/** `/blog/` is the list, `/blog/#<slug>` is one post. */
export function parseRoute(hash: string): Route {
    const slug = decodeURIComponent(hash.replace(/^#/, ""));
    return slug === "" ? { view: "index" } : { view: "post", slug };
}

export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** How far down the page the reader is, 0 to 1. A page that fits the window counts as fully read. */
export function scrollFraction(scrollTop: number, scrollHeight: number, clientHeight: number): number {
    const max = scrollHeight - clientHeight;
    return max <= 0 ? 1 : Math.min(1, Math.max(0, scrollTop / max));
}

/** The pager status line text: `name  [████░░░░░░░░░░░░░░░░]  20%`. */
export function statusLine(name: string, fraction: number): string {
    const filled = Math.round(fraction * BAR_WIDTH);
    const bar = "█".repeat(filled) + "░".repeat(BAR_WIDTH - filled);
    return `${name}  [${bar}] ${String(Math.round(fraction * 100)).padStart(3)}%`;
}

const crumbs = (last?: string) =>
    `<nav class="crumbs"><a href="/">1000110.xyz</a> / ${last ? `<a href="#">blog</a> / ${escapeHtml(last)}` : "blog"}</nav>`;

/** The `/blog/` list, drawn like `ls -l`. */
export function renderIndex(posts: Post[]): string {
    const rows = posts.map(
        (p) =>
            `<div class="row"><span class="dim">-rw-r--r--</span> ${String(wordCount(p.body)).padStart(5)}w ` +
            `<span class="dim">${p.date}</span> <a href="#${encodeURIComponent(p.slug)}">${escapeHtml(p.title)}</a>` +
            `${p.tags.length ? ` <span class="dim">[${escapeHtml(p.tags.join(", "))}]</span>` : ""}</div>`,
    );
    return [
        crumbs(),
        '<p class="prompt"><span class="dim">$</span> ls -l ~/blog</p>',
        `<p class="dim">total ${posts.length}</p>`,
        ...(rows.length ? rows : ['<p class="dim">(nothing here yet)</p>']),
    ].join("\n");
}

/** One post: a man-page header, the text, and a prompt with a blinking cursor at the end. */
export function renderPost(post: Post): string {
    const tags = post.tags.length ? `<p class="dim">tags: ${escapeHtml(post.tags.join(", "))}</p>` : "";
    return [
        crumbs(post.slug),
        `<header class="man"><span>${escapeHtml(post.slug.toUpperCase())}(1)</span><span>blog</span><span>${post.date}</span></header>`,
        `<p class="prompt"><span class="dim">$</span> cat posts/${escapeHtml(post.slug)}.md</p>`,
        `<h1 class="title">${escapeHtml(post.title)}</h1>`,
        tags,
        `<article>${renderMarkdown(post.body)}</article>`,
        '<p class="prompt"><span class="dim">$</span> <span class="cursor"></span></p>',
    ].join("\n");
}

export function renderNotFound(slug: string): string {
    return [
        crumbs(slug),
        `<p class="prompt"><span class="dim">$</span> cat posts/${escapeHtml(slug)}.md</p>`,
        `<p class="error">cat: posts/${escapeHtml(slug)}.md: no such file</p>`,
        '<p><a href="#">cd ~/blog</a></p>',
    ].join("\n");
}

/** Draws the page into `el` and wires up the hash routing, the status line and the vim-style keys. */
export async function mount(el: Element): Promise<void> {
    el.innerHTML = '<main id="content"></main><footer id="status"></footer>';
    const content = el.querySelector<HTMLElement>("#content");
    const status = el.querySelector<HTMLElement>("#status");
    if (!content || !status) return;

    let name = "~/blog";
    const updateStatus = () => {
        const root = document.documentElement;
        status.textContent = statusLine(name, scrollFraction(root.scrollTop, root.scrollHeight, root.clientHeight));
    };

    const show = () => {
        const route = parseRoute(location.hash);
        if (route.view === "index") {
            content.innerHTML = renderIndex(getPosts());
            name = "~/blog";
            document.title = "blog - 1000110.xyz";
        } else {
            const post = getPost(route.slug);
            content.innerHTML = post ? renderPost(post) : renderNotFound(route.slug);
            name = post ? `${post.slug}.md` : "error";
            document.title = `${post ? post.title : "not found"} - 1000110.xyz`;
        }
        window.scrollTo(0, 0);
        updateStatus();
    };

    const lineStep = () => (Number.parseFloat(getComputedStyle(content).lineHeight) || 20) * 3;
    window.addEventListener("hashchange", show);
    window.addEventListener("scroll", updateStatus, { passive: true });
    window.addEventListener("resize", updateStatus);
    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        // Space, PageUp and PageDown already scroll natively.
        if (e.key === "j" || e.key === "ArrowDown") window.scrollBy({ top: lineStep() });
        else if (e.key === "k" || e.key === "ArrowUp") window.scrollBy({ top: -lineStep() });
        else if (e.key === "g") window.scrollTo(0, 0);
        else if (e.key === "G") window.scrollTo(0, document.documentElement.scrollHeight);
        else if (e.key === "b" || e.key === "Escape") location.hash = "";
        else return;
        e.preventDefault();
    });
    show();
}
