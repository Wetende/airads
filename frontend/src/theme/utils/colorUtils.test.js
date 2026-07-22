import { describe, expect, test } from "vitest";

import { generatePaletteFromColor, getContrastText } from "./colorUtils";

describe("brand color palette generation", () => {
    test("uses accessible dark text on bright brand colours", () => {
        expect(getContrastText("#EF2026")).toBe("#0F172A");
        expect(getContrastText("#0C5AA6")).toBe("#FFFFFF");
    });

    test("brightens the primary brand colour for dark surfaces", () => {
        const palette = generatePaletteFromColor("#0C5AA6", "dark");

        expect(palette.main).not.toBe("#0C5AA6");
        expect(palette.contrastText).toBe("#0F172A");
        expect(palette.lighter).not.toBe(palette.main);
    });
});
