import { NextIntlClientProvider } from "next-intl";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";
import SnackbarWrapper from "./components/SnackBarWrapper";
import { ViewTransition } from "react";
import { InitialAppLoader } from "./components/AppLoader/InitialAppLoader";
import { AppLoaderDismiss } from "./components/AppLoader/AppLoaderDismiss";
import { Geist } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <NextIntlClientProvider>
              <InitialAppLoader />
              <AppLoaderDismiss />
              <ViewTransition>
                <SnackbarWrapper>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100dvh",
                    }}
                  >
                    <Navbar />
                    {children}
                  </Box>
                </SnackbarWrapper>
              </ViewTransition>
            </NextIntlClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
