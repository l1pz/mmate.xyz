/**
 * The shell every page shares (see DESIGN.md): crumbs, a man-page header, `$ command` prompt lines and an end
 * prompt with a blinking cursor. Pure functions returning HTML; styles are in `styles/shell.css`.
 */
import { escapeHtml } from "./html";

export interface Crumb {
    label: string;
    /** Left out for the last crumb (the page you are on). */
    href?: string;
}

/** `1000110.xyz / blog / hello-world`, each part with an `href` a link. */
export function crumbs(trail: Crumb[]): string {
    const parts = trail.map((c) =>
        c.href === undefined ? escapeHtml(c.label) : `<a href="${escapeHtml(c.href)}">${escapeHtml(c.label)}</a>`,
    );
    return `<nav class="crumbs">${parts.join(" / ")}</nav>`;
}

/** `NAME(1)    section    date`, like the top line of a man page. */
export function manHeader(name: string, section: string, date: string): string {
    return `<header class="man"><span>${escapeHtml(name.toUpperCase())}(1)</span><span>${escapeHtml(section)}</span><span>${escapeHtml(date)}</span></header>`;
}

/** `$ command`: the `$` is dim, the command green. */
export function promptLine(command: string): string {
    return `<p class="prompt"><span class="dim">$</span> ${escapeHtml(command)}</p>`;
}

/** The last line of a page: an empty prompt with a blinking cursor. */
export function endPrompt(): string {
    return '<p class="prompt"><span class="dim">$</span> <span class="cursor"></span></p>';
}
