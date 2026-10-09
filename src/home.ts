/**
 * The home page (DESIGN.md "session" pattern): one command per section, left aligned, hidden messages kept at the
 * end of the sections that had them. Built by the page frame like every other page. `initAscii()` must have run
 * (it picks the random art piece at the end).
 */
import { ascii } from "./ascii";
import { escapeHtml } from "./core/html";
import { isoDate, promptLine, renderPage, secretBlock } from "./core/shell";
import { getPage } from "./core/site";
import { getPosts } from "./features/blog/posts";
import { postRows } from "./features/blog/rows";

/** How many posts the home page lists. */
export const HOME_POSTS = 5;

/** ASCII art in its own tight `<pre>` (no extra line spacing); `color` is a `c-*` class from card.css. */
const art = (text: string, color?: string) => `<pre class="art${color ? ` c-${color}` : ""}">${escapeHtml(text)}</pre>`;

/** A command, its output, and an optional hidden message under it. */
const section = (command: string, output: string, secret?: string) =>
    [promptLine(command), output, ...(secret ? [secretBlock(secret)] : [])].join("\n");

export function renderHome(date: Date): string {
    const age = date.getFullYear() - 2002;
    const mail = "mmateka89@gmail.com";
    const sections = [
        `<p><span class="name">máté molnár</span><br><span class="dim">computer enthusiast, recreational programmer, about ${age} years old</span></p>`,
        section("cat portrait.txt", art(ascii.portrait, "aqua"), "i'm proud of you"),
        section("ls ~/blog", postRows(getPosts().slice(0, HOME_POSTS), "/blog/")),
        section(
            "ls projects/",
            '<a class="row" href="https://github.com/l1pz/">github</a>\n<a class="row" href="/experiments/">experiments/</a>',
            "bmljZSBjYXRjaA==",
        ),
        section(
            "cat contact.txt",
            `<p>phone: +36 xx xxx xxxx<br>mail: <a href="mailto:${mail}">${mail}</a><br><span class="dim">feel free to message me</span></p>`,
            "0680442044callme",
        ),
        section(`echo "l'art pour l'art"`, art(ascii.art)),
    ];
    return renderPage({
        page: getPage("home"),
        command: "whoami",
        date: isoDate(date),
        body: sections.join("\n"),
    });
}
