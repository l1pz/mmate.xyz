/** The home page shell around the card grid (DESIGN.md): crumbs, man header, `$ whoami`, `$ ls cards/`, end prompt. */
import { crumbs, endPrompt, isoDate, manHeader, promptLine } from "./core/shell";

export { isoDate } from "./core/shell";

/** Everything above the cards. */
export function renderHomeHead(date: Date): string {
    return [
        crumbs([{ label: "1000110.xyz" }]),
        manHeader("1000110.xyz", "home", isoDate(date)),
        promptLine("whoami"),
        '<p><span class="name">máté molnár</span><br><span class="dim">this is my cyberdeck: cards, a blog and experiments</span></p>',
        promptLine("ls cards/"),
    ].join("\n");
}

/** Everything below the cards. */
export const renderHomeEnd = endPrompt;
