"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLocaleStore } from "../stores/localStore";
import { Select, MenuItem } from "@mui/material";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, setLocale } = useLocaleStore();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: "en" | "ar") => {
    setLocale(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Select
      sx={{
        color: "#ffffff",
        height: "42px",
        "& .MuiSelect-icon": {
          color: "#ffffff",
        },
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
      disabled={isPending}
      MenuProps={{
        sx: {
          "&& .Mui-selected": {
            color: "#1976d2",
          },
        },
      }}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="ar">العربية</MenuItem>
    </Select>
  );
}
