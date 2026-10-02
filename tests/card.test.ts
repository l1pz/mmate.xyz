import { beforeAll, describe, expect, it } from "vitest";
import { ascii } from "../src/ascii";
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
});
