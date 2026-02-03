import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    FormControlLabel,
    Switch,
    Stack,
    Checkbox,
    OutlinedInput,
    Collapse,
    Tooltip,
    Divider,
    Radio,
    RadioGroup,
    Popover,
    InputAdornment,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    DragIndicator as DragIcon,
    Image as ImageIcon,
    Edit as EditIcon,
    ExpandMore as ExpandIcon,
    ExpandLess as CollapseIcon,
    Add as AddIcon,
    Help as HelpIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Import specialized editors
import MatchingPairsEditor from "@/features/quizzes/components/MatchingPairsEditor";
import FillBlankEditor from "@/features/quizzes/components/FillBlankEditor";
import OrderingEditor from "@/features/quizzes/components/OrderingEditor";
import ImageMatchingEditor from "@/features/quizzes/components/ImageMatchingEditor";

const QUESTION_TYPES = [
    { value: "mcq", label: "Single choice", color: "#1976d2" },
    { value: "mcq_multi", label: "Multiple choice", color: "#7b1fa2" },
    { value: "true_false", label: "True-False", color: "#388e3c" },
    { value: "short_answer", label: "Keywords", color: "#f57c00" },
    { value: "matching", label: "Matching", color: "#0288d1" },
    { value: "image_matching", label: "Image matching", color: "#6a1b9a" },
    { value: "fill_blank", label: "Fill in the Gap", color: "#5d4037" },
    { value: "ordering", label: "Ordering", color: "#455a64" },
];

// Quill toolbar modules
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        ["link"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
    ],
};

// Quill 2.0 formats - 'list' covers both ordered and bullet
const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "link",
    "list",
];

const normalizeFillBlankText = (text, type) => {
    if (type !== "fill_blank") return text || "";
    if (typeof text !== "string") return "";
    return text.replace(/<[^>]*>/g, "");
};

/**
 * QuestionEditorCard - Inline editor for quiz questions
 * Matches STM LMS Quiz Builder design with rich text, media, categories
 */
export default function QuestionEditorCard({
    nodeId,
    question,
    onChange,
    onDelete,
    categories = [],
    isNew = false,
    defaultExpanded = false,
}) {
    const [expanded, setExpanded] = useState(defaultExpanded || isNew);
    const [explanationAnchor, setExplanationAnchor] = useState(null);
    const [activeExplanationKey, setActiveExplanationKey] = useState(null);
    const [localData, setLocalData] = useState({
        text: normalizeFillBlankText(question.text, question.type || "mcq"),
        type: question.type || "mcq",
        points: question.points || 1,
        options: question.options || ["", "", "", ""],
        correct: question.correct ?? 0,
        correctAnswers: question.correctAnswers || [],
        categories: question.categories || [],
        required: question.required || false,
        pairs: question.pairs || [],
        image_pairs: question.image_pairs || [],
        gaps: question.gaps || [],
        items: question.items || ["", "", "", ""],
        keywords: question.keywords || [],
        explanations: question.explanations || {},
        media: question.media || null,
    });

    // Keep local state in sync when switching between different questions
    useEffect(() => {
        setLocalData({
            text: normalizeFillBlankText(question.text, question.type || "mcq"),
            type: question.type || "mcq",
            points: question.points || 1,
            options: question.options || ["", "", "", ""],
            correct: question.correct ?? 0,
            correctAnswers: question.correctAnswers || [],
            categories: question.categories || [],
            required: question.required || false,
            pairs: question.pairs || [],
            image_pairs: question.image_pairs || [],
            gaps: question.gaps || [],
            items: question.items || ["", "", "", ""],
            keywords: question.keywords || [],
            explanations: question.explanations || {},
            media: question.media || null,
        });
    }, [question.id]);

    // Keep correct selections consistent when switching types
    useEffect(() => {
        if (localData.type === "mcq" || localData.type === "true_false") {
            if (
                Array.isArray(localData.correctAnswers) &&
                localData.correctAnswers.length > 0
            ) {
                updateField("correct", localData.correctAnswers[0]);
                updateField("correctAnswers", []);
            }
        }

        if (localData.type === "mcq_multi") {
            const current = Array.isArray(localData.correctAnswers)
                ? localData.correctAnswers
                : [];
            if (current.length === 0 && typeof localData.correct === "number") {
                updateField("correctAnswers", [localData.correct]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localData.type]);

    useEffect(() => {
        if (localData.type === "fill_blank") {
            const plainText = normalizeFillBlankText(
                localData.text,
                "fill_blank",
            );
            if (plainText !== localData.text) {
                updateField("text", plainText);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localData.type]);

    // Sync local state to parent
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange({ ...question, ...localData });
        }, 500);
        return () => clearTimeout(timer);
    }, [localData]);

    // Word count
    const wordCount = useMemo(() => {
        const text = localData.text.replace(/<[^>]*>/g, ""); // Strip HTML
        const words = text
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0);
        return words.length;
    }, [localData.text]);

    const updateField = (field, value) => {
        setLocalData((prev) => ({ ...prev, [field]: value }));
    };

    const [newOptionText, setNewOptionText] = useState("");

    const handleAddAnswer = () => {
        const trimmed = newOptionText.trim();
        if (!trimmed) return;
        updateField("options", [...localData.options, trimmed]);
        setNewOptionText("");
    };

    // Explanation popover handlers
    const handleOpenExplanation = (event, key) => {
        setExplanationAnchor(event.currentTarget);
        setActiveExplanationKey(key);
    };

    const handleCloseExplanation = () => {
        setExplanationAnchor(null);
        setActiveExplanationKey(null);
    };

    const handleUpdateExplanation = (key, value) => {
        const newExplanations = { ...localData.explanations, [key]: value };
        updateField("explanations", newExplanations);
    };

    const handleRemoveAnswer = (index) => {
        const newOptions = localData.options.filter((_, i) => i !== index);
        // Adjust correct answer if needed
        let newCorrect = localData.correct;
        if (localData.type === "mcq") {
            if (index === localData.correct) newCorrect = 0;
            else if (index < localData.correct)
                newCorrect = Math.max(0, localData.correct - 1);
        }
        let newCorrectAnswers = localData.correctAnswers
            .filter((i) => i !== index)
            .map((i) => (i > index ? i - 1 : i));

        setLocalData((prev) => ({
            ...prev,
            options: newOptions,
            correct: newCorrect,
            correctAnswers: newCorrectAnswers,
        }));
    };

    const handleUpdateAnswer = (index, value) => {
        const newOptions = [...localData.options];
        newOptions[index] = value;
        updateField("options", newOptions);
    };

    const handleToggleCorrect = (index) => {
        if (localData.type === "mcq" || localData.type === "true_false") {
            // Single choice - only one correct
            updateField("correct", index);
        } else if (localData.type === "mcq_multi") {
            // Multiple choice - toggle in array
            const current = localData.correctAnswers || [];
            if (current.includes(index)) {
                updateField(
                    "correctAnswers",
                    current.filter((i) => i !== index),
                );
            } else {
                updateField("correctAnswers", [...current, index]);
            }
        }
    };

    const isAnswerCorrect = (index) => {
        if (localData.type === "mcq" || localData.type === "true_false") {
            return localData.correct === index;
        }
        return (localData.correctAnswers || []).includes(index);
    };

    const getTypeInfo = (typeValue) => {
        return (
            QUESTION_TYPES.find((t) => t.value === typeValue) || {
                label: typeValue,
                color: "#757575",
            }
        );
    };

    const typeInfo = getTypeInfo(localData.type);

    return (
        <Paper
            elevation={expanded ? 2 : 0}
            variant={expanded ? "elevation" : "outlined"}
            sx={{
                overflow: "hidden",
                border: expanded ? "2px solid" : "1px solid",
                borderColor: expanded ? "primary.main" : "divider",
                transition: "all 0.2s ease",
            }}
        >
            {/* Header Row - Always Visible */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 2,
                    bgcolor: expanded ? "primary.50" : "transparent",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => !isNew && setExpanded(!expanded)}
            >
                {/* Drag Handle */}
                <IconButton
                    size="small"
                    sx={{ cursor: "grab" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DragIcon fontSize="small" />
                </IconButton>

                {/* Question Title Preview */}
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Typography
                        variant="body1"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                        dangerouslySetInnerHTML={{
                            __html:
                                localData.text ||
                                '<em style="color: #999">Enter your question</em>',
                        }}
                    />
                </Box>

                {/* Type Badge */}
                <Chip
                    label={typeInfo.label}
                    size="small"
                    sx={{
                        bgcolor: typeInfo.color,
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                    }}
                />

                {/* Expand/Collapse */}
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                >
                    {expanded ? <CollapseIcon /> : <ExpandIcon />}
                </IconButton>

                {/* Delete */}
                <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.();
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Expanded Editor */}
            <Collapse in={expanded}>
                <Divider />
                <Box sx={{ p: 2 }}>
                    {/* Media & Rich Text Editor Row */}
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        {/* Media Button */}
                        <Tooltip title="Add Video or Audio">
                            <IconButton
                                sx={{
                                    border: "1px dashed",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <ImageIcon color="action" />
                            </IconButton>
                        </Tooltip>

                        {/* Rich Text Editor */}
                        <Box
                            sx={{
                                flex: 1,
                                "& .ql-editor": {
                                    minHeight: "200px",
                                    fontSize: "1rem",
                                },
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                gutterBottom
                            >
                                Enter your question
                            </Typography>
                            {localData.type === "fill_blank" ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    Use the “Fill in the Blank” editor below to
                                    enter text with {"{{blank}}"} placeholders.
                                </Typography>
                            ) : (
                                <ReactQuill
                                    theme="snow"
                                    value={localData.text}
                                    onChange={(value) =>
                                        updateField("text", value)
                                    }
                                    modules={quillModules}
                                    formats={quillFormats}
                                    style={{
                                        backgroundColor: "white",
                                    }}
                                />
                            )}
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ float: "right", mt: 0.5 }}
                            >
                                {wordCount} words
                            </Typography>
                        </Box>
                    </Box>

                    {/* Controls Row */}
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 3, mt: 4 }}
                    >
                        {/* Question Type */}
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Question Type</InputLabel>
                            <Select
                                value={localData.type}
                                label="Question Type"
                                onChange={(e) =>
                                    updateField("type", e.target.value)
                                }
                            >
                                {QUESTION_TYPES.map((type) => (
                                    <MenuItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: "50%",
                                                    bgcolor: type.color,
                                                }}
                                            />
                                            {type.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Tooltip title="Learn how this question type works">
                            <IconButton size="small" color="info">
                                <HelpIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Categories */}
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                multiple
                                value={localData.categories}
                                label="Category"
                                onChange={(e) =>
                                    updateField("categories", e.target.value)
                                }
                                input={<OutlinedInput label="Category" />}
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5,
                                        }}
                                    >
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {categories.length === 0 ? (
                                    <MenuItem disabled>
                                        <em>No categories</em>
                                    </MenuItem>
                                ) : (
                                    categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            <Checkbox
                                                checked={localData.categories.includes(
                                                    cat,
                                                )}
                                                size="small"
                                            />
                                            {cat}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        {/* Required Toggle */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={localData.required}
                                    onChange={(e) =>
                                        updateField(
                                            "required",
                                            e.target.checked,
                                        )
                                    }
                                    size="small"
                                />
                            }
                            label="Required Question"
                        />

                        {/* Points */}
                        <TextField
                            label="Points"
                            type="number"
                            size="small"
                            value={localData.points}
                            onChange={(e) =>
                                updateField(
                                    "points",
                                    parseInt(e.target.value) || 1,
                                )
                            }
                            sx={{ width: 80 }}
                            InputProps={{ inputProps: { min: 1 } }}
                        />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Answer Section - Single/Multiple Choice */}
                    {(localData.type === "mcq" ||
                        localData.type === "mcq_multi") && (
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Answers
                                </Typography>
                            </Box>

                            <Stack spacing={0}>
                                {localData.options.map((opt, idx) => (
                                    <Box
                                        key={idx}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            py: 1.5,
                                            px: 1,
                                            borderBottom:
                                                idx <
                                                localData.options.length - 1
                                                    ? "1px solid"
                                                    : "none",
                                            borderColor: "divider",
                                            bgcolor: isAnswerCorrect(idx)
                                                ? "primary.50"
                                                : "background.paper",
                                            "&:first-of-type": {
                                                borderTopLeftRadius: 8,
                                                borderTopRightRadius: 8,
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderBottom: "1px solid",
                                            },
                                            "&:last-of-type": {
                                                borderBottomLeftRadius: 8,
                                                borderBottomRightRadius: 8,
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderTop: "none",
                                            },
                                            "&:not(:first-of-type):not(:last-of-type)":
                                                {
                                                    borderLeft: "1px solid",
                                                    borderRight: "1px solid",
                                                    borderColor: "divider",
                                                },
                                        }}
                                    >
                                        {/* Drag Handle */}
                                        <IconButton
                                            size="small"
                                            sx={{
                                                cursor: "grab",
                                                color: "text.disabled",
                                                p: 0.5,
                                            }}
                                        >
                                            <DragIcon sx={{ fontSize: 18 }} />
                                        </IconButton>

                                        {/* Answer Text */}
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder={`Answer ${idx + 1}`}
                                            value={opt}
                                            onChange={(e) =>
                                                handleUpdateAnswer(
                                                    idx,
                                                    e.target.value,
                                                )
                                            }
                                            variant="standard"
                                            InputProps={{
                                                disableUnderline: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <EditIcon
                                                            sx={{
                                                                fontSize: 16,
                                                                color: "text.disabled",
                                                            }}
                                                        />
                                                    </InputAdornment>
                                                ),
                                                sx: {
                                                    fontWeight: 500,
                                                },
                                            }}
                                        />

                                        {/* Validation - Show if empty */}
                                        {!opt?.trim() && (
                                            <Typography
                                                variant="caption"
                                                color="error.main"
                                                sx={{ whiteSpace: "nowrap" }}
                                            >
                                                This field is required
                                            </Typography>
                                        )}

                                        {/* Correct Label + Radio/Checkbox */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                ml: "auto",
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                color={
                                                    isAnswerCorrect(idx)
                                                        ? "primary.main"
                                                        : "text.secondary"
                                                }
                                                fontWeight={
                                                    isAnswerCorrect(idx)
                                                        ? 600
                                                        : 400
                                                }
                                            >
                                                Correct
                                            </Typography>
                                            {localData.type === "mcq" ? (
                                                // Single Choice - Radio button
                                                <Radio
                                                    checked={isAnswerCorrect(
                                                        idx,
                                                    )}
                                                    onChange={() =>
                                                        updateField(
                                                            "correct",
                                                            idx,
                                                        )
                                                    }
                                                    size="small"
                                                    sx={{
                                                        color: "primary.main",
                                                        p: 0.5,
                                                    }}
                                                />
                                            ) : (
                                                // Multiple Choice - Checkbox
                                                <Checkbox
                                                    checked={isAnswerCorrect(
                                                        idx,
                                                    )}
                                                    onChange={() =>
                                                        handleToggleCorrect(idx)
                                                    }
                                                    size="small"
                                                    sx={{
                                                        color: "primary.main",
                                                        p: 0.5,
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {/* Delete button */}
                                        {localData.options.length > 2 && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    handleRemoveAnswer(idx)
                                                }
                                                sx={{ p: 0.5 }}
                                            >
                                                <DeleteIcon
                                                    sx={{ fontSize: 18 }}
                                                />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                            </Stack>

                            {/* Add New Answer */}
                            <Box
                                sx={{
                                    mt: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    py: 1.5,
                                    px: 1,
                                    bgcolor: "grey.50",
                                    borderRadius: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Add new answer"
                                    variant="standard"
                                    InputProps={{ disableUnderline: true }}
                                    value={newOptionText}
                                    onChange={(e) =>
                                        setNewOptionText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddAnswer();
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleAddAnswer}
                                    sx={{
                                        minWidth: "auto",
                                        px: 2,
                                        textTransform: "none",
                                    }}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* True/False */}
                    {localData.type === "true_false" && (
                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                gutterBottom
                            >
                                Answer
                            </Typography>
                            <Stack spacing={0}>
                                {["True", "False"].map((label, idx) => (
                                    <Box
                                        key={label}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            p: 1.5,
                                            borderBottom:
                                                idx === 0
                                                    ? "1px solid"
                                                    : "none",
                                            borderColor: "divider",
                                            bgcolor: "background.paper",
                                            "&:first-of-type": {
                                                borderTopLeftRadius: 8,
                                                borderTopRightRadius: 8,
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderBottom: "none",
                                            },
                                            "&:last-of-type": {
                                                borderBottomLeftRadius: 8,
                                                borderBottomRightRadius: 8,
                                                border: "1px solid",
                                                borderColor: "divider",
                                            },
                                        }}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    checked={
                                                        localData.correct ===
                                                        idx
                                                    }
                                                    onChange={() =>
                                                        updateField(
                                                            "correct",
                                                            idx,
                                                        )
                                                    }
                                                    size="small"
                                                    sx={{
                                                        color: "primary.main",
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography fontWeight={500}>
                                                    {label}
                                                </Typography>
                                            }
                                            sx={{ m: 0 }}
                                        />
                                        <Button
                                            size="small"
                                            startIcon={
                                                <AddIcon
                                                    sx={{ fontSize: 14 }}
                                                />
                                            }
                                            onClick={(e) =>
                                                handleOpenExplanation(
                                                    e,
                                                    `tf_${label.toLowerCase()}`,
                                                )
                                            }
                                            sx={{
                                                textTransform: "none",
                                                color: "primary.main",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            Add explanation
                                        </Button>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Matching Pairs */}
                    {localData.type === "matching" && (
                        <MatchingPairsEditor
                            pairs={localData.pairs}
                            onChange={(pairs) => updateField("pairs", pairs)}
                        />
                    )}

                    {/* Image Matching */}
                    {localData.type === "image_matching" && (
                        <ImageMatchingEditor
                            nodeId={nodeId}
                            pairs={localData.image_pairs}
                            onChange={(pairs) =>
                                updateField("image_pairs", pairs)
                            }
                        />
                    )}

                    {/* Fill in the Blank */}
                    {localData.type === "fill_blank" && (
                        <FillBlankEditor
                            text={localData.text}
                            gaps={localData.gaps}
                            onTextChange={(text) => updateField("text", text)}
                            onGapsChange={(gaps) => updateField("gaps", gaps)}
                        />
                    )}

                    {/* Ordering */}
                    {localData.type === "ordering" && (
                        <OrderingEditor
                            items={localData.items}
                            onChange={(items) => updateField("items", items)}
                        />
                    )}

                    {/* Keywords */}
                    {localData.type === "short_answer" && (
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Accepted Keywords
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={
                                        <AddIcon sx={{ fontSize: 14 }} />
                                    }
                                    onClick={(e) =>
                                        handleOpenExplanation(e, "keywords")
                                    }
                                    sx={{
                                        textTransform: "none",
                                        color: "primary.main",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    Add explanation
                                </Button>
                            </Box>
                            <Stack spacing={0}>
                                {(localData.keywords || []).map(
                                    (keyword, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                py: 1.5,
                                                px: 1,
                                                borderBottom:
                                                    idx <
                                                    (localData.keywords || [])
                                                        .length -
                                                        1
                                                        ? "1px solid"
                                                        : "none",
                                                borderColor: "divider",
                                                bgcolor: "background.paper",
                                                "&:first-of-type": {
                                                    borderTopLeftRadius: 8,
                                                    borderTopRightRadius: 8,
                                                    border: "1px solid",
                                                    borderColor: "divider",
                                                    borderBottom: "1px solid",
                                                },
                                                "&:last-of-type": {
                                                    borderBottomLeftRadius: 8,
                                                    borderBottomRightRadius: 8,
                                                    border: "1px solid",
                                                    borderColor: "divider",
                                                    borderTop: "none",
                                                },
                                                "&:not(:first-of-type):not(:last-of-type)":
                                                    {
                                                        borderLeft: "1px solid",
                                                        borderRight:
                                                            "1px solid",
                                                        borderColor: "divider",
                                                    },
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={keyword}
                                                onChange={(e) => {
                                                    const newKeywords = [
                                                        ...(localData.keywords ||
                                                            []),
                                                    ];
                                                    newKeywords[idx] =
                                                        e.target.value;
                                                    updateField(
                                                        "keywords",
                                                        newKeywords,
                                                    );
                                                }}
                                                variant="standard"
                                                InputProps={{
                                                    disableUnderline: true,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <EditIcon
                                                                sx={{
                                                                    fontSize: 16,
                                                                    color: "text.disabled",
                                                                }}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    const newKeywords = (
                                                        localData.keywords || []
                                                    ).filter(
                                                        (_, i) => i !== idx,
                                                    );
                                                    updateField(
                                                        "keywords",
                                                        newKeywords,
                                                    );
                                                }}
                                                sx={{ p: 0.5 }}
                                            >
                                                <DeleteIcon
                                                    sx={{ fontSize: 18 }}
                                                />
                                            </IconButton>
                                        </Box>
                                    ),
                                )}
                            </Stack>

                            {/* Add New Keyword */}
                            <Box
                                sx={{
                                    mt: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    py: 1.5,
                                    px: 1,
                                    bgcolor: "grey.50",
                                    borderRadius: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Add new keyword"
                                    variant="standard"
                                    InputProps={{ disableUnderline: true }}
                                    onKeyPress={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            e.target.value.trim()
                                        ) {
                                            updateField("keywords", [
                                                ...(localData.keywords || []),
                                                e.target.value.trim(),
                                            ]);
                                            e.target.value = "";
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value.trim()) {
                                            updateField("keywords", [
                                                ...(localData.keywords || []),
                                                e.target.value.trim(),
                                            ]);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        minWidth: "auto",
                                        px: 2,
                                        textTransform: "none",
                                    }}
                                    onClick={(e) => {
                                        // The click might be caught before blur, but handling it explicitly
                                        // requires accessing the input value.
                                        // Since blur handles addition, this button is visual mostly,
                                        // but strictly focusing out works.
                                        // A cleaner way is using a ref or state for the input,
                                        // but for inline consistency with previous patterns, we rely on blur/enter.
                                        // To make the button functional without ref, we can just focus the input
                                        // or leave it as is since users press Enter or Blur.
                                        // However, to match the "Add" button existing functionality properly:
                                        const input =
                                            e.currentTarget.previousSibling.querySelector(
                                                "input",
                                            );
                                        if (input && input.value.trim()) {
                                            updateField("keywords", [
                                                ...(localData.keywords || []),
                                                input.value.trim(),
                                            ]);
                                            input.value = "";
                                        }
                                    }}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Collapse>

            {/* Explanation Popover - Shared across all question types */}
            <Popover
                open={Boolean(explanationAnchor)}
                anchorEl={explanationAnchor}
                onClose={handleCloseExplanation}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Box sx={{ p: 2, width: 280 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Answer explanation
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Will be shown in "Show answer" section
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={handleCloseExplanation}
                        >
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter explanation"
                        value={
                            activeExplanationKey
                                ? localData.explanations?.[
                                      activeExplanationKey
                                  ] || ""
                                : ""
                        }
                        onChange={(e) => {
                            if (activeExplanationKey) {
                                handleUpdateExplanation(
                                    activeExplanationKey,
                                    e.target.value,
                                );
                            }
                        }}
                        multiline
                        rows={2}
                    />
                </Box>
            </Popover>
        </Paper>
    );
}
