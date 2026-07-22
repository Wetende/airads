/**
 * Airads College color palette
 * Supports both light and dark modes
 *
 * Primary: Airads Blue (#0C5AA6)
 * Secondary: Airads Navy (#082F63)
 * Success: Green (#39B54A)
 * Warning: Airads Red (#EF2026)
 */

import { generatePaletteFromColor } from "./utils/colorUtils";

const lightPalette = {
    mode: "light",
    primary: {
        lighter: "#EAF2FB",
        light: "#176FC1",
        main: "#0C5AA6",
        dark: "#082F63",
        darker: "#061F43",
        contrastText: "#FFFFFF",
    },
    secondary: {
        lighter: "#E8EEF6",
        light: "#174E86",
        main: "#082F63",
        dark: "#061F43",
        darker: "#04152F",
        contrastText: "#FFFFFF",
    },
    success: {
        lighter: "#EDFAEF",
        light: "#72CB7D",
        main: "#39B54A",
        dark: "#2EA040",
        darker: "#247C32",
        contrastText: "#FFFFFF",
    },
    warning: {
        lighter: "#FEEBEC",
        light: "#F25A5F",
        main: "#EF2026",
        dark: "#B7121B",
        darker: "#7D0C12",
        contrastText: "#FFFFFF",
    },
    info: {
        lighter: "#DBEAFE",
        light: "#60A5FA",
        main: "#3B82F6",
        dark: "#2563EB",
        darker: "#1E40AF",
        contrastText: "#FFFFFF",
    },
    error: {
        lighter: "#FEE2E2",
        light: "#F87171",
        main: "#EF4444",
        dark: "#DC2626",
        darker: "#991B1B",
        contrastText: "#FFFFFF",
    },
    grey: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        300: "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        600: "#475569",
        700: "#334155",
        800: "#1E293B",
        900: "#0F172A",
    },
    text: {
        primary: "#1A1C1E",
        secondary: "#42474E",
    },
    divider: "#E2E8F0",
    background: {
        default: "#F4F7FB",
        paper: "#FFFFFF",
    },
    action: {
        hover: "rgba(0, 0, 0, 0.04)",
        selected: "rgba(0, 0, 0, 0.08)",
    },
};

const darkPalette = {
    mode: "dark",
    primary: {
        lighter: "#12375D",
        light: "#5EA4E6",
        main: "#8BC0EF",
        dark: "#B7D8F6",
        darker: "#E1EFFB",
        contrastText: "#061F43",
    },
    secondary: {
        lighter: "#102E50",
        light: "#477FB7",
        main: "#78A7D3",
        dark: "#AAC9E6",
        darker: "#D9E8F5",
        contrastText: "#061F43",
    },
    success: {
        lighter: "#173E28",
        light: "#72CB7D",
        main: "#7BD487",
        dark: "#A7E1AF",
        darker: "#D8F3DC",
        contrastText: "#0F172A",
    },
    warning: {
        lighter: "#65141A",
        light: "#F25A5F",
        main: "#F57B7F",
        dark: "#F8A8AB",
        darker: "#FCD6D7",
        contrastText: "#1F0507",
    },
    info: {
        lighter: "#1E40AF",
        light: "#60A5FA",
        main: "#93C5FD",
        dark: "#BFDBFE",
        darker: "#DBEAFE",
        contrastText: "#0F172A",
    },
    error: {
        lighter: "#991B1B",
        light: "#F87171",
        main: "#FCA5A5",
        dark: "#FECACA",
        darker: "#FEE2E2",
        contrastText: "#0F172A",
    },
    grey: {
        50: "#0F172A",
        100: "#1E293B",
        200: "#334155",
        300: "#475569",
        400: "#64748B",
        500: "#94A3B8",
        600: "#CBD5E1",
        700: "#E2E8F0",
        800: "#F1F5F9",
        900: "#F8FAFC",
    },
    text: {
        primary: "#F5F8FC",
        secondary: "#B8CBE0",
    },
    divider: "#294867",
    background: {
        default: "#04152F",
        paper: "#082744",
    },
    action: {
        hover: "rgba(255, 255, 255, 0.08)",
        selected: "rgba(255, 255, 255, 0.12)",
    },
};

export default function palette(mode = "light", brandColors = {}) {
    const { primaryColor, secondaryColor } = brandColors;
    const basePalette = mode === "dark" ? darkPalette : lightPalette;

    // Use base palette as starting point
    const mergedPalette = { ...basePalette };

    // Override primary if custom color provided
    if (primaryColor) {
        mergedPalette.primary = generatePaletteFromColor(primaryColor, mode);
    }

    // Override secondary if custom color provided
    if (secondaryColor) {
        mergedPalette.secondary = generatePaletteFromColor(
            secondaryColor,
            mode,
        );
    }

    return mergedPalette;
}

// Export color constants for direct access (light mode defaults)
export const COLORS = {
    PRIMARY: "#0C5AA6",
    SECONDARY: "#082F63",
    SUCCESS: "#39B54A",
    WARNING: "#EF2026",
    INFO: "#3B82F6",
    ERROR: "#EF4444",
    TEXT_PRIMARY: "#1A1C1E",
    TEXT_SECONDARY: "#42474E",
    DIVIDER: "#E2E8F0",
    BACKGROUND: "#F4F7FB",
};
