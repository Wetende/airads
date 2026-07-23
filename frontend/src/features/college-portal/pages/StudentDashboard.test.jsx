import { forwardRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import StudentDashboard from "./StudentDashboard";

const { mockUsePage, mockLogout } = vi.hoisted(() => ({
    mockUsePage: vi.fn(),
    mockLogout: vi.fn(),
}));

vi.mock("@inertiajs/react", () => ({
    Head: () => null,
    Link: forwardRef(function MockLink({ children, href, ...props }, ref) {
        return <a ref={ref} href={href} {...props}>{children}</a>;
    }),
    usePage: () => mockUsePage(),
    router: { post: vi.fn() },
}));

vi.mock("@/hooks/useLogout", () => ({
    default: () => mockLogout,
}));

describe("Airads college student portal", () => {
    test("renders the Airads applicant dashboard with focused portal services", () => {
        mockUsePage.mockReturnValue({
            props: {
                auth: {
                    user: {
                        fullName: "Amina Chebet",
                        firstName: "Amina",
                        email: "amina@example.com",
                    },
                },
            },
        });

        render(<StudentDashboard />);

        expect(screen.getByRole("heading", { name: "Welcome back, Amina." })).toBeInTheDocument();
        expect(screen.getByRole("navigation", { name: "Student portal navigation" })).toBeInTheDocument();
        expect(screen.getAllByText("My admission").length).toBeGreaterThan(0);
        expect(screen.getByText("Admission journey")).toBeInTheDocument();
        expect(screen.getAllByText("Open LMS").length).toBeGreaterThan(0);
        expect(screen.queryByText("Payroll")).not.toBeInTheDocument();
        expect(screen.queryByText("Financials")).not.toBeInTheDocument();
    });

    test("opens the navigation drawer on a small viewport action", () => {
        mockUsePage.mockReturnValue({ props: { auth: { user: null } } });
        render(<StudentDashboard />);

        fireEvent.click(screen.getByRole("button", { name: "Open portal navigation" }));

        expect(screen.getAllByText("AIRADS COLLEGE").length).toBeGreaterThan(0);
    });
});
