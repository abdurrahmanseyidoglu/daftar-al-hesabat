export function isMobileOrTablet(): boolean {
  // SSR guard
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;

  const uaCheck =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // iPadOS 13+ identifies itself as "MacIntel" with touch support
  const ipadOS =
    navigator.maxTouchPoints > 1 && navigator.platform === "MacIntel";

  return uaCheck || ipadOS;
}
