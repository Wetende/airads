export const PROGRAM_LEVEL_FILTERS = [
    { value: "all", label: "All" },
    { value: "Diploma", label: "Diploma" },
    { value: "Certificate", label: "Certificate" },
    { value: "Artisan", label: "Artisan" },
    { value: "Short Course", label: "Short Course" },
];

const normalize = (value) => String(value || "").trim().toLowerCase();

export function isShortCourseProgram(program) {
    const examBody = normalize(program?.examBody || program?.exam_body);
    const family = normalize(
        program?.qualificationFamily || program?.qualification_family,
    );
    const level = normalize(program?.level);

    return (
        examBody === "internal" ||
        family.includes("short course") ||
        family === "certificate of participation" ||
        level.includes("short course")
    );
}

export function matchesProgramLevel(program, activeLevel) {
    const target = normalize(activeLevel);
    if (!target || target === "all") {
        return true;
    }

    if (target === "short course" || target === "short courses") {
        return isShortCourseProgram(program);
    }

    const searchableFields = [
        normalize(program?.qualificationFamily || program?.qualification_family),
        normalize(program?.level),
    ].filter(Boolean);

    if (target === "certificate" && isShortCourseProgram(program)) {
        return false;
    }

    return searchableFields.some((field) => field.includes(target));
}

/**
 * Match a program against an active pathway (exam body) filter value.
 */
export function matchesPathway(program, activePathway) {
    const target = normalize(activePathway);
    if (!target || target === "all") {
        return true;
    }
    const examBody = normalize(program?.examBody || program?.exam_body);
    return examBody === target;
}

/**
 * Derive pathway filter options dynamically from program data.
 * Returns [{value, label}] with "all" prepended. Only includes pathways
 * that have at least one matching program.
 */
export function derivePathwayFilters(programs) {
    const seen = new Set();
    for (const program of programs) {
        const raw = (program?.examBody || program?.exam_body || "").trim();
        if (raw) {
            seen.add(raw);
        }
    }
    const sorted = [...seen].sort((a, b) => a.localeCompare(b));
    return [
        { value: "all", label: "All" },
        ...sorted.map((value) => ({ value, label: value })),
    ];
}
