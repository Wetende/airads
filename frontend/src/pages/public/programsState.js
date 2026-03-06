export function getProgramsListState({
  filters = {},
  isLoadingPrograms = false,
  totalPrograms = 0,
}) {
  const hasAppliedFilters = Boolean(
    (filters.search || "").trim() || filters.category || filters.level,
  );

  if (isLoadingPrograms && totalPrograms === 0) {
    return {
      kind: "loading",
      message: "Loading programs...",
      showClearFilters: false,
    };
  }

  if (totalPrograms > 0) {
    return {
      kind: "ready",
      message: null,
      showClearFilters: false,
    };
  }

  if (hasAppliedFilters) {
    return {
      kind: "empty-filtered",
      message: "No programs found matching your filters.",
      showClearFilters: true,
    };
  }

  return {
    kind: "empty-catalog",
    message: "No programs are available right now.",
    showClearFilters: false,
  };
}
