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
