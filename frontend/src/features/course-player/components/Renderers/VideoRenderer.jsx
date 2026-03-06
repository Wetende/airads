import { useState, useCallback, useRef, useEffect } from "react";
import { Box, Paper, Typography, LinearProgress, Stack } from "@mui/material";
import LazyReactPlayer from "@/components/LazyReactPlayer";

/**
 * VideoRenderer - Video player with optional progress requirements
 *
 * Features:
 * - Plays videos from various sources (YouTube, Vimeo, direct URLs)
 * - Tracks highest watched position (handles seeking)
 * - Shows progress indicator when requirement is set
 * - Fires onRequirementMet callback when threshold reached
 */
const VideoRenderer = ({
    url,
    onEnded,
    onProgress,
    requiredProgress = 0, // 0-100, percentage required to complete
    onRequirementMet, // Called when required % is reached
}) => {
    const [highestProgress, setHighestProgress] = useState(0);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [durationSeconds, setDurationSeconds] = useState(0);
    const [watchedSeconds, setWatchedSeconds] = useState(0);
    const [requirementMet, setRequirementMet] = useState(false);
    const playerRef = useRef(null);
    const requirementMetRef = useRef(false);
    const lastPlayedSecondsRef = useRef(null);
    const watchedSecondsRef = useRef(0);

    useEffect(() => {
        setHighestProgress(0);
        setCurrentProgress(0);
        setDurationSeconds(0);
        setWatchedSeconds(0);
        watchedSecondsRef.current = 0;
        setRequirementMet(false);
        requirementMetRef.current = false;
        lastPlayedSecondsRef.current = null;
    }, [url, requiredProgress]);

    const watchedPercent = (() => {
        if (!durationSeconds || durationSeconds <= 0) return 0;
        return Math.min(
            100,
            Math.round((watchedSeconds / durationSeconds) * 100),
        );
    })();

    const handleDuration = useCallback((seconds) => {
        // ReactPlayer can re-fire duration; keep latest non-zero.
        if (typeof seconds === "number" && seconds > 0)
            setDurationSeconds(seconds);
    }, []);

    const handleProgress = useCallback(
        (state) => {
            const played = Math.round(state.played * 100);
            setCurrentProgress(played);

            // Count "watched" time based on playedSeconds deltas.
            // This makes requiredProgress harder to bypass via seeking.
            const playedSeconds =
                typeof state.playedSeconds === "number"
                    ? state.playedSeconds
                    : null;
            if (playedSeconds !== null) {
                const last = lastPlayedSecondsRef.current;
                lastPlayedSecondsRef.current = playedSeconds;

                if (typeof last === "number") {
                    const delta = playedSeconds - last;
                    // Ignore large forward jumps (seeks). Accept normal playback deltas.
                    if (delta > 0 && delta <= 10) {
                        watchedSecondsRef.current += delta;
                        setWatchedSeconds(watchedSecondsRef.current);
                    }
                }
            }

            // Track highest position reached (prevents skipping ahead)
            if (played > highestProgress) {
                setHighestProgress(played);
            }

            // Check if requirement met using watched percent (not just seek position).
            const localWatchedPercent = (() => {
                if (!durationSeconds || durationSeconds <= 0) return 0;
                return Math.min(
                    100,
                    Math.round(
                        (watchedSecondsRef.current / durationSeconds) * 100,
                    ),
                );
            })();

            if (
                requiredProgress > 0 &&
                localWatchedPercent >= requiredProgress &&
                !requirementMetRef.current
            ) {
                requirementMetRef.current = true;
                setRequirementMet(true);
                onRequirementMet?.();
            }

            // Forward progress event
            onProgress?.(state);
        },
        [
            highestProgress,
            requiredProgress,
            onProgress,
            onRequirementMet,
            durationSeconds,
        ],
    );

    const handleEnded = useCallback(() => {
        setHighestProgress(100);
        // Only auto-complete on end if no requirement, or if the requirement is met.
        if (requiredProgress > 0 && !requirementMetRef.current) return;
        requirementMetRef.current = true;
        setRequirementMet(true);
        onEnded?.();
    }, [onEnded, requiredProgress]);

    const showProgressBar = requiredProgress > 0;

    return (
        <Box>
            <Paper
                elevation={3}
                sx={{
                    overflow: "hidden",
                    borderRadius: 3,
                    bgcolor: "black",
                    position: "relative",
                    pt: "56.25%", // 16:9 Aspect Ratio
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <LazyReactPlayer
                        ref={playerRef}
                        url={url}
                        width="100%"
                        height="100%"
                        controls={true}
                        onEnded={handleEnded}
                        onDuration={handleDuration}
                        onProgress={handleProgress}
                        progressInterval={1000}
                        config={{
                            youtube: {
                                playerVars: { showinfo: 0, modestbranding: 1 },
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Progress indicator for required viewing */}
            {showProgressBar && (
                <Box sx={{ mt: 1.5, px: 0.5 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Watched: {watchedPercent}% (seeked to{" "}
                            {highestProgress}%, now {currentProgress}%)
                            {requiredProgress > 0 &&
                                ` (${requiredProgress}% required)`}
                        </Typography>
                        {requirementMet && (
                            <Typography
                                variant="caption"
                                color="success.main"
                                fontWeight="bold"
                                aria-label="Requirement met"
                            >
                                ✓
                            </Typography>
                        )}
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={watchedPercent}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "grey.200",
                            "& .MuiLinearProgress-bar": {
                                borderRadius: 3,
                                bgcolor: requirementMet
                                    ? "success.main"
                                    : "primary.main",
                            },
                        }}
                    />
                    {/* Requirement threshold marker */}
                    {requiredProgress > 0 && requiredProgress < 100 && (
                        <Box
                            sx={{
                                position: "relative",
                                mt: -0.75,
                                ml: `${requiredProgress}%`,
                                width: 2,
                                height: 10,
                                bgcolor: "warning.main",
                                borderRadius: 1,
                            }}
                        />
                    )}
                </Box>
            )}
        </Box>
    );
};

export default VideoRenderer;
