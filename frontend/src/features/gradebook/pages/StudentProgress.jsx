/**
 * Student Progress Page
 * Instructor view of individual student's course progress and quiz answers
 */

import { Head, Link } from "@inertiajs/react";
import {
    Box,
    Typography,
    Paper,
    Stack,
    Button,
    Avatar,
    Chip,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { motion } from "framer-motion";
import {
    IconArrowLeft,
    IconChevronDown,
    IconCircleCheck,
    IconCircle,
    IconPlayerPlay,
    IconFileText,
    IconClipboardList,
    IconPencil,
    IconQuestionMark,
} from "@tabler/icons-react";
import InstructorLayout from "@/layouts/InstructorLayout";
import QuizAnswerReview from "../components/QuizAnswerReview";

// Icon mapping for node types
const getNodeIcon = (type) => {
    const icons = {
        lesson: IconFileText,
        video: IconPlayerPlay,
        video_lesson: IconPlayerPlay,
        quiz: IconClipboardList,
        assignment: IconPencil,
    };
    const Icon = icons[(type || "").toLowerCase()] || IconQuestionMark;
    return <Icon size={18} />;
};

export default function StudentProgress({
    program,
    student,
    curriculum = [],
    quizAttempts = {},
}) {
    const breadcrumbs = [
        { label: "Programs", href: "/instructor/programs/" },
        { label: program.name, href: `/instructor/programs/${program.id}/` },
        {
            label: "Gradebook",
            href: `/instructor/programs/${program.id}/gradebook/`,
        },
        { label: student.name },
    ];

    const renderCurriculumNode = (node, depth = 0) => {
        const nodeType = node.type || node.nodeType;
        const lessonType = node.lessonType || node.properties?.lesson_type;

        const isSection =
            nodeType === "section" || nodeType === "module" || node.hasChildren;
        const isQuiz = nodeType === "quiz" || lessonType === "quiz";
        const isCompleted = node.isCompleted;
        const attempts = quizAttempts[node.id] || [];
        const hasAttempts = attempts.length > 0;

        if (isSection) {
            const childCount = (node.children || []).length;
            const completedCount = (node.children || []).filter(
                (c) => c.isCompleted,
            ).length;
            return (
                <Accordion key={node.id} defaultExpanded sx={{ mb: 1 }}>
                    <AccordionSummary
                        expandIcon={<IconChevronDown size={20} />}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                        >
                            <Typography variant="subtitle1" fontWeight="bold">
                                {node.title}
                            </Typography>
                            {childCount > 0 && (
                                <Chip
                                    label={`${completedCount}/${childCount}`}
                                    size="small"
                                    color={
                                        completedCount === childCount
                                            ? "success"
                                            : "default"
                                    }
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                        <Stack spacing={1} sx={{ pl: 2 }}>
                            {(node.children || []).map((child) =>
                                renderCurriculumNode(child, depth + 1),
                            )}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            );
        }

        // Content node (lesson, quiz, assignment)
        return (
            <Paper
                key={node.id}
                variant="outlined"
                sx={{
                    p: 2,
                    mb: 1,
                    ml: depth > 0 ? 2 : 0,
                    borderLeft: "4px solid",
                    borderLeftColor: isCompleted ? "success.main" : "grey.300",
                }}
            >
                <Stack direction="row" alignItems="flex-start" spacing={2}>
                    {/* Status Icon */}
                    <Box
                        sx={{
                            color: isCompleted ? "success.main" : "grey.400",
                            pt: 0.5,
                        }}
                    >
                        {isCompleted ? (
                            <IconCircleCheck size={20} />
                        ) : (
                            <IconCircle size={20} />
                        )}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ mb: 0.5 }}
                        >
                            {getNodeIcon(lessonType || nodeType)}
                            <Typography variant="body1" fontWeight="medium">
                                {node.title}
                            </Typography>
                            <Chip
                                label={nodeType}
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: "capitalize" }}
                            />
                        </Stack>

                        {/* Quiz-specific: Show attempts with answer review */}
                        {isQuiz && (
                            <Box sx={{ mt: 2 }}>
                                {hasAttempts ? (
                                    <Stack spacing={1}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {attempts.length} attempt
                                            {attempts.length > 1 ? "s" : ""}
                                        </Typography>
                                        {attempts.map((attempt, idx) => (
                                            <QuizAnswerReview
                                                key={attempt.id || idx}
                                                attempt={attempt}
                                                questions={node.questions || []}
                                                defaultExpanded={idx === 0}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        fontStyle="italic"
                                    >
                                        No attempts yet
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {/* Completion timestamp */}
                        {isCompleted && node.completedAt && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Completed:{" "}
                                {new Date(node.completedAt).toLocaleString()}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Paper>
        );
    };

    return (
        <InstructorLayout breadcrumbs={breadcrumbs}>
            <Head title={`Progress - ${student.name}`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Stack spacing={3}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                        }}
                    >
                        <Box>
                            <Button
                                component={Link}
                                href={`/instructor/programs/${program.id}/gradebook/`}
                                startIcon={<IconArrowLeft size={16} />}
                                sx={{ mb: 1 }}
                            >
                                Back to Gradebook
                            </Button>
                            <Typography variant="h4" fontWeight="bold">
                                Student Progress
                            </Typography>
                        </Box>
                    </Box>

                    {/* Student Info Card */}
                    <Paper sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={3}>
                            <Avatar
                                src={student.avatarUrl}
                                sx={{ width: 72, height: 72, fontSize: "2rem" }}
                            >
                                {student.name?.charAt(0)}
                            </Avatar>

                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {student.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {student.email}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Enrolled:{" "}
                                    {new Date(
                                        student.enrolledAt,
                                    ).toLocaleDateString()}
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: "center", minWidth: 120 }}>
                                <Typography
                                    variant="h3"
                                    color="primary.main"
                                    fontWeight="bold"
                                >
                                    {student.overallProgress || 0}%
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Overall Progress
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Progress Bar */}
                        <Box sx={{ mt: 3 }}>
                            <LinearProgress
                                variant="determinate"
                                value={student.overallProgress || 0}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                sx={{ mt: 1 }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {student.completedCount || 0} of{" "}
                                    {student.totalNodes || 0} items completed
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="caption">
                                        Quizzes: {student.quizzesPassed || 0}/
                                        {student.quizzesTotal || 0}
                                    </Typography>
                                    <Typography variant="caption">
                                        Assignments:{" "}
                                        {student.assignmentsPassed || 0}/
                                        {student.assignmentsTotal || 0}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Curriculum Progress */}
                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                        >
                            Curriculum Progress
                        </Typography>

                        {curriculum.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: "center" }}>
                                <Typography color="text.secondary">
                                    No curriculum items found
                                </Typography>
                            </Paper>
                        ) : (
                            <Stack spacing={1}>
                                {curriculum.map((node) =>
                                    renderCurriculumNode(node),
                                )}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </motion.div>
        </InstructorLayout>
    );
}
