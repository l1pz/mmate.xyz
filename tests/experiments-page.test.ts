import { describe, expect, it } from "vitest";
import { renderPage } from "../src/core/shell";
import { getPage } from "../src/core/site";
import { experimentRows } from "../src/experiments-page";
import { assertShell } from "./helpers/shell";

describe("experiments listing", () => {
    it("has a row per experiment in the site map, with its note", () => {
        const html = experimentRows();
        expect(html).toContain('<a class="row" href="/experiments/fluiddynamics/">fluiddynamics/');
        expect(html).toContain("(work in progress)");
    });

    it("goes through the page frame like every other page", () => {
        assertShell(
            renderPage({
                page: getPage("experiments"),
                command: "ls experiments/",
                body: experimentRows(),
                date: "2026-10-10",
                secret: "i promise i will finish this",
            }),
        );
    });
});
