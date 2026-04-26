"use client";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    white: Palette["primary"];
  }
  interface PaletteOptions {
    white?: PaletteOptions["primary"];
  }
}
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    white: true;
  }
}

export function createAppTheme(locale: "en" | "ar") {
  const isRTL = locale === "ar";

  return createTheme({
    direction: isRTL ? "rtl" : "ltr",
    typography: {
      fontFamily: "var(--font-roboto)",
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "14px",
          },
        },
      },
    },
    palette: {
      white: {
        main: "#ffffff",
        light: "#ffffff",
        dark: "#ffffff",
        contrastText: "#ffffff",
      },
    },
  });
}
