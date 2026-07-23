export const AIRADS_PORTAL_COLORS = {
    navy: "#082F63",
    navyDeep: "#061F43",
    blue: "#0C5AA6",
    blueBright: "#176FC1",
    blueSoft: "#EAF3FC",
    red: "#EF2026",
    redDark: "#B7121B",
    redSoft: "#FDEBEC",
    ink: "#15243B",
    muted: "#607089",
    line: "#DCE5EF",
    canvas: "#F4F7FB",
    white: "#FFFFFF",
};

export const PORTAL_NAVIGATION = [
    { label: "Dashboard", href: "/college/portal/", icon: "dashboard" },
    { label: "My admission", href: "#admission", icon: "admission" },
    { label: "Documents", href: "#documents", icon: "documents", badge: "1" },
    { label: "Messages", href: "#messages", icon: "messages", badge: "2" },
    { label: "Notices & events", href: "#notices", icon: "notices" },
    { label: "Help centre", href: "#help", icon: "help" },
];

export const ADMISSION_STEPS = [
    {
        label: "Application received",
        detail: "Submitted on 18 July 2026",
        state: "complete",
    },
    {
        label: "Application review",
        detail: "Your information is being reviewed",
        state: "current",
    },
    {
        label: "Admission decision",
        detail: "We will notify you when a decision is ready",
        state: "upcoming",
    },
    {
        label: "Student onboarding",
        detail: "Account and learning access",
        state: "upcoming",
    },
];

export const PORTAL_NOTICES = [
    {
        date: "25 Jul",
        title: "September intake applications are open",
        category: "Admissions",
    },
    {
        date: "02 Aug",
        title: "Virtual Campus orientation information",
        category: "Student notice",
    },
];
