export type CaseMode =
    | "upper"
    | "lower"
    | "title"
    | "sentence"
    | "camel"
    | "pascal"
    | "snake"
    | "constant"
    | "kebab"
    | "dot";

export const MODES: readonly { id: CaseMode; label: string }[] = [
    { id: "upper", label: "UPPER" },
    { id: "lower", label: "lower" },
    { id: "title", label: "Title Case" },
    { id: "sentence", label: "Sentence case" },
    { id: "camel", label: "camelCase" },
    { id: "pascal", label: "PascalCase" },
    { id: "snake", label: "snake_case" },
    { id: "constant", label: "CONSTANT_CASE" },
    { id: "kebab", label: "kebab-case" },
    { id: "dot", label: "dot.case" },
];

/** Words of an identifier or phrase: splits on anything that is not a letter or digit, and at camelCase borders. */
export function splitWords(text: string): string[] {
    return text
        .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
        .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean);
}

const capital = (word: string) => {
    const [first = "", ...rest] = [...word];
    return first.toUpperCase() + rest.join("").toLowerCase();
};

/** Joins the words of one line in an identifier style. */
function identifier(line: string, mode: CaseMode): string {
    const words = splitWords(line);
    switch (mode) {
        case "camel":
            return words.map((w, i) => (i === 0 ? w.toLowerCase() : capital(w))).join("");
        case "pascal":
            return words.map(capital).join("");
        case "snake":
            return words.join("_").toLowerCase();
        case "constant":
            return words.join("_").toUpperCase();
        case "kebab":
            return words.join("-").toLowerCase();
        default:
            return words.join(".").toLowerCase();
    }
}

/**
 * Converts `text` to `mode`. UPPER, lower, Title and Sentence keep the text as it is (spaces, punctuation, line
 * breaks); the identifier styles convert each line on its own, so a list of names converts in one go.
 */
export function convertCase(text: string, mode: CaseMode): string {
    switch (mode) {
        case "upper":
            return text.toUpperCase();
        case "lower":
            return text.toLowerCase();
        case "title":
            return text
                .toLowerCase()
                .replace(/(^|[^\p{L}\p{N}'])(\p{L})/gu, (_, sep: string, c: string) => sep + c.toUpperCase());
        case "sentence":
            return text
                .toLowerCase()
                .replace(/(^|[.!?]\s+|\n)(\p{L})/gu, (_, sep: string, c: string) => sep + c.toUpperCase());
        default:
            return text
                .split("\n")
                .map((line) => identifier(line, mode))
                .join("\n");
    }
}
