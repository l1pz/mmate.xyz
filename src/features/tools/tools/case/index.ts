import { modePicker, outputBox, textInput } from "../../ui";
import { type CaseMode, convertCase, MODES } from "./convert";

export function mount(el: HTMLElement): void {
    let mode: CaseMode = "snake";
    const { wrap, input } = textInput("input", "type or paste text");
    const out = outputBox("output");
    const update = () => out.set(convertCase(input.value, mode));

    const picker = modePicker(MODES, mode, (id) => {
        mode = id;
        update();
    });
    input.addEventListener("input", update);
    el.append(wrap, picker, out.wrap);
    update();
}
