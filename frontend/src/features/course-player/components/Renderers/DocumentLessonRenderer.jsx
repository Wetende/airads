import { useMemo } from "react";
import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import {
    Download as DownloadIcon,
    OpenInNew as OpenInNewIcon,
    PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import PDFRenderer from "./PDFRenderer";

const toAbsoluteUrl = (url) => {
    if (!url) return "";
    try {
        return new URL(url, window.location.origin).toString();
    } catch {
        return url;
    }
};

const downloadWithFilename = (url, filename) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default function DocumentLessonRenderer({ node, onRequirementMet }) {
    const documentData = node?.properties?.document || {};
    const viewerPdfUrl = documentData.viewer_pdf_url || "";
    const originalUrl = documentData.original_url || "";
    const originalExt = (documentData.original_ext || "").toLowerCase();
    const pageCount = Number(documentData.page_count || 0);
    const strictCompletion =
        typeof documentData.strict_completion === "boolean"
            ? documentData.strict_completion
            : true;
    const requiredPages = strictCompletion ? pageCount : 0;
    const originalFilename = documentData.original_name || "document";

    const officeViewerUrl = useMemo(() => {
        if (!originalUrl || !["docx", "pptx"].includes(originalExt)) return "";
        const absolute = toAbsoluteUrl(originalUrl);
        return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(absolute)}`;
    }, [originalExt, originalUrl]);

    if (!viewerPdfUrl) {
        return (
            <Alert severity="warning">
                No tracked document is available for this lesson yet.
            </Alert>
        );
    }

    return (
        <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PdfIcon color="error" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                            {documentData.original_name || "Document"}
                            {pageCount > 0 ? ` • ${pageCount} pages` : ""}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        {originalUrl && (
                            <Button
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() =>
                                    downloadWithFilename(originalUrl, originalFilename)
                                }
                            >
                                Download
                            </Button>
                        )}
                        {officeViewerUrl && (
                            <Button
                                size="small"
                                startIcon={<OpenInNewIcon />}
                                onClick={() =>
                                    window.open(
                                        officeViewerUrl,
                                        "_blank",
                                        "noopener,noreferrer",
                                    )
                                }
                            >
                                Open
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            <PDFRenderer
                url={viewerPdfUrl}
                requiredPages={requiredPages}
                onComplete={onRequirementMet}
            />
        </Stack>
    );
}
