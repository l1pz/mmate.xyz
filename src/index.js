import { initAscii } from './ascii.js';
import Card from './card.js'

document.addEventListener("DOMContentLoaded", main);
async function main() {
    await initAscii();
    const width = 41;
    const height = 32;
    const cardAboutMe = new Card(width, height, "about me", (card) => {
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
        card.emptyLine(2);
        card.drawBinaryTextCentered("i'm proud of you");
    });
    const cardProjects = new Card(width, height, "projects", (card) => {
        card.drawAsciiArtCentered("escher");
        card.emptyLine(3);
        card.drawTextCentered("github", "https://github.com/l1pz/");
        card.emptyLine(1);
        card.drawTextCentered("experiments", "/experiments");
        card.emptyLine(4);
        card.drawBinaryTextCentered("bmljZSBjYXRjaA==");
    });
    const cardContact = new Card(width, height, "contact", (card) => {
        card.drawAsciiArtCentered("phone");
        card.emptyLine(1);
        card.drawTextCentered("phone: +36 xx xxx xxxx");
        card.emptyLine(1);
        card.drawTextCentered("mail: mmateka89@gmail.com", "mmateka89@gmail.com", "mailto:mmateka89@gmail.com");
        card.emptyLine(1);
        card.drawTextCentered("feel free to message me");
        card.emptyLine(1);
        card.drawBinaryTextCentered("0680442044callme");
    });
    const cardArt = new Card(width, height, "l'art pour l'art", (card) => {
        card.emptyLine(2);
        card.drawAsciiArtCentered("art");
    });
    cardAboutMe.render(document.querySelector("#aboutme"));
    cardProjects.render(document.querySelector("#projects"));
    cardContact.render(document.querySelector("#contact"));
    cardArt.render(document.querySelector("#art"));
}