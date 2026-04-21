import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "Tajawal",
    fonts: [
      {
        src: "/fonts/Tajawal-Regular.ttf",
        fontWeight: "normal",
      },
      {
        src: "/fonts/Tajawal-Bold.ttf",
        fontWeight: "bold",
      },
    ],
  });
}
