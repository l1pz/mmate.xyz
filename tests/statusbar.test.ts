import { describe, expect, it } from "vitest";
import { formatClock, windowName, windowsHtml } from "../src/statusbar";

describe("windowsHtml", () => {
    const ids = ["aboutme", "projects", "blog"];

    it("numbers the windows from 1 and links each to its card", () => {
        const html = windowsHtml(ids, null);
        expect(html).toContain(
            'href="#aboutme" data-index="0">1:<span class="long">about</span><span class="short">me</span></a>',
        );
        expect(html).toContain('>2:<span class="long">projects</span><span class="short">proj</span></a>');
        expect(html).toContain(">3:blog</a>");
        expect(html).not.toContain("active");
    });

    it("marks the active window with a star and a class", () => {
        const html = windowsHtml(ids, 1);
        expect(html).toContain('class="win active" href="#projects" data-index="1">2:');
        expect(html).toContain('<span class="short">proj</span>*</a>');
        expect(html.match(/active/g)).toHaveLength(1);
    });
});

describe("formatClock", () => {
    it("pads hours and minutes", () => {
        expect(formatClock(new Date(2026, 9, 9, 7, 5))).toBe("07:05");
        expect(formatClock(new Date(2026, 9, 9, 23, 41))).toBe("23:41");
    });
});

describe("windowName", () => {
    it("shortens aboutme and keeps other ids", () => {
        expect(windowName("aboutme")).toBe("about");
        expect(windowName("contact")).toBe("contact");
    });
});
