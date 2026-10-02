export const ascii: Record<string, string> = {};

async function load(name: string): Promise<string> {
    const response = await fetch(`/ascii/${name}.ascii`);
    return response.text();
}

async function loadArt(): Promise<string> {
    let index = 0;
    const arts: string[] = [];
    while (true) {
        const response = await fetch(`/ascii/art/${index}.ascii`);
        if (!response.ok) break;
        arts.push(await response.text());
        index++;
    }
    const randomIndex = Math.floor(Math.random() * arts.length);
    return arts[randomIndex];
}

export async function initAscii(): Promise<void> {
    const arts = ["portrait", "escher", "phone", "wip"];
    for (const art of arts) {
        ascii[art] = await load(art);
    }
    ascii["art"] = await loadArt();
}
