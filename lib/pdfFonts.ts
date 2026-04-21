import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "Tajawal",
    fonts: [
      {
        src: "/public/fonts/Tajawal-Regular.ttf",
        fontWeight: "normal",
      },
      {
        src: "/public/fonts/Tajawal-Bold.ttf",
        fontWeight: "bold",
      },
    ],
  });
}
