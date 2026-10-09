/** The home page status line, like a tmux bar: window list on the left, clock on the right. */

const NAMES: Record<string, string> = { aboutme: "about" };

export const windowName = (id: string) => NAMES[id] ?? id;

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** `1:about 2:projects* 3:blog`, as links; the active window carries a `*` and the `active` class. */
export function windowsHtml(ids: string[], active: number | null): string {
    return ids
        .map((id, i) => {
            const isActive = i === active;
            const label = escapeHtml(`${i + 1}:${windowName(id)}${isActive ? "*" : ""}`);
            return `<a class="win${isActive ? " active" : ""}" href="#${escapeHtml(id)}" data-index="${i}">${label}</a>`;
        })
        .join(" ");
}

/** Local time as `HH:MM`. */
export function formatClock(date: Date): string {
    const two = (n: number) => String(n).padStart(2, "0");
    return `${two(date.getHours())}:${two(date.getMinutes())}`;
}

/**
 * Fills `el` with the bar and keeps the clock ticking. Returns `setActive`, which marks one window (or none).
 * `onSelect` is called with the index when a window is clicked.
 */
export function mountStatusBar(
    el: Element,
    ids: string[],
    onSelect: (index: number) => void,
): (active: number | null) => void {
    el.innerHTML = '<span id="windows"></span><span id="clock"></span>';
    const windows = el.querySelector("#windows");
    const clock = el.querySelector("#clock");
    const tick = () => {
        if (clock) clock.textContent = `1000110.xyz ${formatClock(new Date())}`;
    };
    tick();
    setInterval(tick, 15_000);
    windows?.addEventListener("click", (e) => {
        const link = (e.target as Element).closest<HTMLElement>("a[data-index]");
        if (!link) return;
        e.preventDefault();
        onSelect(Number(link.dataset.index));
    });
    const setActive = (active: number | null) => {
        if (windows) windows.innerHTML = windowsHtml(ids, active);
    };
    setActive(null);
    return setActive;
}
