import { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import {
    Close as CloseIcon,
    Download as DownloadIcon,
    OpenInNew as OpenInNewIcon,
    PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import PDFRenderer from "./PDFRenderer";

const toAbsoluteUrl = (url) => {
    if (!url) return "";
    try {
        return new URL(url, window.location.origin).toString();
    } catch (err) {
        return url;
    }
};

export default function DocumentLessonRenderer({ node, onRequirementMet }) {
    const [officePreviewOpen, setOfficePreviewOpen] = useState(false);

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
    const hasDistinctConvertedPdf =
        Boolean(documentData.viewer_pdf_url) &&
        documentData.viewer_pdf_url !== originalUrl;

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
                                    window.open(originalUrl, "_blank", "noopener,noreferrer")
                                }
                            >
                                {originalExt === "pdf"
                                    ? "Download PDF"
                                    : "Download original"}
                            </Button>
                        )}
                        {hasDistinctConvertedPdf && (
                            <Button
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() =>
                                    window.open(
                                        documentData.viewer_pdf_url,
                                        "_blank",
                                        "noopener,noreferrer",
                                    )
                                }
                            >
                                Download PDF
                            </Button>
                        )}
                        {officeViewerUrl && (
                            <Button
                                size="small"
                                startIcon={<OpenInNewIcon />}
                                onClick={() => setOfficePreviewOpen(true)}
                            >
                                Open original
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

            {officeViewerUrl && (
                <Dialog
                    open={officePreviewOpen}
                    onClose={() => setOfficePreviewOpen(false)}
                    fullWidth
                    maxWidth="lg"
                >
                    <DialogTitle sx={{ pr: 6 }}>
                        Original document preview
                        <IconButton
                            aria-label="close"
                            onClick={() => setOfficePreviewOpen(false)}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ height: "80vh", p: 0 }}>
                        <iframe
                            title="Office document preview"
                            src={officeViewerUrl}
                            style={{
                                border: 0,
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </Stack>
    );
}
