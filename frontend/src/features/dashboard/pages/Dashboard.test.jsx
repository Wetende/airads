import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import Dashboard from "./Dashboard";

const mockUsePage = vi.fn();

vi.mock("@inertiajs/react", () => ({
    Head: () => null,
    Link: ({ children, href, ...props }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
    usePage: () => mockUsePage(),
}));

vi.mock("@/layouts/DashboardLayout", () => ({
    default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
}));

vi.mock("@/components/cards", () => ({
    EnrolledCourseCard: () => null,
}));

describe("Student dashboard", () => {
    beforeEach(() => {
        mockUsePage.mockReturnValue({
            props: {
                auth: {
                    user: {
                        role: "student",
                    },
                },
            },
        });
    });

    test("renders current courses and real course progress distribution labels", () => {
        render(
            <Dashboard
                role="student"
                enrollments={[
                    {
                        id: 1,
                        programId: 101,
                        programName: "Backend Engineering",
                        programCode: "BE-101",
                        progressPercent: 72,
                        durationHours: 30,
                        enrolledAt: "2026-01-20T00:00:00Z",
                    },
                    {
                        id: 2,
                        programId: 202,
                        programName: "Frontend Foundations",
                        programCode: "FE-202",
                        progressPercent: 40,
                        durationHours: 24,
                        enrolledAt: "2026-01-22T00:00:00Z",
                    },
                ]}
                assignments={[]}
                quizzes={[]}
                recentActivity={[]}
            />
        );

        expect(screen.getByText("Course Progress Distribution")).toBeInTheDocument();
        expect(screen.getByText("Current Courses")).toBeInTheDocument();
        expect(screen.queryByText("Online Classes")).not.toBeInTheDocument();
        expect(screen.getAllByText("Backend Engineering").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Frontend Foundations").length).toBeGreaterThan(0);
    });
});
