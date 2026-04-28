import { NextIntlClientProvider } from "next-intl";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";
import SnackbarWrapper from "./components/SnackBarWrapper";
import { ViewTransition } from "react";
import { InitialAppLoader } from "./components/AppLoader/InitialAppLoader";
import { AppLoaderDismiss } from "./components/AppLoader/AppLoaderDismiss";
import { cookies } from "next/headers";
import { EmotionRtlProvider } from "./components/EmotionRtlProvider";
import ThemeRegistry from "./components/ThemeRegistry";
import { Roboto, Tajawal } from "next/font/google";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
const tajawal = Tajawal({
  weight: ["300", "400", "500", "700"],
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-tajawal",
});

type Props = {
  children: React.ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get("locale")?.value ?? "en";
  const t = await getTranslations({ locale });

  const title = t("seoTitle");
  const description = t("seoDescription");

  return {
    title,
    description,
    applicationName: title,
    icons: {
      icon: "/logo/logoFav.ico",
      shortcut: "/logo/logoFav.ico",
      apple: "/logo/logoFav.ico",
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/logo/logo.png",
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo/logo.png"],
    },
  };
}

export default async function RootLayout({ children }: Props) {
  const locale = (await cookies()).get("locale")?.value ?? "en";
  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${roboto.variable} ${tajawal.variable}`}
    >
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
