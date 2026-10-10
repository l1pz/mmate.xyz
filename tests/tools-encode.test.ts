import { describe, expect, it } from "vitest";
import { CODECS, CodecError, type CodecId, run } from "../src/features/tools/tools/encode/codec";

const enc = (id: CodecId, text: string, variant?: string) => run(id, "encode", text, variant).text;
const dec = (id: CodecId, text: string, variant?: string) => run(id, "decode", text, variant);

describe("known vectors", () => {
    it("encodes Hello", () => {
        expect(enc("binary", "Hello")).toBe("01001000 01100101 01101100 01101100 01101111");
        expect(enc("hex", "Hello")).toBe("48 65 6c 6c 6f");
        expect(enc("base64", "Hello")).toBe("SGVsbG8=");
        expect(enc("rot13", "Hello")).toBe("Uryyb");
        expect(enc("morse", "SOS")).toBe("... --- ...");
    });
});

describe("round trips", () => {
    const text = 'héllo 🌍 <a href="x">&\'';
    it("bytes codecs keep UTF-8 text", () => {
        for (const id of ["binary", "hex", "base64"] as const) {
            expect(dec(id, enc(id, text)).text, id).toBe(text);
        }
    });
    it("rot13, url and html round trip", () => {
        for (const id of ["rot13", "url", "html"] as const) {
            expect(dec(id, enc(id, text)).text, id).toBe(text);
        }
    });
    it("every variant round trips", () => {
        for (const codec of CODECS) {
            for (const v of codec.variants ?? []) {
                expect(dec(codec.id, enc(codec.id, text, v.id), v.id).text, `${codec.id}/${v.id}`).toBe(text);
            }
        }
    });
    it("morse round trips as upper case", () => {
        expect(dec("morse", enc("morse", "hello world 42?")).text).toBe("HELLO WORLD 42?");
        expect(enc("morse", "hi there")).toBe(".... .. / - .... . .-. .");
    });
});

describe("binary and hex", () => {
    it("accepts unbroken binary", () => {
        expect(dec("binary", "0100100001101001").text).toBe("Hi");
    });
    it("rejects bad binary", () => {
        expect(() => dec("binary", "0100 12")).toThrow(CodecError);
        expect(() => dec("binary", "0100")).toThrow(CodecError);
    });
    it("hex variants and tolerant input", () => {
        expect(enc("hex", "Hi", "upper")).toBe("48 69");
        expect(enc("hex", "ÿ", "upper")).toBe("C3 BF");
        expect(enc("hex", "Hi", "compact")).toBe("4869");
        expect(dec("hex", "0x48, 0x69").text).toBe("Hi");
        expect(dec("hex", "4869").text).toBe("Hi");
    });
    it("rejects bad hex", () => {
        expect(() => dec("hex", "4g")).toThrow(CodecError);
        expect(() => dec("hex", "486")).toThrow(CodecError);
    });
    it("empty input gives empty output", () => {
        for (const id of ["binary", "hex", "base64", "morse"] as const) {
            expect(enc(id, "")).toBe("");
            expect(dec(id, "").text).toBe("");
        }
    });
});

describe("base64", () => {
    it("url-safe output has no + / =", () => {
        expect(enc("base64", "ûÿ", "standard")).toBe("w7vDvw==");
        expect(enc("base64", "???>>>", "urlsafe")).toBe("Pz8_Pj4-");
        expect(enc("base64", "???>>>", "standard")).toBe("Pz8/Pj4+");
    });
    it("decodes both alphabets, no padding and whitespace", () => {
        expect(dec("base64", "Pz8_Pj4-").text).toBe("???>>>");
        expect(dec("base64", "Pz8/Pj4+").text).toBe("???>>>");
        expect(dec("base64", "SGVs\nbG8").text).toBe("Hello");
    });
    it("rejects bad input", () => {
        expect(() => dec("base64", "SGV$")).toThrow(CodecError);
        expect(() => dec("base64", "S")).toThrow(CodecError);
    });
    it("falls back to hex for bytes that are not UTF-8", () => {
        const result = dec("base64", "/9j/"); // 0xff 0xd8 0xff, a JPEG header
        expect(result.text).toBe("ff d8 ff");
        expect(result.note).toMatch(/UTF-8/);
        expect(dec("hex", "ff").note).toMatch(/UTF-8/);
        expect(dec("base64", "SGVsbG8=").note).toBeUndefined();
    });
});

describe("rot13", () => {
    it("is its own inverse and keeps non-letters", () => {
        expect(enc("rot13", "Why, 42?")).toBe("Jul, 42?");
        expect(dec("rot13", "Jul, 42?").text).toBe("Why, 42?");
    });
});

describe("url", () => {
    const text = "a b/c?d=é&e";
    it("component, full and form differ", () => {
        expect(enc("url", text, "component")).toBe("a%20b%2Fc%3Fd%3D%C3%A9%26e");
        expect(enc("url", text, "full")).toBe("a%20b/c?d=%C3%A9&e");
        expect(enc("url", text, "form")).toBe("a+b%2Fc%3Fd%3D%C3%A9%26e");
    });
    it("form decode turns + into a space, component does not", () => {
        expect(dec("url", "a+b", "form").text).toBe("a b");
        expect(dec("url", "a+b", "component").text).toBe("a+b");
        expect(dec("url", "a%2Fb", "full").text).toBe("a%2Fb");
    });
    it("rejects a malformed escape", () => {
        expect(() => dec("url", "100%")).toThrow(CodecError);
        expect(() => enc("url", "\ud800")).toThrow(CodecError);
    });
});

describe("html entities", () => {
    it("encodes the five specials", () => {
        expect(enc("html", `<a href="x">'&`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;");
    });
    it("decodes named and numeric entities in one pass", () => {
        expect(dec("html", "&lt;b&gt; &amp;lt; &#233; &#xE9; &#x1F30D; &nbsp;").text).toBe("<b> &lt; é é 🌍  ");
    });
    it("leaves unknown or invalid entities alone", () => {
        expect(dec("html", "&bogus; &#99999999; &#xD800; &").text).toBe("&bogus; &#99999999; &#xD800; &");
    });
});

describe("morse", () => {
    it("rejects characters and codes it does not know", () => {
        expect(() => enc("morse", "é")).toThrow(CodecError);
        expect(() => dec("morse", "...-.-.-.-")).toThrow(CodecError);
    });
    it("decodes with loose spacing around the word separator", () => {
        expect(dec("morse", "....  ..  /-  .... . .-. .").text).toBe("HI THERE");
    });
});

describe("run", () => {
    it("falls back to the default variant", () => {
        expect(enc("base64", "???>>>", "nope")).toBe("Pz8/Pj4+");
        expect(enc("hex", "Hi")).toBe("48 69");
    });
});
