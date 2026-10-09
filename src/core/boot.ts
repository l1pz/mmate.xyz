import { bindKeys } from "./keys";
import type { SitePage } from "./site";
import { mountStatusLine } from "./statusline";

/**
 * What every page does once it has drawn its content: the shared status line (windows, clock, progress) into
 * `#status` and the shared keys. Returns `update` for the status line.
 */
export function bootPage(page: SitePage, opts: { up?: () => void } = {}): { update: () => void } {
    let footer = document.querySelector("#status");
    if (!footer) {
        footer = document.createElement("footer");
        footer.id = "status";
        document.body.append(footer);
    }
    const status = mountStatusLine(footer, page);
    bindKeys(page, opts.up);
    return status;
}
