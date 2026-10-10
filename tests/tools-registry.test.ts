import { describe, expect, it } from "vitest";
import { allTools, getPublicTool, loadTool, loadTools, publicTools } from "../src/features/tools/registry";
import { CATEGORIES, type ToolMeta } from "../src/features/tools/types";

const good: ToolMeta = { id: "alpha", title: "alpha tool", category: "text", summary: "does alpha" };
const mod = (id: string, meta: unknown) => ({ [`./tools/${id}/meta.ts`]: { meta } });

describe("loadTools", () => {
    it("accepts a valid tool and returns it", () => {
        expect(loadTools(mod("alpha", good))).toEqual([good]);
    });

    it("sorts by category order, then id", () => {
        const list = loadTools({
            ...mod("zeta", { ...good, id: "zeta", category: "crypto" }),
            ...mod("beta", { ...good, id: "beta", category: "text" }),
            ...mod("alpha", { ...good, id: "alpha", category: "text" }),
        });
        expect(list.map((t) => t.id)).toEqual(["zeta", "alpha", "beta"]);
    });

    it("names the file when a tool is bad", () => {
        expect(() => loadTools(mod("alpha", undefined))).toThrow(/tools\/alpha\/meta\.ts: missing/);
        expect(() => loadTools(mod("alpha", { ...good, id: "beta" }))).toThrow(/must match the folder name "alpha"/);
        expect(() => loadTools(mod("Alpha", { ...good, id: "Alpha" }))).toThrow(/lowercase/);
        expect(() => loadTools(mod("alpha", { ...good, category: "nope" }))).toThrow(/category/);
        expect(() => loadTools(mod("alpha", { ...good, title: "" }))).toThrow(/title/);
        expect(() => loadTools(mod("alpha", { ...good, summary: 3 }))).toThrow(/summary/);
        expect(() => loadTools(mod("alpha", { ...good, access: "secret" }))).toThrow(/access/);
        expect(() => loadTools(mod("alpha", { ...good, secret: "x".repeat(33) }))).toThrow(/secret/);
        expect(() => loadTools({ "./tools/alpha.ts": { meta: good } })).toThrow(/expected tools\/<id>\/meta\.ts/);
    });

    it("rejects a duplicate id", () => {
        const two = { ...mod("alpha", good), "./other/tools/alpha/meta.ts": { meta: good } };
        expect(() => loadTools(two)).toThrow(/duplicate tool id "alpha"/);
    });
});

describe("public and private tools", () => {
    const list: ToolMeta[] = [good, { ...good, id: "hidden", access: "private" }];

    it("lists and opens only public tools (a missing access means public)", () => {
        expect(publicTools(list).map((t) => t.id)).toEqual(["alpha"]);
        expect(getPublicTool("alpha", list)?.id).toBe("alpha");
        expect(getPublicTool("hidden", list)).toBeUndefined();
        expect(getPublicTool("nope", list)).toBeUndefined();
    });
});

describe("the bundled tools", () => {
    it("are valid (loadTools ran at import) and every one has a code module", async () => {
        expect(allTools.length).toBeGreaterThan(0);
        for (const t of allTools) {
            expect(CATEGORIES).toContain(t.category);
            await expect(loadTool(t.id)).resolves.toHaveProperty("mount");
        }
    });

    it("rejects loading a tool that does not exist", async () => {
        await expect(loadTool("nope")).rejects.toThrow(/missing/);
    });
});
