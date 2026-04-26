"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "@mui/stylis-plugin-rtl";

const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const ltrCache = createCache({ key: "muiltr" });

export function EmotionRtlProvider({
  children,
  isRTL,
}: {
  children: React.ReactNode;
  isRTL: boolean;
}) {
  return (
    <CacheProvider value={isRTL ? rtlCache : ltrCache}>
      {children}
    </CacheProvider>
  );
}
