import { describe, expect, it } from "vitest";
import { isoDate, renderHomeEnd, renderHomeHead } from "../src/home";

describe("isoDate", () => {
    it("pads month and day, local time", () => {
        expect(isoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
        expect(isoDate(new Date(2026, 9, 10))).toBe("2026-10-10");
    });
});

describe("home shell", () => {
    const head = renderHomeHead(new Date(2026, 9, 10));

    it("has the shared shell parts in order", () => {
        const order = ['class="crumbs"', 'class="man"', "whoami", "máté molnár", "ls cards/"].map((s) =>
            head.indexOf(s),
        );
        expect(order.every((i) => i >= 0)).toBe(true);
        expect([...order].sort((a, b) => a - b)).toEqual(order);
    });

    it("puts the date in the man header", () => {
        expect(head).toContain("1000110.XYZ(1)");
        expect(head).toContain("2026-10-10");
    });

    it("ends with the blinking cursor prompt", () => {
        expect(renderHomeEnd()).toContain('class="cursor"');
    });
});
