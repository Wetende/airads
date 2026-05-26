import { FONT_HEADING, FONT_BODY } from "@/config";

/**
 * LMS typography
 *
 * Headings (h1-h6): Bookman Old Style - institutional, distinctive
 * Body text: Figtree - Clean, readable
 */

export default function typography(theme) {
    return {
        fontFamily: FONT_BODY,

        h1: {
            fontFamily: FONT_HEADING,
            fontWeight: 700,
            fontSize: 48,
            lineHeight: 1.2,
            letterSpacing: 0,
            [theme.breakpoints.down("md")]: { fontSize: 36 },
            [theme.breakpoints.down("sm")]: { fontSize: 28 },
        },
        h2: {
            fontFamily: FONT_HEADING,
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.25,
            [theme.breakpoints.down("md")]: { fontSize: 28 },
            [theme.breakpoints.down("sm")]: { fontSize: 24 },
        },
        h3: {
            fontFamily: FONT_HEADING,
            fontWeight: 600,
            fontSize: 28,
            lineHeight: 1.3,
            [theme.breakpoints.down("md")]: { fontSize: 24 },
            [theme.breakpoints.down("sm")]: { fontSize: 20 },
        },
        h4: {
            fontFamily: FONT_HEADING,
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.35,
            [theme.breakpoints.down("md")]: { fontSize: 20 },
            [theme.breakpoints.down("sm")]: { fontSize: 18 },
        },
        h5: {
            fontFamily: FONT_HEADING,
            fontWeight: 600,
            fontSize: 20,
            lineHeight: 1.4,
        },
        h6: {
            fontFamily: FONT_HEADING,
            fontWeight: 600,
            fontSize: 18,
            lineHeight: 1.45,
        },
        body1: {
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontSize: 16,
            lineHeight: 1.6,
        },
        body2: {
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontSize: 14,
            lineHeight: 1.5,
        },
        subtitle1: {
            fontFamily: FONT_BODY,
            fontWeight: 500,
            fontSize: 16,
            lineHeight: 1.5,
        },
        subtitle2: {
            fontFamily: FONT_BODY,
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 1.45,
        },
        caption: {
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 1.4,
        },
        overline: {
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 12,
            lineHeight: 1.5,
            textTransform: "uppercase",
            letterSpacing: 1,
        },
        button: {
            fontFamily: FONT_BODY,
            fontWeight: 600,
            textTransform: "none",
        },
    };
}
