import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

export const themeOverride = createTheme({
  /* Put your mantine theme override here */

  // TODO: remove other fonts when i decide on a font
  // fontFamily: "'Noto Sans', sans-serif",
  fontFamilyMonospace: "Inconsolata, monospace",
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
    NavLink: {
      styles: {
        root: {
          paddingTop: "0.2rem",
          paddingBottom: "0.2rem",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
        },
      },
    },
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
