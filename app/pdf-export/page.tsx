// app/statement/page.jsx
"use client";
import dynamic from "next/dynamic";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
  },
);
import { GlobalPdfTemplate } from "../components/GlobalPdfTemplate";
export default function StatementPage() {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <GlobalPdfTemplate />
    </PDFViewer>
  );
}
