import { Box, Button, Tooltip } from "@mui/material";
import { NavigateBefore, NavigateNext, CheckCircle } from "@mui/icons-material";

const SessionControl = ({
    prevNode,
    nextNode,
    onNavigate,
    onComplete,
    isCompleted,
    canComplete = true, // New prop to control if completion is allowed
    completionTooltip = "", // Tooltip explaining why completion is disabled
}) => {
    const completeButton = (
        <Button
            variant="text"
            onClick={onComplete}
            disabled={!canComplete && !isCompleted}
            startIcon={<CheckCircle />}
            sx={{
                color: isCompleted
                    ? "primary.main"
                    : canComplete
                      ? "text.secondary"
                      : "text.disabled",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { bgcolor: "transparent" },
            }}
        >
            {isCompleted ? "Completed" : "Mark Complete"}
        </Button>
    );

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
                mt: 4,
                borderTop: "1px solid",
                borderColor: "divider",
            }}
        >
            {/* Previous Button */}
            <Button
                disabled={!prevNode}
                onClick={prevNode ? () => onNavigate(prevNode) : undefined}
                startIcon={<NavigateBefore />}
                sx={{
                    color: "text.secondary",
                    textTransform: "none",
                    "&:hover": {
                        bgcolor: "transparent",
                        color: "text.primary",
                    },
                }}
            >
                Previous
            </Button>

            {/* Center: Completed Status */}
            {completionTooltip && !canComplete && !isCompleted ? (
                <Tooltip title={completionTooltip} arrow>
                    <span>{completeButton}</span>
                </Tooltip>
            ) : (
                completeButton
            )}

            {/* Next Button */}
            <Button
                disabled={!nextNode}
                onClick={nextNode ? () => onNavigate(nextNode) : undefined}
                endIcon={<NavigateNext />}
                sx={{
                    color: "text.secondary",
                    textTransform: "none",
                    "&:hover": {
                        bgcolor: "transparent",
                        color: "text.primary",
                    },
                }}
            >
                Next
            </Button>
        </Box>
    );
};

export default SessionControl;
