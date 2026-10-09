import type { BorderStyle } from "../../borders";
import Card from "../../card";
import type { Post } from "./frontmatter";
import { getPosts } from "./posts";

export const CARD_POSTS = 5;
/** Widest row that fits inside the frame of a 41 column card. */
const MAX_ROW = 39;
/** Hidden binary message at the bottom, like the other cards. Keep it at most 16 characters (4 lines). */
const FOOTER = "keep writing";

const truncate = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, max - 1)}…`);

/** The home tile: the newest posts, one linked row each. Pure, so tests can pass their own posts. */
export function buildBlogCard(posts: Post[], width: number, height: number, border: BorderStyle | null = null): Card {
    return new Card(
        width,
        height,
        "blog",
        (card) => {
            card.emptyLine(1);
            card.drawAsciiArtCentered("typewriter");
            card.emptyLine(2);
            if (posts.length === 0) {
                card.drawTextCentered("no posts yet");
                card.emptyLine(1);
                card.drawBinaryTextCentered(FOOTER);
                return;
            }
            const rows = posts.slice(0, CARD_POSTS).map((p) => ({
                slug: p.slug,
                text: `${p.date}  ${truncate(p.title, MAX_ROW - p.date.length - 2)}`,
            }));
            const widest = Math.max(...rows.map((r) => r.text.length));
            for (const { slug, text } of rows) {
                // Padded to one width so the rows line up at the left edge when centered.
                card.drawTextCentered(text.padEnd(widest), { label: text, href: `/blog/#${slug}` });
                card.emptyLine(1);
            }
            card.drawBinaryTextCentered(FOOTER);
        },
        border,
    );
}

export default {
    id: "blog",
    card: (width: number, height: number, border: BorderStyle | null = null) =>
        buildBlogCard(getPosts(), width, height, border),
};
