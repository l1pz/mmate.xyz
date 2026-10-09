import { type BorderStyle, borders } from "./borders";
import Card from "./card";
import blog from "./features/blog";

export const CARD_WIDTH = 41;
export const CARD_HEIGHT = 32;

/**
 * The home page cards, keyed by the id of the element each one is rendered into. `initAscii()` must have run.
 * The border is hardcoded here (rounded) so the JS cards and the generated <noscript> cards always match.
 */
export function buildHomeCards(border: BorderStyle | null = borders.rounded): Record<string, Card> {
    const make = (title: string, draw: (card: Card) => void) => new Card(CARD_WIDTH, CARD_HEIGHT, title, draw, border);
    return {
        aboutme: make("about me", (card) => {
            card.emptyLine(2);
            card.drawAsciiArtCentered("portrait");
            card.emptyLine(2);
            card.drawTextCentered("máté molnár");
            card.emptyLine(1);
            card.drawTextCentered(`about ${new Date().getFullYear() - 2002} years old`);
            card.emptyLine(1);
            card.drawTextCentered("computer enthusiast");
            card.emptyLine(1);
            card.drawTextCentered("recreational programmer");
            card.drawFooter("i'm proud of you");
        }),
        projects: make("projects", (card) => {
            card.drawAsciiArtCentered("escher");
            card.emptyLine(3);
            card.drawTextCentered("github", { href: "https://github.com/l1pz/" });
            card.emptyLine(1);
            card.drawTextCentered("experiments", { href: "/experiments/" });
            card.drawFooter("bmljZSBjYXRjaA==");
        }),
        blog: blog.card(CARD_WIDTH, CARD_HEIGHT, border),
        contact: make("contact", (card) => {
            card.drawAsciiArtCentered("phone");
            card.emptyLine(1);
            card.drawTextCentered("phone: +36 xx xxx xxxx");
            card.emptyLine(1);
            card.drawTextCentered("mail: mmateka89@gmail.com", {
                label: "mmateka89@gmail.com",
                href: "mailto:mmateka89@gmail.com",
            });
            card.emptyLine(1);
            card.drawTextCentered("feel free to message me");
            card.drawFooter("0680442044callme");
        }),
        art: make("l'art pour l'art", (card) => {
            card.emptyLine(2);
            card.drawAsciiArtCentered("art");
        }),
    };
}
