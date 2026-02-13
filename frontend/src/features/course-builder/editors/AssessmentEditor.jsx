import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Radio,
    RadioGroup,
    Snackbar,
    Alert,
    InputAdornment,
    Menu,
    Tooltip,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Quiz as QuizIcon,
    Assignment as AssignmentIcon,
    LibraryBooks as LibraryIcon,
    Edit as EditIcon,
    Help as HelpIcon,
    KeyboardArrowDown as ArrowDownIcon,
    AccountBalance as BankIcon,
} from "@mui/icons-material";
import { router } from "@inertiajs/react";

// Import specialized editors from Quizzes feature
import MatchingPairsEditor from "@/features/quizzes/components/MatchingPairsEditor";
import FillBlankEditor from "@/features/quizzes/components/FillBlankEditor";
import OrderingEditor from "@/features/quizzes/components/OrderingEditor";
import QuestionsLibraryDrawer from "../components/QuestionsLibraryDrawer";
import QuestionBankDialog from "../components/QuestionBankDialog";
import QuestionEditorCard from "../components/QuestionEditorCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import RichTextEditor from "@/components/RichTextEditor";
import FileUploader from "@/components/FileUploader";

const QUESTION_TYPES = [
    { value: "mcq", label: "Single Choice", color: "#1976d2" },
    { value: "mcq_multi", label: "Multiple Choice", color: "#7b1fa2" },
    { value: "true_false", label: "True/False", color: "#388e3c" },
    { value: "short_answer", label: "Short Answer (Typed)", color: "#f57c00" },
    { value: "matching", label: "Matching", color: "#0288d1" },
    { value: "fill_blank", label: "Fill in the Gap", color: "#5d4037" },
    { value: "ordering", label: "Ordering", color: "#455a64" },
];

const QUIZ_STYLES = [
    { value: "default", label: "Default" },
    { value: "pagination", label: "Pagination" },
    { value: "global", label: "Global" },
];

const normalizeSubmissionType = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    const mapping = {
        file: "file",
        file_upload: "file",
        text: "text",
        text_entry: "text",
        both: "both",
        external_link: "text",
        media_recording: "text",
    };
    return mapping[normalized] || "file";
};

const normalizeAssignmentMode = (properties) => {
    const explicit = String(properties?.assignment_mode || "")
        .trim()
        .toLowerCase();
    if (["submission_only", "question_only", "mixed"].includes(explicit)) {
        return explicit;
    }
    const hasQuestions =
        Array.isArray(properties?.questions) &&
        properties.questions.length > 0;
    return hasQuestions ? "mixed" : "submission_only";
};

const normalizeTypedResponseMode = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized === "short_answer_question") return "short_answer_question";
    return "submission_text";
};

const getPlainTextLength = (value) => {
    return String(value || "").replace(/<[^>]*>/g, "").trim().length;
};

const stripHtml = (value) => String(value || "").replace(/<[^>]*>/g, "").trim();

// Pill-style tab component
function PillTabs({ value, onChange, tabs, questionCount }) {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 0.5,
                bgcolor: "#e3f2fd",
                p: 0.5,
                borderRadius: 1,
                width: "fit-content",
            }}
        >
            {tabs.map((tab) => (
                <Button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 500,
                        bgcolor: value === tab.value ? "white" : "transparent",
                        color:
                            value === tab.value
                                ? "primary.main"
                                : "text.secondary",
                        boxShadow: value === tab.value ? 1 : 0,
                        "&:hover": {
                            bgcolor:
                                value === tab.value
                                    ? "white"
                                    : "rgba(255,255,255,0.5)",
                        },
                    }}
                >
                    {tab.label}
                    {tab.value === "questions" && questionCount > 0 && (
                        <Chip
                            label={questionCount}
                            size="small"
                            color="primary"
                            sx={{ ml: 1, height: 20, minWidth: 20 }}
                        />
                    )}
                </Button>
            ))}
        </Box>
    );
}

/**
 * AssessmentEditor - Unified editor for quizzes and assignments
 * STM LMS-inspired design with tabs, question banks, and library drawer
 */
export default function AssessmentEditor({
    node,
    onSave,
    type = "quiz",
    programId,
    questionLibrary = [],
    categories = [],
}) {
    const normalizeQuestion = (question) => {
        if (!question) return question;
        const normalized = { ...question };

        if (normalized.type === "ordering") {
            const candidate = normalized.items || normalized.correct_order;
            if (Array.isArray(candidate)) {
                normalized.items = candidate.filter(
                    (item) => typeof item === "string",
                );
            }
        }

        if (
            normalized.type === "fill_blank" &&
            typeof normalized.text === "string"
        ) {
            normalized.text = normalized.text.replace(/<[^>]*>/g, "");
        }

        return normalized;
    };

    const isQuiz = type === "quiz";
    const isAssignment = type === "assignment";

    // Common state
    const [title, setTitle] = useState(node.title);
    const [activeTab, setActiveTab] = useState("questions");
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [touched, setTouched] = useState({});

    // Quiz-specific state
    const [description, setDescription] = useState(
        node.properties?.description || "",
    );
    const [quizDuration, setQuizDuration] = useState(
        node.properties?.quiz_duration || 30,
    );
    const [quizTimeUnit, setQuizTimeUnit] = useState(
        node.properties?.quiz_time_unit || "Minutes",
    );
    const [quizStyle, setQuizStyle] = useState(
        node.properties?.quiz_style || "default",
    );
    const [passingGrade, setPassingGrade] = useState(
        node.properties?.passing_grade || 80,
    );
    const [maxAttempts, setMaxAttempts] = useState(
        node.properties?.max_attempts || 1,
    );
    const [randomizeQuestions, setRandomizeQuestions] = useState(
        node.properties?.randomize_questions || false,
    );
    const [randomizeAnswers, setRandomizeAnswers] = useState(
        node.properties?.randomize_answers || false,
    );
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(
        node.properties?.show_correct_answer || false,
    );
    const [quizAttemptHistory, setQuizAttemptHistory] = useState(
        node.properties?.quiz_attempt_history || false,
    );
    const [retakeAfterPass, setRetakeAfterPass] = useState(
        node.properties?.retake_after_pass || false,
    );
    const [limitedRetakeAttempts, setLimitedRetakeAttempts] = useState(
        node.properties?.limited_retake_attempts || false,
    );
    const [retakePenalty, setRetakePenalty] = useState(
        node.properties?.retake_penalty || 0,
    );
    const [pointsCutAfterRetake, setPointsCutAfterRetake] = useState(
        node.properties?.points_cut_after_retake || 0,
    );
    const [questions, setQuestions] = useState(
        (node.properties?.questions || []).map(normalizeQuestion),
    );
    const [questionBanks, setQuestionBanks] = useState(
        node.properties?.question_banks || [],
    );
    const [lessonContent, setLessonContent] = useState(
        node.properties?.lesson_content || "",
    );

    // Q&A state
    const [qaQuestions, setQaQuestions] = useState(
        node.properties?.qa_questions || [],
    );
    const [newQAQuestion, setNewQAQuestion] = useState("");

    // Assignment-specific state
    const [assignmentMode, setAssignmentMode] = useState(
        normalizeAssignmentMode(node.properties),
    );
    const [assessmentPrompt, setAssessmentPrompt] = useState(
        node.properties?.assessment_prompt || "",
    );
    const [typedResponseMode, setTypedResponseMode] = useState(
        normalizeTypedResponseMode(node.properties?.typed_response_mode),
    );
    const [instructions, setInstructions] = useState(
        node.properties?.instructions || "",
    );
    const [points, setPoints] = useState(node.properties?.points || 100);
    const [weight, setWeight] = useState(node.properties?.weight || 20);
    const [submissionType, setSubmissionType] = useState(
        normalizeSubmissionType(node.properties?.submission_type),
    );
    const [allowLate, setAllowLate] = useState(
        node.properties?.allow_late_submission ?? node.properties?.allow_late ?? false,
    );
    const [materialFiles, setMaterialFiles] = useState(
        Array.isArray(node.properties?.files) ? node.properties.files : [],
    );

    // UI state
    const [libraryDrawerOpen, setLibraryDrawerOpen] = useState(false);
    const [questionBankDialogOpen, setQuestionBankDialogOpen] = useState(false);
    const [addQuestionMenuAnchor, setAddQuestionMenuAnchor] = useState(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newQuestionType, setNewQuestionType] = useState("mcq");
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "Confirm Action",
        message: "",
        actionType: null,
        actionId: null,
    });
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        points: 1,
        options: ["", "", "", ""],
        correctAnswer: 0,
        keywords: [],
        pairs: [],
        gaps: [],
        items: ["", "", "", ""],
    });

    const isNew =
        !node.id ||
        node.id.toString().startsWith("temp_") ||
        node.title === "Untitled Quiz" ||
        node.title === "Untitled Assignment";

    const totalQuestionCount =
        questions.length +
        questionBanks.reduce((sum, bank) => sum + bank.questionCount, 0);

    const handleBlur = (fieldName) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
    };

    const getFieldError = (fieldName) => {
        return touched[fieldName] ? errors[fieldName] : undefined;
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const isFormValid = () => {
        if (!title || title.trim().length < 5 || title.length > 100)
            return false;
        if (isAssignment && getPlainTextLength(assessmentPrompt) === 0)
            return false;
        const hasQuestionContent =
            questions.length > 0 || questionBanks.length > 0;
        const submissionOnlyUsesShortAnswerQuestion =
            isAssignment &&
            assignmentMode === "submission_only" &&
            typedResponseMode === "short_answer_question";
        const requiresQuestions =
            isQuiz ||
            (isAssignment &&
                (assignmentMode === "question_only" ||
                    assignmentMode === "mixed"));
        if (requiresQuestions && !hasQuestionContent) return false;
        if (
            submissionOnlyUsesShortAnswerQuestion &&
            getPlainTextLength(assessmentPrompt) === 0
        ) {
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!isFormValid()) {
            setSnackbar({
                open: true,
                message: "Please fix validation errors",
                severity: "error",
            });
            return;
        }

        const properties = {
            ...node.properties,
            qa_questions: qaQuestions,
        };

        const questionSettings = {
            questions,
            question_banks: questionBanks,
            description,
            quiz_duration: quizDuration,
            quiz_time_unit: quizTimeUnit,
            quiz_style: quizStyle,
            passing_grade: passingGrade,
            max_attempts: maxAttempts,
            randomize_questions: randomizeQuestions,
            randomize_answers: randomizeAnswers,
            show_correct_answer: showCorrectAnswer,
            quiz_attempt_history: quizAttemptHistory,
            retake_after_pass: retakeAfterPass,
            limited_retake_attempts: limitedRetakeAttempts,
            retake_penalty: retakePenalty,
            points_cut_after_retake: pointsCutAfterRetake,
            lesson_content: lessonContent,
        };

        if (isQuiz) {
            Object.assign(properties, questionSettings);
        } else {
            const promptText = stripHtml(assessmentPrompt);
            const generatedShortAnswerQuestion = {
                id: `auto_prompt_${node.id || Date.now()}`,
                type: "short_answer",
                text: promptText || title || "Assignment prompt",
                points: points || 1,
                keywords: [],
                manual_grading: true,
                generated_from_assessment_prompt: true,
            };

            properties.assignment_mode = assignmentMode;
            properties.typed_response_mode =
                assignmentMode === "submission_only"
                    ? normalizeTypedResponseMode(typedResponseMode)
                    : "submission_text";
            properties.assessment_prompt = assessmentPrompt;
            properties.instructions = instructions;
            properties.points = points;
            properties.weight = weight;
            properties.files = materialFiles;
            properties.allow_late_submission = allowLate;
            properties.allow_late = allowLate;

            if (
                assignmentMode === "mixed" ||
                (assignmentMode === "submission_only" &&
                    normalizeTypedResponseMode(typedResponseMode) ===
                        "submission_text")
            ) {
                properties.submission_type = normalizeSubmissionType(submissionType);
            }

            if (assignmentMode === "question_only" || assignmentMode === "mixed") {
                Object.assign(properties, questionSettings);
            } else if (
                assignmentMode === "submission_only" &&
                normalizeTypedResponseMode(typedResponseMode) ===
                    "short_answer_question"
            ) {
                const existingGeneratedQuestion = Array.isArray(
                    properties.questions,
                )
                    ? properties.questions.find(
                          (question) =>
                              question &&
                              question.generated_from_assessment_prompt ===
                                  true &&
                              question.type === "short_answer",
                      )
                    : null;

                properties.questions = [
                    existingGeneratedQuestion
                        ? {
                              ...generatedShortAnswerQuestion,
                              db_id: existingGeneratedQuestion.db_id,
                          }
                        : generatedShortAnswerQuestion,
                ];
                properties.question_banks = [];
            } else {
                properties.questions = [];
                properties.question_banks = [];
                delete properties.quiz_id;
            }
        }

        onSave(node.id, { title, properties });
        setSnackbar({
            open: true,
            message: `${isQuiz ? "Quiz" : "Assignment"} saved!`,
            severity: "success",
        });
    };

    // Question Menu handlers
    const handleOpenQuestionMenu = (event) => {
        setAddQuestionMenuAnchor(event.currentTarget);
    };

    const handleCloseQuestionMenu = () => {
        setAddQuestionMenuAnchor(null);
    };

    const handleSelectQuestionType = (type) => {
        // Create a new question and add it to the list (inline editing)
        const newQuestionItem = {
            id: Date.now(),
            db_id: null,
            type: type,
            text: "",
            points: 1,
            options: ["", "", "", ""],
            correct: 0,
            correctAnswers: [],
            categories: [],
            required: false,
            keywords: [],
            pairs: [],
            gaps: [],
            items: ["", "", "", ""],
            isNew: true, // Flag for expanded state
        };
        setQuestions([...questions, newQuestionItem]);
        setAddQuestionMenuAnchor(null);
    };

    // Legacy handler - kept for compatibility but not used with inline editing
    const handleAddQuestion = () => {
        const questionToAdd = {
            id: Date.now(),
            db_id: null,
            type: newQuestionType,
            text: newQuestion.text,
            points: newQuestion.points,
            options: newQuestion.options.filter((o) => o.trim() !== ""),
            correct: newQuestion.correctAnswer,
            keywords: newQuestion.keywords,
            pairs: newQuestion.pairs,
            gaps: newQuestion.gaps,
            items: newQuestion.items.filter((i) => i && i.trim() !== ""),
        };

        setQuestions([...questions, questionToAdd]);
        setAddDialogOpen(false);
        resetQuestionForm();
    };

    const resetQuestionForm = () => {
        setNewQuestion({
            text: "",
            points: 1,
            options: ["", "", "", ""],
            correctAnswer: 0,
            keywords: [],
            pairs: [],
            gaps: [],
            items: ["", "", "", ""],
        });
    };

    const openDeleteDialog = ({ title, message, actionType, actionId }) => {
        setConfirmDialog({
            open: true,
            title,
            message,
            actionType,
            actionId,
        });
    };

    const closeDeleteDialog = () => {
        setConfirmDialog({
            open: false,
            title: "Confirm Action",
            message: "",
            actionType: null,
            actionId: null,
        });
    };

    const handleConfirmDelete = () => {
        if (!confirmDialog.actionType || confirmDialog.actionId == null) {
            closeDeleteDialog();
            return;
        }

        if (confirmDialog.actionType === "question") {
            setQuestions(
                questions.filter((q) => q.id !== confirmDialog.actionId),
            );
        }

        if (confirmDialog.actionType === "questionBank") {
            setQuestionBanks(
                questionBanks.filter((b) => b.id !== confirmDialog.actionId),
            );
        }

        if (confirmDialog.actionType === "qaQuestion") {
            setQaQuestions(
                qaQuestions.filter((q) => q.id !== confirmDialog.actionId),
            );
        }

        closeDeleteDialog();
    };

    const handleDeleteQuestion = (id) => {
        openDeleteDialog({
            title: "Delete Question",
            message: "Delete this question?",
            actionType: "question",
            actionId: id,
        });
    };

    const handleDeleteQuestionBank = (bankId) => {
        openDeleteDialog({
            title: "Delete Question Bank",
            message: "Delete this question bank?",
            actionType: "questionBank",
            actionId: bankId,
        });
    };

    // Handle adding questions from library
    const handleAddFromLibrary = (libraryEntries) => {
        const existingLibraryIds = new Set(
            questions
                .filter((q) => q.libraryEntryId)
                .map((q) => q.libraryEntryId),
        );
        const existingTexts = new Set(
            questions.map((q) => q.text?.toLowerCase().trim()),
        );

        const newQuestions = libraryEntries
            .filter((entry) => {
                if (existingLibraryIds.has(entry.id)) return false;
                const text = (entry.question_data?.text || "")
                    .toLowerCase()
                    .trim();
                if (text && existingTexts.has(text)) return false;
                return true;
            })
            .map((entry) =>
                normalizeQuestion({
                    id: Date.now() + Math.random(),
                    db_id: null,
                    type:
                        entry.question_data?.question_type ||
                        entry.question_type ||
                        "mcq",
                    text: entry.question_data?.text || "",
                    points: entry.question_data?.points || 1,
                    options: (entry.question_data?.options || [])
                        .map((o) => (typeof o === "string" ? o : o?.text))
                        .filter(Boolean),
                    correct: entry.question_data?.answer_data?.correct ?? 0,
                    correctAnswers:
                        entry.question_data?.answer_data?.correct_indices || [],
                    pairs: entry.question_data?.matching_pairs || [],
                    gaps: entry.question_data?.gap_answers || [],
                    items:
                        (
                            entry.question_data?.answer_data?.items ||
                            entry.question_data?.answer_data?.correct_order ||
                            []
                        ).filter((item) => typeof item === "string"),
                    fromLibrary: true,
                    libraryEntryId: entry.id,
                }),
            );

        if (newQuestions.length === 0) {
            setSnackbar({
                open: true,
                message:
                    "All selected questions are already in this assessment",
                severity: "warning",
            });
            return;
        }

        const skipped = libraryEntries.length - newQuestions.length;
        setQuestions((prev) => [...prev, ...newQuestions]);
        setSnackbar({
            open: true,
            message: `Added ${newQuestions.length} question(s)${skipped > 0 ? ` (${skipped} duplicates skipped)` : ""}`,
            severity: "success",
        });
    };

    // Handle adding question bank
    const handleAddQuestionBank = (bank) => {
        setQuestionBanks([...questionBanks, { ...bank, id: Date.now() }]);
        setQuestionBankDialogOpen(false);
        setSnackbar({
            open: true,
            message: "Question bank added!",
            severity: "success",
        });
    };

    const getQuestionTypeInfo = (typeValue) => {
        return (
            QUESTION_TYPES.find((t) => t.value === typeValue) || {
                label: typeValue,
                color: "#757575",
            }
        );
    };

    const assignmentHasQuestionSection =
        assignmentMode === "question_only" || assignmentMode === "mixed";
    const tabs = [
        ...(isQuiz || assignmentHasQuestionSection
            ? [{ value: "questions", label: "Questions" }]
            : []),
        { value: "settings", label: "Settings" },
        { value: "qa", label: "Q&A" },
    ];

    useEffect(() => {
        const tabValues = new Set(tabs.map((tab) => tab.value));
        if (!tabValues.has(activeTab)) {
            setActiveTab("settings");
        }
    }, [activeTab, tabs]);

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 2,
                            py: 0.75,
                            bgcolor: "primary.50",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "primary.200",
                        }}
                    >
                        {isQuiz ? (
                            <QuizIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        ) : (
                            <AssignmentIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        )}
                        <Typography
                            variant="body2"
                            color="primary.main"
                            fontWeight={500}
                        >
                            {isQuiz ? "Quiz" : "Assignment"}
                        </Typography>
                    </Box>
                    <TextField
                        variant="standard"
                        placeholder={`${isQuiz ? "Quiz" : "Assignment"} Title`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => handleBlur("title")}
                        sx={{ flex: 1, maxWidth: 400 }}
                        InputProps={{
                            sx: { fontSize: "1rem" },
                            disableUnderline: true,
                        }}
                    />
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<LibraryIcon />}
                        onClick={() => setLibraryDrawerOpen(true)}
                        disabled={isAssignment && !assignmentHasQuestionSection}
                    >
                        Questions library
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                        disabled={!isFormValid()}
                    >
                        Save
                    </Button>
                </Stack>
            </Box>

            {/* Tabs */}
            <Box sx={{ mb: 3 }}>
                <PillTabs
                    value={activeTab}
                    onChange={setActiveTab}
                    tabs={tabs}
                    questionCount={totalQuestionCount}
                />
            </Box>

            {/* Questions Tab - Available for both Quiz and Assignment */}
            {activeTab === "questions" && (
                <Stack spacing={2}>
                    {/* Questions List - Using QuestionEditorCard */}
                    {questions.map((q, idx) => (
                        <QuestionEditorCard
                            key={q.id || idx}
                            question={q}
                            onChange={(updatedQuestion) => {
                                const newQuestions = [...questions];
                                // Clear isNew flag after first edit
                                newQuestions[idx] = {
                                    ...updatedQuestion,
                                    isNew: false,
                                };
                                setQuestions(newQuestions);
                            }}
                            onDelete={() => handleDeleteQuestion(q.id)}
                            categories={categories}
                            defaultExpanded={q.isNew || false}
                            isNew={q.isNew || false}
                        />
                    ))}

                    {/* Question Banks */}
                    {questionBanks.map((bank) => (
                        <Paper
                            key={bank.id}
                            sx={{
                                p: 2,
                                bgcolor: "#e8f5e9",
                                border: "1px solid #a5d6a7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Typography color="primary" fontWeight={500}>
                                    Questions Bank
                                </Typography>
                                <Typography variant="body2">
                                    {bank.name}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Typography color="primary">
                                    {bank.questionCount} questions
                                </Typography>
                                <Tooltip title="The Question Bank cannot be edited. You can delete it or create a new one.">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleDeleteQuestionBank(bank.id)
                                        }
                                    >
                                        <DeleteIcon
                                            fontSize="small"
                                            color="error"
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Paper>
                    ))}

                    {/* Empty State */}
                    {questions.length === 0 && questionBanks.length === 0 && (
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 4,
                                textAlign: "center",
                                bgcolor: "action.hover",
                            }}
                        >
                            <Typography color="text.secondary" paragraph>
                                No questions yet.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Add questions manually or import from library
                            </Typography>
                        </Paper>
                    )}

                    {/* Action Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                            pt: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            endIcon={<ArrowDownIcon />}
                            onClick={handleOpenQuestionMenu}
                            sx={{ textTransform: "none" }}
                        >
                            + Question
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<BankIcon />}
                            onClick={() => setQuestionBankDialogOpen(true)}
                            sx={{ textTransform: "none" }}
                        >
                            + Question Bank
                        </Button>
                    </Box>

                    {/* Question Type Menu */}
                    <Menu
                        anchorEl={addQuestionMenuAnchor}
                        open={Boolean(addQuestionMenuAnchor)}
                        onClose={handleCloseQuestionMenu}
                    >
                        {QUESTION_TYPES.map((type) => (
                            <MenuItem
                                key={type.value}
                                onClick={() =>
                                    handleSelectQuestionType(type.value)
                                }
                            >
                                <Chip
                                    label={type.label}
                                    size="small"
                                    sx={{
                                        bgcolor: type.color,
                                        color: "white",
                                        mr: 1,
                                        fontSize: "0.75rem",
                                    }}
                                />
                            </MenuItem>
                        ))}
                    </Menu>
                </Stack>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
                <Stack spacing={3}>
                    {isAssignment && (
                        <>
                            <FormControl fullWidth>
                                <InputLabel>Assignment Setup</InputLabel>
                                <Select
                                    value={assignmentMode}
                                    label="Assignment Setup"
                                    onChange={(e) =>
                                        setAssignmentMode(e.target.value)
                                    }
                                >
                                    <MenuItem value="submission_only">
                                        Submission Only
                                    </MenuItem>
                                    <MenuItem value="question_only">
                                        Questions Only
                                    </MenuItem>
                                    <MenuItem value="mixed">
                                        Questions + Submission
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <Alert severity="info">
                                {assignmentMode === "question_only"
                                    ? "Students answer questions only."
                                    : assignmentMode === "submission_only"
                                      ? "Students submit work only. Add the assignment question and choose how they respond."
                                      : "Students answer questions and submit work."}
                            </Alert>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    color="text.secondary"
                                >
                                    Assignment Question
                                </Typography>
                                <RichTextEditor
                                    value={assessmentPrompt}
                                    onChange={setAssessmentPrompt}
                                    placeholder="Write the assignment question or task students must complete..."
                                    minHeight={170}
                                />
                                <Typography
                                    variant="caption"
                                    color={
                                        getPlainTextLength(assessmentPrompt) ===
                                        0
                                            ? "error.main"
                                            : "text.secondary"
                                    }
                                >
                                    {getPlainTextLength(assessmentPrompt)} characters
                                    {getPlainTextLength(assessmentPrompt) === 0
                                        ? " (required)"
                                        : ""}
                                </Typography>
                            </Box>

                            {assignmentMode === "submission_only" && (
                                <>
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            Response Format
                                        </InputLabel>
                                        <Select
                                            value={typedResponseMode}
                                            label="Response Format"
                                            onChange={(e) =>
                                                setTypedResponseMode(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <MenuItem value="submission_text">
                                                Upload File and/or Write Response
                                            </MenuItem>
                                            <MenuItem value="short_answer_question">
                                                Answer as One Typed Question
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    {typedResponseMode ===
                                        "short_answer_question" && (
                                        <Alert severity="info">
                                            Students will answer one typed question.
                                        </Alert>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {(isQuiz || assignmentHasQuestionSection) && (
                        <>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    color="text.secondary"
                                >
                                    Assessment Description
                                </Typography>
                                <RichTextEditor
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Add a short introduction for learners..."
                                    minHeight={120}
                                />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {getPlainTextLength(description)} characters
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Duration"
                                    type="number"
                                    value={quizDuration}
                                    onChange={(e) =>
                                        setQuizDuration(
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    sx={{ width: 160 }}
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                                <TextField
                                    label="Passing Grade (%)"
                                    type="number"
                                    value={passingGrade}
                                    onChange={(e) =>
                                        setPassingGrade(
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    sx={{ width: 180 }}
                                    InputProps={{
                                        inputProps: { min: 0, max: 100 },
                                    }}
                                />
                                <TextField
                                    label="Max Attempts"
                                    type="number"
                                    value={maxAttempts}
                                    onChange={(e) =>
                                        setMaxAttempts(
                                            parseInt(e.target.value) || 1,
                                        )
                                    }
                                    sx={{ width: 150 }}
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                            </Stack>

                            <FormControl fullWidth>
                                <InputLabel>Quiz style</InputLabel>
                                <Select
                                    value={quizStyle}
                                    label="Quiz style"
                                    onChange={(e) => setQuizStyle(e.target.value)}
                                >
                                    {QUIZ_STYLES.map((style) => (
                                        <MenuItem
                                            key={style.value}
                                            value={style.value}
                                        >
                                            {style.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: 1,
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={randomizeQuestions}
                                            onChange={(e) =>
                                                setRandomizeQuestions(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                    }
                                    label="Randomize questions"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={randomizeAnswers}
                                            onChange={(e) =>
                                                setRandomizeAnswers(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                    }
                                    label="Randomize answers"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showCorrectAnswer}
                                            onChange={(e) =>
                                                setShowCorrectAnswer(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                    }
                                    label="Show correct answer"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={quizAttemptHistory}
                                            onChange={(e) =>
                                                setQuizAttemptHistory(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                    }
                                    label="Quiz attempt history"
                                />
                            </Box>

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    color="text.secondary"
                                >
                                    Assessment Content
                                </Typography>
                                <RichTextEditor
                                    value={lessonContent}
                                    onChange={setLessonContent}
                                    placeholder="Optional guidance shown before students attempt this assessment..."
                                    minHeight={150}
                                />
                            </Box>
                        </>
                    )}

                    {isAssignment && !assignmentHasQuestionSection && (
                        <Alert severity="info">
                            Question editing is hidden for this setup.
                        </Alert>
                    )}

                    {isAssignment && (
                        <>
                            <Box onBlur={() => handleBlur("instructions")}>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    color={
                                        getFieldError("instructions")
                                            ? "error"
                                            : "inherit"
                                    }
                                >
                                    Instructions
                                </Typography>
                                <RichTextEditor
                                    value={instructions}
                                    onChange={setInstructions}
                                    placeholder="Add assignment instructions for students..."
                                    minHeight={180}
                                />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {getPlainTextLength(instructions)} characters
                                </Typography>
                            </Box>

                            {(assignmentMode === "mixed" ||
                                (assignmentMode === "submission_only" &&
                                    typedResponseMode ===
                                        "submission_text")) && (
                                <>
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="Total Points"
                                            type="number"
                                            value={points}
                                            onChange={(e) =>
                                                setPoints(
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            size="small"
                                            sx={{ width: 160 }}
                                        />
                                        <TextField
                                            label="Weight (%)"
                                            type="number"
                                            value={weight}
                                            onChange={(e) =>
                                                setWeight(
                                                    Math.min(
                                                        100,
                                                        Math.max(
                                                            0,
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0,
                                                        ),
                                                    ),
                                                )
                                            }
                                            size="small"
                                            sx={{ width: 140 }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        %
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <FormControl
                                            size="small"
                                            sx={{ width: 180 }}
                                        >
                                            <InputLabel>
                                                What Students Submit
                                            </InputLabel>
                                            <Select
                                                value={submissionType}
                                                label="What Students Submit"
                                                onChange={(e) =>
                                                    setSubmissionType(
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <MenuItem value="file">
                                                    File
                                                </MenuItem>
                                                <MenuItem value="text">
                                                    Text
                                                </MenuItem>
                                                <MenuItem value="both">
                                                    Both
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={allowLate}
                                                onChange={(e) =>
                                                    setAllowLate(
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                        }
                                        label="Allow Late Submissions"
                                    />
                                </>
                            )}

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    color="text.secondary"
                                >
                                    Assessment Materials
                                </Typography>
                                {node.id &&
                                !String(node.id).startsWith("temp_") ? (
                                    <FileUploader
                                        nodeId={node.id}
                                        files={materialFiles}
                                        onUploadComplete={(newFile) =>
                                            setMaterialFiles((prev) => [
                                                ...prev,
                                                newFile,
                                            ])
                                        }
                                        onDeleteComplete={(fileId) =>
                                            setMaterialFiles((prev) =>
                                                prev.filter(
                                                    (f) => f.id !== fileId,
                                                ),
                                            )
                                        }
                                    />
                                ) : (
                                    <Alert severity="info">
                                        Save this assignment first to attach materials.
                                    </Alert>
                                )}
                            </Box>
                        </>
                    )}
                </Stack>
            )}

            {/* Q&A Tab */}
            {activeTab === "qa" && (
                <Stack spacing={3}>
                    {/* New Question Form */}
                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight={500}
                            gutterBottom
                        >
                            New question
                        </Typography>
                        <TextField
                            multiline
                            rows={3}
                            fullWidth
                            placeholder="Enter question"
                            value={newQAQuestion}
                            onChange={(e) => setNewQAQuestion(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                if (newQAQuestion.trim()) {
                                    setQaQuestions([
                                        ...qaQuestions,
                                        {
                                            id: Date.now(),
                                            question: newQAQuestion.trim(),
                                            answer: "",
                                            createdAt: new Date().toISOString(),
                                        },
                                    ]);
                                    setNewQAQuestion("");
                                    setSnackbar({
                                        open: true,
                                        message: "Question added!",
                                        severity: "success",
                                    });
                                }
                            }}
                            disabled={!newQAQuestion.trim()}
                            sx={{ textTransform: "none" }}
                        >
                            Submit
                        </Button>
                    </Box>

                    {/* Q&A List */}
                    {qaQuestions.length > 0 && (
                        <Stack spacing={2}>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Questions ({qaQuestions.length})
                            </Typography>
                            {qaQuestions.map((qa, idx) => (
                                <Paper
                                    key={qa.id}
                                    variant="outlined"
                                    sx={{ p: 2 }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="body1"
                                                fontWeight={500}
                                            >
                                                Q{idx + 1}: {qa.question}
                                            </Typography>
                                            {qa.answer ? (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 1 }}
                                                >
                                                    <strong>A:</strong>{" "}
                                                    {qa.answer}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    color="warning.main"
                                                    sx={{ mt: 1 }}
                                                >
                                                    Awaiting answer...
                                                </Typography>
                                            )}
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                openDeleteDialog({
                                                    title: "Delete Question",
                                                    message:
                                                        "Delete this question?",
                                                    actionType: "qaQuestion",
                                                    actionId: qa.id,
                                                })
                                            }
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    )}

                    {/* Empty State */}
                    {qaQuestions.length === 0 && !newQAQuestion && (
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 4,
                                textAlign: "center",
                                bgcolor: "action.hover",
                            }}
                        >
                            <Typography color="text.secondary">
                                No questions yet. Students can ask questions
                                about this quiz here.
                            </Typography>
                        </Paper>
                    )}
                </Stack>
            )}

            {/* Add Question Dialog - REMOVED: Using inline QuestionEditorCard instead */}

            {/* Question Bank Dialog */}
            <QuestionBankDialog
                open={questionBankDialogOpen}
                onClose={() => setQuestionBankDialogOpen(false)}
                onSave={handleAddQuestionBank}
                categories={categories}
            />

            {/* Questions Library Drawer */}
            <QuestionsLibraryDrawer
                open={libraryDrawerOpen}
                onClose={() => setLibraryDrawerOpen(false)}
                programId={programId}
                onAddQuestions={handleAddFromLibrary}
                existingQuestionIds={questions
                    .map((q) => q.libraryEntryId)
                    .filter(Boolean)}
                preloadedQuestions={questionLibrary}
                preloadedCategories={categories}
            />

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <ConfirmDialog
                open={confirmDialog.open}
                onClose={closeDeleteDialog}
                onConfirm={handleConfirmDelete}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmLabel="Delete"
                confirmColor="error"
            />
        </Box>
    );
}
