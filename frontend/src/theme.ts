import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

export const themeOverride = createTheme({
  /* Put your mantine theme override here */

  // TODO: remove other fonts when i decide on a font
  // fontFamily: "'Noto Sans', sans-serif",
  breakpoints: {
    xxs: "26em",
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

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
