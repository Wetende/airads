import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import { Box, Typography } from "@mui/material";

export default function AiradsLogoLockup({
    href,
    onClick,
    sx,
    crestSrc = "/static/airads-logo.png",
    crestAlt = "AIRADS College crest",
    gap = 1,
    crestHeight = 46,
    headlineColor = "#ef2026",
    subheadColor = "#0c5aa6",
    taglineColor = "#ef2026",
    headlineFontSize = "1rem",
    subheadFontSize = "0.75rem",
    taglineFontSize = "0.5rem",
    headlineLineHeight = 1,
    subheadLineHeight = 1.05,
    taglineLineHeight = 1.1,
    taglineMt = 0.2,
    textAlign = "center",
    textAlignXs,
    textAlignSm,
    textAlignMd,
    alignItems = "center",
    alignItemsXs,
    alignItemsSm,
    alignItemsMd,
    crestSx,
    textSx,
    headlineSx,
    subheadSx,
    taglineSx,
}) {
    const resolvedAlignItems = alignItemsXs || alignItemsSm || alignItemsMd
        ? {
              ...(alignItemsXs ? { xs: alignItemsXs } : {}),
              ...(alignItemsSm ? { sm: alignItemsSm } : {}),
              ...(alignItemsMd ? { md: alignItemsMd } : {}),
          }
        : alignItems;

    const resolvedTextAlign = textAlignXs || textAlignSm || textAlignMd
        ? {
              ...(textAlignXs ? { xs: textAlignXs } : {}),
              ...(textAlignSm ? { sm: textAlignSm } : {}),
              ...(textAlignMd ? { md: textAlignMd } : {}),
          }
        : textAlign;

    return (
        <Box
            {...(href ? { component: Link, href } : {})}
            onClick={onClick}
            sx={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                gap,
                ...sx,
            }}
        >
            <Box
                component="img"
                src={crestSrc}
                alt={crestAlt}
                sx={{
                    height: crestHeight,
                    width: "auto",
                    flexShrink: 0,
                    display: "block",
                    ...crestSx,
                }}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: resolvedAlignItems,
                    textAlign: resolvedTextAlign,
                    lineHeight: 1,
                    ...textSx,
                }}
            >
                <Typography
                    component="span"
                    sx={{
                        color: headlineColor,
                        fontFamily:
                            '"Bookman Old Style", Bookman, Georgia, "Times New Roman", serif',
                        fontSize: headlineFontSize,
                        fontWeight: 700,
                        lineHeight: headlineLineHeight,
                        whiteSpace: "nowrap",
                        ...headlineSx,
                    }}
                >
                    AFRICAN INSTITUTE
                </Typography>

                <Typography
                    component="span"
                    sx={{
                        color: subheadColor,
                        fontFamily:
                            '"Bookman Old Style", Bookman, Georgia, "Times New Roman", serif',
                        fontSize: subheadFontSize,
                        fontWeight: 700,
                        lineHeight: subheadLineHeight,
                        whiteSpace: "nowrap",
                        ...subheadSx,
                    }}
                >
                    Of Research and Development Studies
                </Typography>

                <Typography
                    component="span"
                    sx={{
                        color: taglineColor,
                        fontFamily:
                            '"Bookman Old Style", Bookman, Georgia, "Times New Roman", serif',
                        fontSize: taglineFontSize,
                        fontWeight: 700,
                        lineHeight: taglineLineHeight,
                        whiteSpace: "nowrap",
                        mt: taglineMt,
                        alignSelf: "center",
                        ...taglineSx,
                    }}
                >
                    AIRADS COLLEGE
                </Typography>
            </Box>
        </Box>
    );
}

const responsiveValueType = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object,
]);

AiradsLogoLockup.propTypes = {
    href: PropTypes.string,
    onClick: PropTypes.func,
    sx: PropTypes.object,
    crestSrc: PropTypes.string,
    crestAlt: PropTypes.string,
    gap: responsiveValueType,
    crestHeight: responsiveValueType,
    headlineColor: PropTypes.string,
    subheadColor: PropTypes.string,
    taglineColor: PropTypes.string,
    headlineFontSize: responsiveValueType,
    subheadFontSize: responsiveValueType,
    taglineFontSize: responsiveValueType,
    headlineLineHeight: responsiveValueType,
    subheadLineHeight: responsiveValueType,
    taglineLineHeight: responsiveValueType,
    taglineMt: responsiveValueType,
    textAlign: PropTypes.string,
    textAlignXs: PropTypes.string,
    textAlignSm: PropTypes.string,
    textAlignMd: PropTypes.string,
    alignItems: PropTypes.string,
    alignItemsXs: PropTypes.string,
    alignItemsSm: PropTypes.string,
    alignItemsMd: PropTypes.string,
    crestSx: PropTypes.object,
    textSx: PropTypes.object,
    headlineSx: PropTypes.object,
    subheadSx: PropTypes.object,
    taglineSx: PropTypes.object,
};
