import { beforeAll, describe, expect, it } from "vitest";
import { initAscii } from "../src/ascii";
import { HOME_POSTS, renderHome } from "../src/home";
import { assertShell } from "./helpers/shell";

beforeAll(initAscii);

const html = () => renderHome(new Date(2026, 9, 10));

describe("renderHome", () => {
    it("has the whole shell", () => {
        assertShell(html());
        expect(html()).toContain("1000110.XYZ(1)");
        expect(html()).toContain("2026-10-10");
    });

    it("is a session: one command per section, in order", () => {
        const page = html();
        const order = [
            "whoami",
            "cat portrait.txt",
            "ls ~/blog",
            "ls projects/",
            "cat contact.txt",
            "l'art pour l'art",
        ].map((c) => page.indexOf(c));
        expect(
            order.every((i) => i >= 0),
            order.join(),
        ).toBe(true);
        expect([...order].sort((a, b) => a - b)).toEqual(order);
    });

    it("computes the age from the date", () => {
        expect(renderHome(new Date(2026, 9, 10))).toContain("about 24 years old");
        expect(renderHome(new Date(2030, 0, 1))).toContain("about 28 years old");
    });

    it("lists the newest posts with links into the blog, at most HOME_POSTS", () => {
        const page = html();
        expect((page.match(/class="row" href="\/blog\//g) ?? []).length).toBeLessThanOrEqual(HOME_POSTS);
    });

    it("keeps the contact details, with the fake phone number", () => {
        const page = html();
        expect(page).toContain("+36 xx xxx xxxx");
        expect(page).toContain('<a href="mailto:mmateka89@gmail.com">mmateka89@gmail.com</a>');
    });

    it("keeps the three hidden messages", () => {
        const page = html();
        expect(page.match(/class="secret dim"/g)).toHaveLength(3);
        expect(page).toContain("01101001 00100111 01101101 00100000"); // "i'm "
    });

    it("has no cards any more", () => {
        expect(html()).not.toContain('class="card');
    });

    it("draws the art in tight blocks", () => {
        expect(html()).toContain('<pre class="art c-aqua">');
        expect(html().match(/<pre class="art/g)).toHaveLength(2);
    });
});
