import { button, buttonRow, modePicker, outputBox, statusLine, textInput } from "../../ui";
import { CODECS, CodecError, type CodecId, type Direction, getCodec, run } from "./codec";

const DIRECTIONS = [
    { id: "encode", label: "encode" },
    { id: "decode", label: "decode" },
] as const;

export function mount(el: HTMLElement): void {
    let codecId: CodecId = "base64";
    let direction: Direction = "encode";
    let variant = "";
    let lastOk: string | null = null;

    const { wrap, input } = textInput("input", "type or paste text");
    const controls = document.createElement("div");
    const out = outputBox("output");
    const status = statusLine();

    const update = () => {
        try {
            const result = run(codecId, direction, input.value, variant);
            lastOk = result.text;
            out.set(result.text);
            status.set(result.note ?? "");
        } catch (err) {
            if (!(err instanceof CodecError)) throw err;
            lastOk = null;
            out.set("");
            status.set(`error: ${err.message}`, true);
        }
    };

    // The pickers are rebuilt on every change so the active buttons follow the state (also after a swap).
    const renderControls = () => {
        const codec = getCodec(codecId);
        const parts: HTMLElement[] = [
            modePicker(CODECS, codecId, (id) => {
                codecId = id;
                variant = "";
                renderControls();
                update();
            }),
        ];
        if (codec.variants) {
            parts.push(
                modePicker(codec.variants, variant || codec.variants[0].id, (id) => {
                    variant = id;
                    update();
                }),
            );
        }
        parts.push(
            modePicker(DIRECTIONS, direction, (id) => {
                direction = id;
                update();
            }),
        );
        controls.replaceChildren(...parts);
    };

    const swap = button("use output as input", () => {
        if (lastOk === null) return;
        input.value = lastOk;
        direction = direction === "encode" ? "decode" : "encode";
        renderControls();
        update();
    });

    input.addEventListener("input", update);
    el.append(wrap, controls, out.wrap, status.node, buttonRow(swap));
    renderControls();
    update();
}
