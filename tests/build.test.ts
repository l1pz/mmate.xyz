import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Guards against "build passes but the deployed site is broken".
describe("production build", () => {
    it("contains every page", () => {
        execSync("npx vite build", { stdio: "pipe" });
        expect(existsSync("dist/index.html")).toBe(true);
        expect(existsSync("dist/experiments/index.html")).toBe(true);
        expect(existsSync("dist/experiments/fluiddynamics/index.html")).toBe(true);
    }, 60_000);
});
