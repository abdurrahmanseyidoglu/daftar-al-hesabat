import { NextIntlClientProvider } from "next-intl";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "./theme";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";
import SnackbarWrapper from "./components/SnackBarWrapper";
import { ViewTransition } from "react";
import { InitialAppLoader } from "./components/AppLoader/InitialAppLoader";
import { AppLoaderDismiss } from "./components/AppLoader/AppLoaderDismiss";
import { cookies } from "next/headers";
import { EmotionRtlProvider } from "./components/EmotionRtlProvider";
import ThemeRegistry from "./components/ThemeRegistry";
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
  const locale = (await cookies()).get("locale")?.value ?? "en";
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} className={roboto.variable}>
      <body className={roboto.variable}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <EmotionRtlProvider isRTL={isRTL}>
            <ThemeRegistry locale={locale as "en" | "ar"}>
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
            </ThemeRegistry>
          </EmotionRtlProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
