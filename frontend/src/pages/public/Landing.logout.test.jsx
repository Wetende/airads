import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Home from "./Home";

vi.mock("@inertiajs/react", () => ({
    Head: () => null,
}));

vi.mock("../../components/common/TopNavbar", () => ({
    default: () => <div data-testid="top-navbar" />,
}));

vi.mock("../../components/common/MainNavbar", () => ({
    default: () => <div data-testid="main-navbar" />,
}));

vi.mock("../../components/common/NewsTicker", () => ({
    default: () => <div data-testid="news-ticker" />,
}));

vi.mock("../../components/sections/HeroSection", () => ({
    default: () => <div data-testid="hero-section" />,
}));

vi.mock("../../components/sections/ProgrammesCatalogueSection", () => ({
    default: () => <div data-testid="programmes-catalogue-section" />,
}));

vi.mock("../../components/sections/AtAGlanceSection", () => ({
    default: () => <div data-testid="at-a-glance-section" />,
}));

vi.mock("../../components/sections/SchoolsGridSection", () => ({
    default: () => <div data-testid="schools-grid-section" />,
}));

vi.mock("../../components/sections/NoticesNewsSection", () => ({
    default: () => <div data-testid="notices-news-section" />,
}));

vi.mock("../../components/sections/QuickLinksAdmissionSection", () => ({
    default: () => <div data-testid="quick-links-admission-section" />,
}));

vi.mock("../../components/sections/WelcomeSection", () => ({
    default: () => <div data-testid="welcome-section" />,
}));

vi.mock("../../components/common/AIRADSFooter", () => ({
    default: () => <div data-testid="airads-footer" />,
}));

describe("Airads public home page", () => {
    test("renders the public page shell", () => {
        render(<Home />);

        expect(screen.getByTestId("top-navbar")).toBeInTheDocument();
        expect(screen.getByTestId("main-navbar")).toBeInTheDocument();
        expect(screen.getByTestId("hero-section")).toBeInTheDocument();
        expect(screen.getByTestId("airads-footer")).toBeInTheDocument();
    });

    test("renders the main public sections", () => {
        render(<Home />);

        expect(screen.getByTestId("news-ticker")).toBeInTheDocument();
        expect(
            screen.getByTestId("programmes-catalogue-section"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("at-a-glance-section")).toBeInTheDocument();
        expect(screen.getByTestId("schools-grid-section")).toBeInTheDocument();
        expect(
            screen.getByTestId("quick-links-admission-section"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("notices-news-section")).toBeInTheDocument();
        expect(screen.getByTestId("welcome-section")).toBeInTheDocument();
    });
});
