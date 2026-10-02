import { describe, expect, it } from "vitest";
import { borderNames, defaultBorder } from "../src/borders";
import { loadBorder, nextBorder, saveBorder } from "../src/settings";

const memoryStore = (initial: Record<string, string> = {}) => {
    const data = { ...initial };
    return {
        getItem: (k: string) => data[k] ?? null,
        setItem: (k: string, v: string) => {
            data[k] = v;
        },
    };
};

describe("border setting", () => {
    it("cycles through every style and wraps around", () => {
        let name = borderNames[0];
        const seen = [name];
        for (let i = 1; i < borderNames.length; i++) {
            name = nextBorder(name);
            seen.push(name);
        }
        expect(seen).toEqual(borderNames);
        expect(nextBorder(name)).toBe(borderNames[0]);
    });

    it("defaults when nothing or garbage is stored", () => {
        expect(loadBorder(memoryStore())).toBe(defaultBorder);
        expect(loadBorder(memoryStore({ border: "nonsense" }))).toBe(defaultBorder);
        expect(loadBorder(undefined)).toBe(defaultBorder);
    });

    it("saves and loads a style", () => {
        const store = memoryStore();
        saveBorder("double", store);
        expect(loadBorder(store)).toBe("double");
    });

    it("survives a broken storage", () => {
        const broken = {
            getItem: () => {
                throw new Error("blocked");
            },
            setItem: () => {
                throw new Error("blocked");
            },
        };
        expect(loadBorder(broken)).toBe(defaultBorder);
        expect(() => saveBorder("single", broken)).not.toThrow();
    });
});
