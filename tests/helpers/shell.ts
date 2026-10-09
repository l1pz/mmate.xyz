import { expect } from "vitest";

/**
 * Asserts that `html` has every part of the page frame (DESIGN.md 8.2) in order:
 * crumbs, man header, a `$ command` prompt, the body, then the end prompt with the cursor last.
 * Every page renderer in the test suite goes through this, so a page cannot silently lose a part.
 */
export function assertShell(html: string): void {
    const at = (needle: string) => html.indexOf(needle);
    const crumbs = at('class="crumbs"');
    const man = at('class="man"');
    const prompt = at('class="prompt"');
    const cursor = html.lastIndexOf('class="cursor"');
    expect(crumbs, "crumbs").toBeGreaterThanOrEqual(0);
    expect(man, "man header").toBeGreaterThan(crumbs);
    expect(prompt, "command prompt").toBeGreaterThan(man);
    expect(cursor, "end prompt cursor").toBeGreaterThan(prompt);
    // The end prompt is the last thing on the page.
    expect(html.slice(cursor).match(/<p /g) ?? [], "nothing after the end prompt").toHaveLength(0);
}
