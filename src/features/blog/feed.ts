import { escapeHtml } from "../../core/html";
import type { Post } from "./frontmatter";
import { renderMarkdown } from "./markdown";

export interface FeedSite {
    /** Site address without a trailing slash, e.g. `https://1000110.xyz`. */
    url: string;
    title: string;
    description: string;
}

/** Wraps text in CDATA; a literal `]]>` is split so it cannot end the section early. */
export const cdata = (text: string) => `<![CDATA[${text.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

/** `YYYY-MM-DD` as an RFC 822 date at midnight UTC. */
const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

/** Post links are root-relative; feed readers need absolute ones. `//host` links are left alone. */
const absolutize = (html: string, url: string) => html.replace(/href="\/(?!\/)/g, `href="${url}/`);

/**
 * RSS 2.0 feed with the full post content. `posts` must already be newest first (as `getPosts()` returns them).
 * `lastBuildDate` is the newest post's date, not the clock, so the same posts always give the same file.
 */
export function buildFeed(posts: Post[], site: FeedSite): string {
    const feedUrl = `${site.url}/feed.xml`;
    const items = posts.map((post) => {
        const link = `${site.url}/blog/#${post.slug}`;
        return [
            "    <item>",
            `      <title>${escapeHtml(post.title)}</title>`,
            `      <link>${escapeHtml(link)}</link>`,
            `      <guid isPermaLink="true">${escapeHtml(link)}</guid>`,
            `      <pubDate>${rfc822(post.date)}</pubDate>`,
            ...post.tags.map((tag) => `      <category>${escapeHtml(tag)}</category>`),
            `      <content:encoded>${cdata(absolutize(renderMarkdown(post.body), site.url))}</content:encoded>`,
            "    </item>",
        ].join("\n");
    });
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
        "  <channel>",
        `    <title>${escapeHtml(site.title)}</title>`,
        `    <link>${escapeHtml(site.url)}/blog/</link>`,
        `    <description>${escapeHtml(site.description)}</description>`,
        "    <language>en</language>",
        `    <atom:link href="${escapeHtml(feedUrl)}" rel="self" type="application/rss+xml"/>`,
        ...(posts.length > 0 ? [`    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>`] : []),
        ...items,
        "  </channel>",
        "</rss>",
        "",
    ].join("\n");
}
