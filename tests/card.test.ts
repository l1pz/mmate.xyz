import { beforeAll, describe, expect, it } from "vitest";
import { ascii } from "../src/ascii";
import { borders } from "../src/borders";
import Card from "../src/card";

beforeAll(() => {
    ascii["tiny"] = "ab\ncd";
});

describe("Card", () => {
    it("has the requested size and a centered title", () => {
        const lines = new Card(41, 32, "about me", () => {}).toString().split("\n");
        expect(lines).toHaveLength(33); // 32 rows + trailing newline
        expect(lines.every((l, i) => i === 32 || l.length === 41)).toBe(true);
        expect(lines[1].trim()).toBe("about me");
        expect(lines[1].indexOf("about me")).toBe(16);
    });

    it("centers text and advances the row", () => {
        const card = new Card(11, 6, "t", (c) => {
            c.drawTextCentered("hi");
            c.drawTextCentered("there");
        });
        const lines = card.toString().split("\n");
        expect(lines[3]).toBe("    hi     ");
        expect(lines[4]).toBe("   there   ");
    });

    it("draws ascii art and skips lines with emptyLine", () => {
        const card = new Card(10, 10, "t", (c) => {
            c.emptyLine(1);
            c.drawAsciiArtCentered("tiny");
        });
        const lines = card.toString().split("\n");
        expect(lines[4].trim()).toBe("ab");
        expect(lines[5].trim()).toBe("cd");
    });

    it("renders links as anchors and escapes everything else", () => {
        const card = new Card(30, 8, "t", (c) => {
            c.drawTextCentered("mail: a<b>@x.y & co", { label: "a<b>@x.y", href: "mailto:a@x.y" });
        });
        const html = card.toHtml();
        expect(html).toContain('<a href="mailto:a@x.y">a&lt;b&gt;@x.y</a>');
        expect(html).toContain("&amp; co");
        expect(html).not.toContain("<b>");
    });

    it("encodes binary text in 8-bit groups", () => {
        const card = new Card(41, 10, "t", (c) => c.drawBinaryTextCentered("hi"));
        expect(card.toString()).toContain("01101000 01101001 00100000 00100000");
    });

    it("throws a clear error when drawing past the last row", () => {
        expect(
            () =>
                new Card(10, 4, "t", (c) => {
                    c.emptyLine(5);
                    c.drawTextCentered("x");
                }),
        ).toThrow(RangeError);
    });

    it("throws for unknown art and missing link labels", () => {
        expect(() => new Card(10, 10, "t", (c) => c.drawAsciiArtCentered("nope"))).toThrow(/Unknown ASCII art/);
        expect(() => new Card(10, 10, "t", (c) => c.drawTextCentered("abc", { label: "x", href: "/" }))).toThrow(
            /not found/,
        );
    });

    describe("colors", () => {
        it("styles the title, and wraps only styled runs in spans", () => {
            const html = new Card(11, 6, "hi", () => {}).toHtml().split("\n");
            expect(html[1]).toBe('    <span class="c-title">hi</span>     ');
            expect(html[3]).toBe("           "); // unstyled rows stay plain
        });

        it("applies a style to text and art", () => {
            const html = new Card(11, 8, "t", (c) => {
                c.drawTextCentered("ab", undefined, "aqua");
                c.drawAsciiArtCentered("tiny", "red");
            }).toHtml();
            expect(html).toContain('<span class="c-aqua">ab</span>');
            expect(html).toContain('<span class="c-red">ab</span>');
        });

        it("colors the border cells and the footer, never changing the plain text", () => {
            const plain = new Card(41, 32, "t", (c) => c.drawFooter("hi"), borders.rounded);
            const html = plain.toHtml();
            expect(html).toContain('<span class="c-border">╭');
            expect(html).toContain('<span class="c-dim">01101000');
            expect(html.replace(/<[^>]+>/g, "")).toBe(plain.toString());
        });

        it("keeps a link inside its colored run", () => {
            const html = new Card(20, 6, "t", (c) => c.drawTextCentered("go home", { href: "/" }, "green")).toHtml();
            expect(html).toContain('<a href="/"><span class="c-green">go home</span></a>');
        });

        it("makes the title a link", () => {
            const html = new Card(20, 6, "blog", (c) => c.linkTitle("/blog/")).toHtml();
            expect(html).toContain('<a href="/blog/"><span class="c-title">blog</span></a>');
        });
    });

    describe("drawFooter", () => {
        const rows = (card: Card) => card.toString().split("\n");

        it("draws 4 binary lines ending one row above the bottom, wherever the content ends", () => {
            const short = rows(new Card(41, 32, "t", (c) => c.drawFooter("abcdefghijklmnop")));
            const long = rows(
                new Card(41, 32, "t", (c) => {
                    c.emptyLine(10);
                    c.drawTextCentered("content");
                    c.drawFooter("abcdefghijklmnop");
                }),
            );
            for (const lines of [short, long]) {
                expect(lines[25].trim()).toBe("");
                expect(lines.slice(26, 30).every((l) => /^[01 ]+$/.test(l) && l.trim().length === 35)).toBe(true);
                expect(lines[30].trim()).toBe("");
            }
            expect(short.slice(26, 30)).toEqual(long.slice(26, 30));
        });

        it("pads short messages so it is always 4 lines", () => {
            const lines = rows(new Card(41, 32, "t", (c) => c.drawFooter("hi")));
            expect(lines.slice(26, 30).every((l) => l.trim().length === 35)).toBe(true);
            expect(lines[26].trim().startsWith("01101000 01101001 00100000")).toBe(true); // "hi "
        });

        it("throws when the message is too long", () => {
            expect(() => new Card(41, 32, "t", (c) => c.drawFooter("x".repeat(17)))).toThrow(RangeError);
        });

        it("throws when content already uses the footer rows", () => {
            expect(
                () =>
                    new Card(41, 32, "t", (c) => {
                        c.emptyLine(24);
                        c.drawTextCentered("too low");
                        c.drawFooter("hi");
                    }),
            ).toThrow(/overlaps the footer/);
        });

        it("works under every border style", () => {
            for (const style of Object.values(borders)) {
                const lines = rows(new Card(41, 32, "t", (c) => c.drawFooter("hi"), style));
                expect(lines[26]).toContain("01101000");
            }
        });
    });
});
