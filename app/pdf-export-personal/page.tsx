"use client";
import dynamic from "next/dynamic";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
  },
);
import { PersonalPdfTemplate } from "../components/PDF/PersonalPdfTemplate";
export default function StatementPage() {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <PersonalPdfTemplate />
    </PDFViewer>
  );
}
