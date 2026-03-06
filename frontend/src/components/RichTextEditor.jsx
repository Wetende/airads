import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

const RichTextEditorImpl = lazy(() => import("./RichTextEditorImpl"));

function RichTextEditorFallback({ minHeight = 150 }) {
    return (
        <Box
            sx={{
                minHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
            }}
        >
            <CircularProgress size={24} />
        </Box>
    );
}

export default function RichTextEditor(props) {
    return (
        <Suspense
            fallback={<RichTextEditorFallback minHeight={props.minHeight} />}
        >
            <RichTextEditorImpl {...props} />
        </Suspense>
    );
}
