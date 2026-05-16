"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocaleStore } from "../stores/localStore";
import { Select, MenuItem, InputLabel, Box, FormControl } from "@mui/material";
import { useTranslations } from "next-intl";
export function LanguageSwitcher() {
  const t = useTranslations();
  const { locale } = useLocaleStore();
  const router = useRouter();
  const [_, startTransition] = useTransition();

  const switchLocale = (newLocale: "en" | "ar") => {
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    useLocaleStore.getState().setLocale(newLocale);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel sx={{ color: "#ffffff !important" }} id="language-selector">
          {t("language")}
        </InputLabel>
        <Select
          labelId="language-selector"
          label={t("language")}
          sx={{
            color: "#ffffff",
            height: "42px",
            "& .MuiSelect-icon": { color: "#ffffff" },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #8cbbe9",
              transition: "all ease-in-out .2s",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffffff",
              border: "1px solid #ffffff",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffffff",
              border: "1px solid #ffffff",
            },
          }}
          value={locale}
          onChange={(e) => switchLocale(e.target.value as "en" | "ar")}
          MenuProps={{
            sx: {
              "&& .Mui-selected": { color: "#1976d2" },
            },
          }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ar">العربية</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
