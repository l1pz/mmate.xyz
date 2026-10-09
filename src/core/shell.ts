/**
 * The shell every page shares (see DESIGN.md): crumbs, a man-page header, `$ command` prompt lines and an end
 * prompt with a blinking cursor. Pure functions returning HTML; styles are in `styles/shell.css`.
 */
import { binaryLines } from "./binary";
import { escapeHtml } from "./html";
import { crumbTrail, type SitePage } from "./site";

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

const two = (n: number) => String(n).padStart(2, "0");

/** `2026-10-10`, local time. */
export const isoDate = (d: Date) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;

/** Bytes per line of a hidden message: 4 bytes is 35 columns, which fits a 40 column phone. */
export const SECRET_BYTES = 4;

/** A hidden message: dim binary, hidden from screen readers, with no hint that it is there. */
export function secretBlock(text: string): string {
    return `<p class="secret dim" aria-hidden="true">${binaryLines(text, SECRET_BYTES).join("<br>")}</p>`;
}

export interface PageSpec {
    page: SitePage;
    /** The `$ command` that "produced" the page. */
    command: string;
    /** The page's own content: the only part page code writes. */
    body: string;
    /** Man header date (`YYYY-MM-DD`): the page's own date, or today. */
    date: string;
    /** Crumbs; defaults to the trail for `page`. */
    trail?: Crumb[];
    /** Man header name; defaults to the page's name. */
    name?: string;
    /** Optional hidden binary message shown above the end prompt. */
    secret?: string;
}

/**
 * The page frame (DESIGN.md section 8.2). Every page, JS or `<noscript>`, is built by this one function, so none
 * can leave a part out: crumbs, man header, the `$ command`, the body, an optional secret, the end prompt.
 */
export function renderPage(spec: PageSpec): string {
    const { page } = spec;
    return [
        crumbs(spec.trail ?? crumbTrail(page)),
        manHeader(spec.name ?? page.name, page.section, spec.date),
        promptLine(spec.command),
        spec.body,
        ...(spec.secret ? [secretBlock(spec.secret)] : []),
        endPrompt(),
    ].join("\n");
}
