// components/LocaleSync.tsx
"use client";

import { useEffect } from "react";
import { useLocaleStore } from "../stores/localStore";

export function LocaleSync() {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }, [locale]);

  return null;
}
