import { describe, expect, test, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import AssessmentRenderer from "./AssessmentRenderer";

vi.mock("@inertiajs/react", () => ({
    router: {
        visit: vi.fn(),
        post: vi.fn(),
    },
}));

describe("AssessmentRenderer", () => {
    test("renders prompt, instructions, and materials for assignments", () => {
        const html = renderToStaticMarkup(
            <AssessmentRenderer
                node={{
                    id: 9,
                    node_type: "assignment",
                    title: "Capstone Assignment",
                    properties: {
                        assignment_mode: "submission_only",
                        typed_response_mode: "submission_text",
                        assignment_id: 91,
                        submission_type: "text",
                        assessment_prompt: "<p>Write your final reflection.</p>",
                        instructions: "<p>Use examples from your project work.</p>",
                        files: [{ id: "f1", name: "Rubric.pdf", url: "/media/rubric.pdf" }],
                    },
                }}
                enrollmentId={5}
            />,
        );

        expect(html).toContain("Assignment Question");
        expect(html).toContain("Write your final reflection.");
        expect(html).toContain("Instructions");
        expect(html).toContain("Use examples from your project work.");
        expect(html).toContain("Rubric.pdf");
        expect(html).toContain("Download");
        expect(html).toContain("Open");
    });

    test("renders submission section for submission-only assignment", () => {
        const html = renderToStaticMarkup(
            <AssessmentRenderer
                node={{
                    id: 1,
                    node_type: "assignment",
                    title: "Submission Assignment",
                    properties: {
                        assignment_mode: "submission_only",
                        assignment_id: 10,
                        submission_type: "file",
                    },
                }}
                enrollmentId={5}
            />,
        );

        expect(html).toContain("Submit");
        expect(html).not.toContain("Answer Questions");
    });

    test("renders inline short-answer prompt path without submission controls", () => {
        const html = renderToStaticMarkup(
            <AssessmentRenderer
                node={{
                    id: 10,
                    node_type: "assignment",
                    title: "Prompt Assignment",
                    properties: {
                        assignment_mode: "submission_only",
                        typed_response_mode: "short_answer_question",
                        assessment_prompt: "<p>Explain your leadership style.</p>",
                        questions: [
                            {
                                id: "q1",
                                type: "short_answer",
                                text: "Explain your leadership style.",
                                keywords: [],
                            },
                        ],
                    },
                }}
                enrollmentId={5}
            />,
        );

        expect(html).toContain("Explain your leadership style.");
        expect(html).not.toContain("Upload File");
        expect(html).not.toContain("Text Response");
    });

    test("renders question section only for question-only assignment", () => {
        const html = renderToStaticMarkup(
            <AssessmentRenderer
                node={{
                    id: 2,
                    node_type: "assignment",
                    title: "Question Assignment",
                    properties: {
                        assignment_mode: "question_only",
                        quiz_id: 22,
                        questions: [{ id: "q1", type: "mcq", text: "Q", options: ["A"] }],
                    },
                }}
                enrollmentId={5}
            />,
        );

        expect(html).toContain("Answer Questions");
        expect(html).not.toContain("Upload File");
    });

    test("renders both sections for mixed assignment", () => {
        const html = renderToStaticMarkup(
            <AssessmentRenderer
                node={{
                    id: 3,
                    node_type: "assignment",
                    title: "Mixed Assignment",
                    properties: {
                        assignment_mode: "mixed",
                        quiz_id: 33,
                        assignment_id: 44,
                        submission_type: "both",
                        questions: [{ id: "q1", type: "mcq", text: "Q", options: ["A"] }],
                    },
                }}
                enrollmentId={5}
            />,
        );

        expect(html).toContain("Answer Questions");
        expect(html).toContain("Submit");
    });
});
