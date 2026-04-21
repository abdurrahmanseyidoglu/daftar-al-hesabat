export function isArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}
