import { describe, expect, test } from "vitest";

import { getProgramsListState } from "./programsState";

describe("getProgramsListState", () => {
  test("returns loading state when a request is in flight and there are no results yet", () => {
    expect(
      getProgramsListState({
        filters: {},
        isLoadingPrograms: true,
        totalPrograms: 0,
      }),
    ).toEqual({
      kind: "loading",
      message: "Loading programs...",
      showClearFilters: false,
    });
  });

  test("returns empty catalog state when there are no programs and no applied filters", () => {
    expect(
      getProgramsListState({
        filters: {},
        isLoadingPrograms: false,
        totalPrograms: 0,
      }),
    ).toEqual({
      kind: "empty-catalog",
      message: "No programs are available right now.",
      showClearFilters: false,
    });
  });

  test("returns filtered empty state when applied filters remove all results", () => {
    expect(
      getProgramsListState({
        filters: { search: "aws", category: "", level: "" },
        isLoadingPrograms: false,
        totalPrograms: 0,
      }),
    ).toEqual({
      kind: "empty-filtered",
      message: "No programs found matching your filters.",
      showClearFilters: true,
    });
  });

  test("returns ready state when programs are present", () => {
    expect(
      getProgramsListState({
        filters: {},
        isLoadingPrograms: false,
        totalPrograms: 3,
      }),
    ).toEqual({
      kind: "ready",
      message: null,
      showClearFilters: false,
    });
  });
});
