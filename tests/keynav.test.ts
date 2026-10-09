import { describe, expect, it } from "vitest";
import { type Box, keyAction, moveFocus } from "../src/keynav";

const box = (col: number, row: number): Box => ({ left: col * 100, top: row * 100, width: 80, height: 80 });
// 5 cards in a 2 column grid:   0 1
//                               2 3
//                               4
const grid2 = [box(0, 0), box(1, 0), box(0, 1), box(1, 1), box(0, 2)];
const column = [box(0, 0), box(0, 1), box(0, 2)];
const row = [box(0, 0), box(1, 0), box(2, 0), box(3, 0)];

describe("moveFocus", () => {
    it("starts at the first card when nothing is focused", () => {
        expect(moveFocus(grid2, null, "down")).toBe(0);
        expect(moveFocus(grid2, null, "left")).toBe(0);
    });

    it("moves through a 2 column grid in all four directions", () => {
        expect(moveFocus(grid2, 0, "right")).toBe(1);
        expect(moveFocus(grid2, 0, "down")).toBe(2);
        expect(moveFocus(grid2, 3, "left")).toBe(2);
        expect(moveFocus(grid2, 3, "up")).toBe(1);
        expect(moveFocus(grid2, 2, "down")).toBe(4);
    });

    it("stays in its column or row instead of jumping diagonally", () => {
        expect(moveFocus(grid2, 1, "down")).toBe(3);
        expect(moveFocus(grid2, 2, "right")).toBe(3);
    });

    it("stays put at the edges", () => {
        expect(moveFocus(grid2, 0, "left")).toBe(0);
        expect(moveFocus(grid2, 0, "up")).toBe(0);
        expect(moveFocus(grid2, 1, "right")).toBe(1);
        expect(moveFocus(grid2, 4, "down")).toBe(4);
    });

    it("works with one column and with one row", () => {
        expect(moveFocus(column, 0, "down")).toBe(1);
        expect(moveFocus(column, 2, "up")).toBe(1);
        expect(moveFocus(column, 1, "right")).toBe(1);
        expect(moveFocus(row, 1, "right")).toBe(2);
        expect(moveFocus(row, 1, "left")).toBe(0);
    });

    it("reaches the card below even when the last row is short", () => {
        expect(moveFocus(grid2, 3, "down")).toBe(4); // closest card below, drifting left
    });
});

describe("keyAction", () => {
    it("always handles h j k l", () => {
        expect(keyAction("h", false, 5)).toEqual({ type: "move", dir: "left" });
        expect(keyAction("j", false, 5)).toEqual({ type: "move", dir: "down" });
        expect(keyAction("k", true, 5)).toEqual({ type: "move", dir: "up" });
        expect(keyAction("l", false, 5)).toEqual({ type: "move", dir: "right" });
    });

    it("leaves the arrow keys to the browser until a card is focused", () => {
        expect(keyAction("ArrowDown", false, 5)).toBeNull();
        expect(keyAction("ArrowDown", true, 5)).toEqual({ type: "move", dir: "down" });
    });

    it("jumps with number keys, only to cards that exist", () => {
        expect(keyAction("3", false, 5)).toEqual({ type: "jump", index: 2 });
        expect(keyAction("6", false, 5)).toBeNull();
        expect(keyAction("0", false, 5)).toBeNull();
    });

    it("opens and clears only while a card is focused", () => {
        expect(keyAction("Enter", false, 5)).toBeNull();
        expect(keyAction("Escape", false, 5)).toBeNull();
        expect(keyAction("Enter", true, 5)).toEqual({ type: "open" });
        expect(keyAction("Escape", true, 5)).toEqual({ type: "clear" });
    });

    it("ignores other keys", () => {
        expect(keyAction("x", true, 5)).toBeNull();
        expect(keyAction(" ", true, 5)).toBeNull();
    });
});
