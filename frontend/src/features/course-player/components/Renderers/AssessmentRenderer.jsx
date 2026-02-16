import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import DOMPurify from "dompurify";
import {
    Alert,
    Box,
    Button,
    Divider,
    Paper,
    Stack,
    TextField,
    Link,
    Typography,
} from "@mui/material";
import QuizRenderer from "./QuizRenderer";

const normalizeSubmissionType = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    const map = {
        file: "file",
        file_upload: "file",
        text: "text",
        text_entry: "text",
        both: "both",
        external_link: "text",
        media_recording: "text",
    };
    return map[normalized] || "file";
};

const normalizeAssignmentMode = (props) => {
    if (!props || typeof props !== "object") return "submission_only";
    const explicit = String(props.assignment_mode || "").trim().toLowerCase();
    if (["submission_only", "question_only", "mixed"].includes(explicit)) {
        return explicit;
    }
    const hasQuestions =
        Array.isArray(props.questions) && props.questions.length > 0;
    return hasQuestions ? "mixed" : "submission_only";
};

const normalizeTypedResponseMode = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized === "short_answer_question"
        ? "short_answer_question"
        : "submission_text";
};

const stripHtml = (value) => String(value || "").replace(/<[^>]*>/g, "").trim();

const buildQuizStartUrl = ({ quizId, enrollmentId, nodeId }) => {
    const params = new URLSearchParams();
    if (enrollmentId) params.set("enrollment_id", String(enrollmentId));
    if (nodeId) params.set("node_id", String(nodeId));
    const query = params.toString();
    return `/student/quiz/${quizId}/${query ? `?${query}` : ""}`;
};

const AssessmentRenderer = ({
    node,
    enrollmentId,
    onComplete,
    forceType = null,
}) => {
    const [file, setFile] = useState(null);
    const [textContent, setTextContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const properties = useMemo(() => {
        return node?.properties && typeof node.properties === "object"
            ? node.properties
            : {};
    }, [node?.properties]);

    const nodeType = String(forceType || node?.type || node?.nodeType || node?.node_type || "").toLowerCase();
    const lessonType = String(properties.lesson_type || "").toLowerCase();
    const isQuiz = nodeType === "quiz" || lessonType === "quiz";
    const isAssignment = nodeType === "assignment" || lessonType === "assignment";

    const assignmentMode = normalizeAssignmentMode(properties);
    const typedResponseMode = normalizeTypedResponseMode(
        properties.typed_response_mode,
    );
    const submissionType = normalizeSubmissionType(properties.submission_type);
    const hasQuestions =
        Array.isArray(properties.questions) && properties.questions.length > 0;
    const hasQuizLink = Boolean(properties.quiz_id);
    const hasAssignmentLink = Boolean(properties.assignment_id);
    const materials = Array.isArray(properties.files) ? properties.files : [];

    const shouldShowPromptQuestionPath =
        isAssignment &&
        assignmentMode === "submission_only" &&
        typedResponseMode === "short_answer_question";

    const shouldShowQuestions =
        isQuiz ||
        (isAssignment &&
            (assignmentMode === "question_only" ||
                assignmentMode === "mixed" ||
                shouldShowPromptQuestionPath));
    const shouldShowSubmission =
        isAssignment &&
        (assignmentMode === "mixed" ||
            (assignmentMode === "submission_only" &&
                typedResponseMode === "submission_text"));

    const handleSubmission = () => {
        if (!hasAssignmentLink || isSubmitting) return;
        if (!file && !textContent.trim()) return;

        setIsSubmitting(true);
        const payload = new FormData();
        if (file) payload.append("file", file);
        if (textContent.trim()) payload.append("text_content", textContent.trim());
        if (enrollmentId) payload.append("enrollment_id", String(enrollmentId));
        if (node?.id) payload.append("node_id", String(node.id));

        router.post(`/student/assignment/${properties.assignment_id}/submit/`, payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (onComplete) onComplete();
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const renderQuestionsSection = () => {
        if (!shouldShowQuestions) return null;

        if (shouldShowPromptQuestionPath && hasQuestions) {
            return (
                <QuizRenderer
                    node={{
                        ...node,
                        properties: {
                            ...properties,
                            quiz_id: null,
                            questions: properties.questions,
                        },
                    }}
                    enrollmentId={enrollmentId}
                    onComplete={onComplete}
                />
            );
        }

        if (hasQuestions) {
            return (
                <QuizRenderer
                    node={{
                        ...node,
                        properties: {
                            ...properties,
                            questions: properties.questions,
                        },
                    }}
                    enrollmentId={enrollmentId}
                    onComplete={onComplete}
                />
            );
        }

        if (hasQuizLink) {
            const startQuizUrl = buildQuizStartUrl({
                quizId: properties.quiz_id,
                enrollmentId,
                nodeId: node?.id,
            });
            const label = isQuiz
                ? "Start Quiz"
                : shouldShowPromptQuestionPath
                  ? "Answer Question"
                  : "Answer Questions";

            return (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: shouldShowSubmission ? 3 : 0 }}>
                    <Stack spacing={1.5}>
                        <Typography variant="h6" fontWeight={700}>
                            {isQuiz
                                ? node?.title || "Quiz"
                                : shouldShowPromptQuestionPath
                                  ? "Question"
                                  : "Questions"}
                        </Typography>
                        <Typography color="text.secondary">
                            Open and complete this question set.
                        </Typography>
                        <Box>
                            <Button
                                variant="contained"
                                onClick={() => router.visit(startQuizUrl)}
                            >
                                {label}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            );
        }

        return (
            <Alert severity="warning" sx={{ mb: shouldShowSubmission ? 2 : 0 }}>
                No questions are available for this lesson yet.
            </Alert>
        );
    };

    const renderAssignmentOverview = () => {
        if (!isAssignment) return null;

        const assessmentPrompt = properties.assessment_prompt || "";
        const instructions = properties.instructions || "";
        const sanitizedPrompt = DOMPurify.sanitize(assessmentPrompt);
        const sanitizedInstructions = DOMPurify.sanitize(instructions);

        return (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Assignment Question
                        </Typography>
                        {stripHtml(assessmentPrompt) ? (
                            <Box
                                sx={{ color: "text.secondary" }}
                                dangerouslySetInnerHTML={{
                                    __html: sanitizedPrompt,
                                }}
                            />
                        ) : (
                            <Alert severity="warning" sx={{ mt: 1 }}>
                                This assignment question is not available yet.
                            </Alert>
                        )}
                    </Box>

                    {stripHtml(instructions) ? (
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Instructions
                            </Typography>
                            <Box
                                sx={{ color: "text.secondary" }}
                                dangerouslySetInnerHTML={{
                                    __html: sanitizedInstructions,
                                }}
                            />
                        </Box>
                    ) : null}

                    <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                            Materials
                        </Typography>
                        {materials.length === 0 ? (
                            <Typography color="text.secondary">
                                No materials attached.
                            </Typography>
                        ) : (
                            <Stack spacing={1}>
                                {materials.map((file, index) => {
                                    const url = file?.url || file?.path;
                                    if (!url) return null;
                                    return (
                                        <Stack
                                            key={file?.id || `${url}-${index}`}
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                        >
                                            <Typography variant="body2">
                                                {file?.name || `Material ${index + 1}`}
                                            </Typography>
                                            <Link href={url} download>
                                                Download
                                            </Link>
                                            <Link
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Open
                                            </Link>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </Paper>
        );
    };

    const renderSubmissionSection = () => {
        if (!shouldShowSubmission) return null;

        const acceptsFile = submissionType === "file" || submissionType === "both";
        const acceptsText = submissionType === "text" || submissionType === "both";
        const allowedTypes = Array.isArray(properties.allowed_file_types)
            ? properties.allowed_file_types
            : [];
        const acceptedTypesAttr = allowedTypes.map((ext) => `.${ext}`).join(",");

        return (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            {node?.title || "Assignment Submission"}
                        </Typography>
                    </Box>

                    {!hasAssignmentLink ? (
                        <Alert severity="warning">
                            This assignment is not ready yet. Please contact your instructor.
                        </Alert>
                    ) : (
                        <>
                            {acceptsFile ? (
                                <Box>
                                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                        Upload File
                                    </Typography>
                                    <input
                                        type="file"
                                        accept={acceptedTypesAttr || undefined}
                                        onChange={(event) =>
                                            setFile(event.target.files?.[0] || null)
                                        }
                                    />
                                    {allowedTypes.length > 0 ? (
                                        <Typography variant="caption" color="text.secondary">
                                            Allowed: {allowedTypes.join(", ")}
                                        </Typography>
                                    ) : null}
                                </Box>
                            ) : null}

                            {acceptsText ? (
                                <TextField
                                    label="Text Response"
                                    multiline
                                    rows={6}
                                    fullWidth
                                    value={textContent}
                                    onChange={(event) =>
                                        setTextContent(event.target.value)
                                    }
                                />
                            ) : null}

                            <Box>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmission}
                                    disabled={
                                        isSubmitting ||
                                        !hasAssignmentLink ||
                                        (!file && !textContent.trim())
                                    }
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                            </Box>
                        </>
                    )}
                </Stack>
            </Paper>
        );
    };

    if (!isQuiz && !isAssignment) return null;

    return (
        <Box>
            {renderAssignmentOverview()}
            {renderQuestionsSection()}
            {shouldShowQuestions && shouldShowSubmission ? (
                <Divider sx={{ my: 2 }} />
            ) : null}
            {renderSubmissionSection()}
        </Box>
    );
};

export default AssessmentRenderer;
