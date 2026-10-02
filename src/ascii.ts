// ASCII art is bundled into the JS at build time (no runtime fetching).
const files = import.meta.glob("./ascii-art/**/*.ascii", { query: "?raw", import: "default", eager: true }) as Record<
    string,
    string
>;

export const ascii: Record<string, string> = {};
export const gallery: string[] = [];

for (const [path, text] of Object.entries(files)) {
    const name = path.replace("./ascii-art/", "").replace(".ascii", "");
    if (name.startsWith("art/")) gallery.push(text);
    else ascii[name] = text;
}

/** Picks a random piece for the "art" card. */
export function initAscii(): void {
    ascii.art = gallery[Math.floor(Math.random() * gallery.length)];
}
