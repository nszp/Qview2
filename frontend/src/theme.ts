import { createTheme } from "@mantine/core";

export const theme = createTheme({
  /* Put your mantine theme override here */

  // TODO: font family
  // TODO: add extra-extra small app shell size and breakpoint for 1 column layout
  breakpoints: {
    xxs: "30em",
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },
  components: {
    ActionIcon: {
      styles: {
        root: { ":active": { transform: "none" } },
      },
    },
    Button: {
      styles: {
        root: { ":active": { transform: "none" } },
      },
    },
  },
});
