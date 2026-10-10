import { describe, expect, it } from "vitest";
import { convertCase, splitWords } from "../src/features/tools/tools/case/convert";

describe("splitWords", () => {
    it("splits on separators and at camelCase borders", () => {
        expect(splitWords("hello world")).toEqual(["hello", "world"]);
        expect(splitWords("fooBar_baz-qux.quux")).toEqual(["foo", "Bar", "baz", "qux", "quux"]);
        expect(splitWords("HTTPServerError")).toEqual(["HTTP", "Server", "Error"]);
        expect(splitWords("version2Beta")).toEqual(["version2", "Beta"]);
        expect(splitWords("  --  ")).toEqual([]);
    });

    it("keeps accented letters in words", () => {
        expect(splitWords("máté_molnár")).toEqual(["máté", "molnár"]);
    });
});

describe("convertCase", () => {
    const text = "Hello, brave new_world";

    it("changes the letters but not the layout for upper, lower, title and sentence", () => {
        expect(convertCase(text, "upper")).toBe("HELLO, BRAVE NEW_WORLD");
        expect(convertCase(text, "lower")).toBe("hello, brave new_world");
        expect(convertCase("the quick brown fox", "title")).toBe("The Quick Brown Fox");
        expect(convertCase("don't STOP", "title")).toBe("Don't Stop");
        expect(convertCase("one. TWO! three?\nfour", "sentence")).toBe("One. Two! Three?\nFour");
    });

    it("builds the identifier styles", () => {
        expect(convertCase(text, "camel")).toBe("helloBraveNewWorld");
        expect(convertCase(text, "pascal")).toBe("HelloBraveNewWorld");
        expect(convertCase(text, "snake")).toBe("hello_brave_new_world");
        expect(convertCase(text, "constant")).toBe("HELLO_BRAVE_NEW_WORLD");
        expect(convertCase(text, "kebab")).toBe("hello-brave-new-world");
        expect(convertCase(text, "dot")).toBe("hello.brave.new.world");
    });

    it("converts identifier styles line by line", () => {
        expect(convertCase("fooBar\nbaz qux", "snake")).toBe("foo_bar\nbaz_qux");
        expect(convertCase("", "camel")).toBe("");
    });

    it("round trips between styles", () => {
        expect(convertCase(convertCase("someVariableName", "snake"), "camel")).toBe("someVariableName");
        expect(convertCase(convertCase("some-css-class", "pascal"), "kebab")).toBe("some-css-class");
    });
});
