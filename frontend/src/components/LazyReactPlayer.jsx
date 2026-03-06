import { forwardRef, lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { loadReactPlayer } from "@/lib/loadReactPlayer";

const ReactPlayer = lazy(loadReactPlayer);

function PlayerFallback() {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                minHeight: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "black",
            }}
        >
            <CircularProgress size={24} />
        </Box>
    );
}

const LazyReactPlayer = forwardRef(function LazyReactPlayer(props, ref) {
    return (
        <Suspense fallback={<PlayerFallback />}>
            <ReactPlayer {...props} ref={ref} />
        </Suspense>
    );
});

export default LazyReactPlayer;
