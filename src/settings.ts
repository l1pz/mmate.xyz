import { borderNames, defaultBorder } from "./borders";

const KEY = "border";

type Store = Pick<Storage, "getItem" | "setItem">;

/** localStorage can throw or be missing (private windows, blocked site data); settings must never break the page. */
const defaultStore = (): Store | undefined => {
    try {
        return globalThis.localStorage;
    } catch {
        return undefined;
    }
};

export function nextBorder(current: string): string {
    const i = borderNames.indexOf(current);
    return borderNames[(i + 1) % borderNames.length];
}

export function loadBorder(store: Store | undefined = defaultStore()): string {
    try {
        const saved = store?.getItem(KEY);
        return saved && borderNames.includes(saved) ? saved : defaultBorder;
    } catch {
        return defaultBorder;
    }
}

export function saveBorder(name: string, store: Store | undefined = defaultStore()): void {
    try {
        store?.setItem(KEY, name);
    } catch {
        // Not saving is fine: the choice just does not survive a reload.
    }
}
