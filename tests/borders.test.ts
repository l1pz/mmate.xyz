import { beforeAll, describe, expect, it } from "vitest";
import { ascii } from "../src/ascii";
import { borderNames, borders } from "../src/borders";
import Card from "../src/card";

beforeAll(() => {
    ascii["wide"] = "x".repeat(10);
});

const lines = (card: Card) => card.toString().split("\n").slice(0, -1);

describe("border styles", () => {
    it("lists none first and keeps the default plain", () => {
        expect(borderNames[0]).toBe("none");
        expect(borders.none).toBeNull();
    });

    it("every style is made of single characters", () => {
        for (const style of Object.values(borders)) {
            if (!style) continue;
            for (const c of Object.values(style)) expect([...c]).toHaveLength(1);
        }
    });
});

describe("Card borders", () => {
    it("draws nothing without a border (same output as before)", () => {
        const plain = lines(new Card(11, 6, "t", () => {}));
        expect(plain.every((l) => l.trim() === "" || l.trim() === "t")).toBe(true);
    });

    it("frames the outer rows and columns and puts a divider under the title", () => {
        const l = lines(new Card(11, 6, "hi", () => {}, borders.retro));
        expect(l).toEqual(["0---------0", "|   hi    |", "0---------0", "|         |", "|         |", "0---------0"]);
    });

    it("keeps content inside the frame", () => {
        const l = lines(new Card(11, 6, "t", (c) => c.drawTextCentered("ok"), borders.ascii));
        expect(l[3]).toBe("|   ok    |");
    });

    it("every style keeps the grid size", () => {
        for (const style of Object.values(borders)) {
            const l = lines(new Card(41, 32, "title", () => {}, style));
            expect(l).toHaveLength(32);
            expect(l.every((row) => [...row].length === 41)).toBe(true);
        }
    });

    it("throws if content overlaps the frame", () => {
        expect(() => new Card(10, 8, "t", (c) => c.drawAsciiArtCentered("wide"), borders.ascii)).toThrow(
            /overlaps the border/,
        );
        expect(() => new Card(10, 5, "t", (c) => c.emptyLine(1), borders.ascii)).not.toThrow();
        expect(
            () =>
                new Card(
                    10,
                    5,
                    "t",
                    (c) => {
                        c.emptyLine(1);
                        c.drawTextCentered("x");
                    },
                    borders.ascii,
                ),
        ).toThrow(/overlaps the border/); // row 4 is the bottom frame row
    });
});
