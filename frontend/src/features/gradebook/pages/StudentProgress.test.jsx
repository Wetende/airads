import { describe, expect, test, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import StudentProgress from "./StudentProgress";

vi.mock("@inertiajs/react", () => ({
    Head: () => null,
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children }) => <div>{children}</div>,
    },
}));

vi.mock("@/layouts/InstructorLayout", () => ({
    default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../components/QuizAnswerReview", () => ({
    default: ({ attempt }) => <div>{`Attempt review ${attempt.id}`}</div>,
}));

const baseProps = {
    program: { id: 12, name: "Program A" },
    student: {
        id: 1,
        name: "Student One",
        email: "student@example.com",
        enrolledAt: "2026-01-01T00:00:00Z",
        overallProgress: 50,
        completedCount: 1,
        totalNodes: 2,
        quizzesPassed: 0,
        quizzesTotal: 0,
        assignmentsPassed: 0,
        assignmentsTotal: 1,
    },
};

describe("StudentProgress assignment review gating", () => {
    test("shows question review for submission_only + short_answer_question assignments", () => {
        const html = renderToStaticMarkup(
            <StudentProgress
                {...baseProps}
                curriculum={[
                    {
                        id: 42,
                        title: "Typed Prompt Assignment",
                        nodeType: "assignment",
                        isCompleted: false,
                        properties: {
                            lesson_type: "assignment",
                            assignment_mode: "submission_only",
                            typed_response_mode: "short_answer_question",
                        },
                    },
                ]}
                quizAttempts={{
                    42: [
                        {
                            id: 99,
                            attemptNumber: 1,
                            score: 0,
                            passed: false,
                            answers: {},
                            questionResults: [],
                        },
                    ],
                }}
                assignmentSubmissions={{}}
            />,
        );

        expect(html).toContain("Question attempts: 1 attempt");
        expect(html).toContain("Attempt review 99");
        expect(html).not.toContain("No submission yet");
    });

    test("shows submission fallback for submission_text assignments", () => {
        const html = renderToStaticMarkup(
            <StudentProgress
                {...baseProps}
                curriculum={[
                    {
                        id: 77,
                        title: "File Submission Assignment",
                        nodeType: "assignment",
                        isCompleted: false,
                        properties: {
                            lesson_type: "assignment",
                            assignment_mode: "submission_only",
                            typed_response_mode: "submission_text",
                        },
                    },
                ]}
                quizAttempts={{}}
                assignmentSubmissions={{}}
            />,
        );

        expect(html).toContain("No submission yet");
        expect(html).not.toContain("Question attempts:");
    });
});
