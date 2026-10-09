import { describe, expect, it } from "vitest";
import { ascii, gallery } from "../src/ascii";
import { borders } from "../src/borders";
import { buildHomeCards, CARD_HEIGHT, CARD_WIDTH } from "../src/cards";

describe("home cards", () => {
    it("fit inside every border style, for every gallery piece", () => {
        expect(gallery.length).toBeGreaterThan(0);
        for (const piece of gallery) {
            ascii.art = piece;
            for (const style of Object.values(borders)) {
                const cards = buildHomeCards(style);
                expect(Object.keys(cards)).toEqual(["aboutme", "projects", "blog", "contact", "art"]);
                for (const card of Object.values(cards)) {
                    expect(card.cols).toBe(CARD_WIDTH);
                    expect(card.rows).toBe(CARD_HEIGHT);
                }
                for (const id of ["aboutme", "projects", "contact"]) {
                    // footer: 4 binary lines at rows 26-29
                    const lines = cards[id].toString().split("\n");
                    expect(lines.slice(26, 30).every((l) => /[01]{8}/.test(l))).toBe(true);
                }
            }
        }
    });
});
