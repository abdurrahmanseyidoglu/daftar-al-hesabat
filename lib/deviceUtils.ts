export function isMobileOrTablet(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;

  const uaCheck =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  const ipadOS =
    navigator.maxTouchPoints > 1 && navigator.platform === "MacIntel";

  return uaCheck || ipadOS;
}
