"use client";

import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "../theme";

type Props = {
  children: React.ReactNode;
  locale: "en" | "ar";
};

export default function ThemeRegistry({ children, locale }: Props) {
  const theme = createAppTheme(locale);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
