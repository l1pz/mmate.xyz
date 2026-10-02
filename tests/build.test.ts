import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Guards against "build passes but the deployed site is broken".
describe("production build", () => {
    it("contains every page and the ASCII art", () => {
        execSync("npx vite build", { stdio: "pipe" });
        expect(existsSync("dist/index.html")).toBe(true);
        expect(existsSync("dist/experiments/index.html")).toBe(true);
        expect(existsSync("dist/experiments/fluiddynamics/index.html")).toBe(true);
        for (const name of ["portrait", "escher", "phone", "wip"]) {
            expect(existsSync(`dist/ascii/${name}.ascii`), name).toBe(true);
        }
        expect(readdirSync("dist/ascii/art").length).toBeGreaterThan(0);
    }, 60_000);
});
