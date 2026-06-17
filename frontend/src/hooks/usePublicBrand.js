import { useMemo } from "react";
import { usePage } from "@inertiajs/react";

const AIRADS_FALLBACKS = {
  primary: "#2563EB",
  secondary: "#1E3A8A",
  accent: "#DC2525",
  primaryHover: "#1D4ED8",
  accentHover: "#B91C1C",
  softBlue: "#EFF6FF",
  softRed: "#FEF2F2",
  borderBlue: "#DBEAFE",
  neutralText: "#1E293B",
  mutedText: "#64748B",
};

export function usePublicBrand() {
  const { props } = usePage();
  const platform = props.platform || {};

  return useMemo(() => ({
    primary: platform.primaryColor || AIRADS_FALLBACKS.primary,
    secondary: platform.secondaryColor || AIRADS_FALLBACKS.secondary,
    accent: platform.accentColor || AIRADS_FALLBACKS.accent,
    primaryHover: AIRADS_FALLBACKS.primaryHover,
    accentHover: AIRADS_FALLBACKS.accentHover,
    softBlue: AIRADS_FALLBACKS.softBlue,
    softRed: AIRADS_FALLBACKS.softRed,
    borderBlue: AIRADS_FALLBACKS.borderBlue,
    neutralText: AIRADS_FALLBACKS.neutralText,
    mutedText: AIRADS_FALLBACKS.mutedText,
    virtualCampusUrl: platform.virtualCampusUrl || "https://virtual.airads.ac.ke",
  }), [platform.primaryColor, platform.secondaryColor, platform.accentColor, platform.virtualCampusUrl]);
}

export { AIRADS_FALLBACKS };
