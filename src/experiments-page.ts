import { escapeHtml } from "./core/html";
import { pages } from "./core/site";

/** The `/experiments/` listing: one row per page under it in the site map. */
export function experimentRows(): string {
    const rows = pages
        .filter((p) => p.parent === "experiments")
        .map(
            (p) =>
                `<a class="row" href="${escapeHtml(p.path)}">${escapeHtml(p.name)}/${p.note ? ` <span class="dim">(${escapeHtml(p.note)})</span>` : ""}</a>`,
        );
    return rows.length ? rows.join("\n") : '<p class="dim">(nothing here yet)</p>';
}
