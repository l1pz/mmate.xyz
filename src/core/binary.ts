/**
 * Text as 8-bit binary groups, `perLine` bytes per line (space padded so the last line is full).
 * Used for the hidden messages: card footers and the page `secret`.
 */
export function binaryLines(text: string, perLine: number): string[] {
    const padded = text.padEnd(Math.ceil(text.length / perLine) * perLine, " ");
    const bytes = Array.from(padded, (c) => c.charCodeAt(0).toString(2).padStart(8, "0"));
    const lines: string[] = [];
    for (let i = 0; i < bytes.length; i += perLine) lines.push(bytes.slice(i, i + perLine).join(" "));
    return lines;
}
