/** Pure encode / decode logic for the playground: no DOM, so tests call it directly. */

export type CodecId = "binary" | "hex" | "base64" | "rot13" | "url" | "html" | "morse";
export type Direction = "encode" | "decode";

export interface Variant {
    id: string;
    label: string;
}

/** `note` explains a result that is not plain text (e.g. bytes shown as hex). */
export interface Result {
    text: string;
    note?: string;
}

export interface Codec {
    id: CodecId;
    label: string;
    /** The first variant is the default. */
    variants?: readonly Variant[];
    encode(text: string, variant: string): string;
    decode(text: string, variant: string): Result;
}

/** A readable decode (or encode) failure; the page shows the message instead of throwing. */
export class CodecError extends Error {}

const encoder = new TextEncoder();

function toBytes(text: string): Uint8Array {
    return encoder.encode(text);
}

function hexOf(bytes: Uint8Array): string {
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(" ");
}

/** UTF-8 text, or the bytes as hex when they are not valid UTF-8 (an image, gzip, ...). */
function fromBytes(bytes: Uint8Array): Result {
    try {
        return { text: new TextDecoder("utf-8", { fatal: true }).decode(bytes) };
    } catch {
        return { text: hexOf(bytes), note: "not valid UTF-8, shown as hex" };
    }
}

// binary

const binary: Codec = {
    id: "binary",
    label: "binary",
    encode: (text) => Array.from(toBytes(text), (b) => b.toString(2).padStart(8, "0")).join(" "),
    decode(text) {
        const bits = text.replace(/\s+/g, "");
        if (!/^[01]*$/.test(bits)) throw new CodecError("only 0 and 1 are allowed");
        if (bits.length % 8 !== 0) throw new CodecError("length must be a multiple of 8 bits");
        const bytes = new Uint8Array(bits.length / 8);
        for (let i = 0; i < bytes.length; i++) bytes[i] = Number.parseInt(bits.slice(i * 8, i * 8 + 8), 2);
        return fromBytes(bytes);
    },
};

// hex

const hex: Codec = {
    id: "hex",
    label: "hex",
    variants: [
        { id: "lower", label: "lower" },
        { id: "upper", label: "upper" },
        { id: "compact", label: "compact" },
    ],
    encode(text, variant) {
        const spaced = hexOf(toBytes(text));
        if (variant === "upper") return spaced.toUpperCase();
        if (variant === "compact") return spaced.replace(/ /g, "");
        return spaced;
    },
    decode(text) {
        const digits = text.replace(/0x|[\s,]/gi, "");
        if (!/^[0-9a-f]*$/i.test(digits)) throw new CodecError("only 0-9 and a-f are allowed");
        if (digits.length % 2 !== 0) throw new CodecError("needs an even number of digits");
        const bytes = new Uint8Array(digits.length / 2);
        for (let i = 0; i < bytes.length; i++) bytes[i] = Number.parseInt(digits.slice(i * 2, i * 2 + 2), 16);
        return fromBytes(bytes);
    },
};

// base64

const base64: Codec = {
    id: "base64",
    label: "base64",
    variants: [
        { id: "standard", label: "standard" },
        { id: "urlsafe", label: "url-safe" },
    ],
    encode(text, variant) {
        let binaryString = "";
        for (const b of toBytes(text)) binaryString += String.fromCharCode(b);
        const out = btoa(binaryString);
        return variant === "urlsafe" ? out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : out;
    },
    decode(text) {
        // Both alphabets and missing padding are accepted, whatever the variant button says.
        const clean = text.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
        if (!/^[A-Za-z0-9+/]*$/.test(clean)) throw new CodecError("not a Base64 string");
        if (clean.length % 4 === 1) throw new CodecError("invalid Base64 length");
        const binaryString = atob(clean + "=".repeat((4 - (clean.length % 4)) % 4));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < bytes.length; i++) bytes[i] = binaryString.charCodeAt(i);
        return fromBytes(bytes);
    },
};

// rot13

function rot13(text: string): string {
    return text.replace(/[a-z]/gi, (c) => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
}

const rot13Codec: Codec = {
    id: "rot13",
    label: "rot13",
    encode: rot13,
    decode: (text) => ({ text: rot13(text) }),
};

// url

const url: Codec = {
    id: "url",
    label: "url",
    variants: [
        { id: "component", label: "component" },
        { id: "full", label: "full url" },
        { id: "form", label: "form (+)" },
    ],
    encode(text, variant) {
        try {
            if (variant === "full") return encodeURI(text);
            const out = encodeURIComponent(text);
            return variant === "form" ? out.replace(/%20/g, "+") : out;
        } catch {
            throw new CodecError("text has a lone surrogate and cannot be encoded");
        }
    },
    decode(text, variant) {
        try {
            if (variant === "full") return { text: decodeURI(text) };
            return { text: decodeURIComponent(variant === "form" ? text.replace(/\+/g, " ") : text) };
        } catch {
            throw new CodecError("malformed % escape");
        }
    },
};

// html entities

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

const html: Codec = {
    id: "html",
    label: "html",
    encode: (text) =>
        text.replace(
            /[&<>"']/g,
            (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
        ),
    // One pass, so "&amp;lt;" becomes "&lt;" and not "<".
    decode: (text) => ({
        text: text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, body: string) => {
            if (body[0] !== "#") return NAMED[body.toLowerCase()] ?? whole;
            const code =
                body[1].toLowerCase() === "x" ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10);
            const valid = code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff);
            return valid ? String.fromCodePoint(code) : whole;
        }),
    }),
};

// morse

const MORSE: Record<string, string> = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    _: "..--.-",
    '"': ".-..-.",
    $: "...-..-",
    "@": ".--.-.",
};

const FROM_MORSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([ch, code]) => [code, ch]));

const morse: Codec = {
    id: "morse",
    label: "morse",
    encode(text) {
        return text
            .trim()
            .toUpperCase()
            .split(/\s+/)
            .filter(Boolean)
            .map((word) =>
                Array.from(word, (ch) => {
                    const code = MORSE[ch];
                    if (!code) throw new CodecError(`no Morse code for "${ch}"`);
                    return code;
                }).join(" "),
            )
            .join(" / ");
    },
    decode(text) {
        const words = text.trim() === "" ? [] : text.trim().split(/\s*\/\s*/);
        return {
            text: words
                .map((word) =>
                    word
                        .split(/\s+/)
                        .filter(Boolean)
                        .map((code) => {
                            const ch = FROM_MORSE[code];
                            if (!ch) throw new CodecError(`unknown Morse code "${code}"`);
                            return ch;
                        })
                        .join(""),
                )
                .join(" "),
        };
    },
};

export const CODECS: readonly Codec[] = [binary, hex, base64, rot13Codec, url, html, morse];

export function getCodec(id: CodecId): Codec {
    const codec = CODECS.find((c) => c.id === id);
    if (!codec) throw new Error(`unknown codec: ${id}`);
    return codec;
}

/** An unknown or missing variant falls back to the codec's first one. */
export function run(id: CodecId, direction: Direction, text: string, variant?: string): Result {
    const codec = getCodec(id);
    const chosen = codec.variants?.find((v) => v.id === variant)?.id ?? codec.variants?.[0].id ?? "";
    return direction === "encode" ? { text: codec.encode(text, chosen) } : codec.decode(text, chosen);
}
