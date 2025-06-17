import { theme } from "@/theme.ts";
import type { MantineBreakpoint } from "@mantine/core";

export function smallerThan(
  u: {
    smallerThan: (breakpoint: MantineBreakpoint | number) => string;
  },
  breakpoint: MantineBreakpoint,
) {
  const initialString = u.smallerThan(breakpoint);
  return initialString.replace("@media ", "");
}

export function largerThan(
  u: {
    largerThan: (breakpoint: MantineBreakpoint | number) => string;
  },
  breakpoint: MantineBreakpoint,
) {
  const initialString = u.largerThan(breakpoint);
  return initialString.replace("@media ", "");
}

export function getTeamColorsForTeamCount(teamCount: number) {
  return teamCount <= 2
    ? [theme.colors.red[6], theme.colors.green[6]]
    : [theme.colors.red[6], theme.colors.blue[5], theme.colors.green[6]];
}
