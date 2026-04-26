"use client";
import { useEffect } from "react";
import { useAppStore } from "@/app/stores/appStore";

export function AppLoaderDismiss() {
  const initialized = useAppStore((s) => s.initialized);
  const setInitialized = useAppStore((s) => s.setInitialized);

  useEffect(() => {
    const t = setTimeout(setInitialized, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const el = document.getElementById("loader-wrapper");
    if (!el) return;
    el.style.transition = "opacity 400ms ease";
    el.style.opacity = "0";
    setTimeout(() => (el.style.display = "none"), 400);
  }, [initialized]);

  return null;
}
