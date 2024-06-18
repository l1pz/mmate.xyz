export const ascii = {};

async function load(name) {
    const response = await fetch(`/ascii/${name}.ascii`);
    return response.text();
}

async function loadArt() {
    let index = 0;
    const arts = [];
    while (true) {
        const response = await fetch(`/ascii/art/${index}.ascii`);
        if (!response.ok) break;
        arts.push(await response.text());
        index++;
    }
    const randomIndex = Math.floor(Math.random() * arts.length);
    return arts[randomIndex];
}

export async function initAscii() {
    const arts = ['portrait', 'escher', 'phone'];
    for (const art of arts) {
        ascii[art] = await load(art);
    }
    ascii['art'] = await loadArt();
}
