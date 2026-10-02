import { expect, it } from "vitest";
import { ascii, initAscii } from "../src/ascii";

it("bundles all ASCII art", () => {
    initAscii();
    for (const name of ["portrait", "escher", "phone", "wip", "art"]) {
        expect(ascii[name]?.length, name).toBeGreaterThan(0);
    }
});
