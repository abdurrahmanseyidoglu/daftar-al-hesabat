"use client";
import dynamic from "next/dynamic";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
  },
);
import { PersonalPdfTemplate } from "../components/PDF/PersonalPdfTemplate";
import { notFound } from "next/navigation";
import { useRecordStore } from "../stores/recordStore";

export default function StatementPage() {
  const selectedRecordArray = useRecordStore(
    (state) => state.selectedRecordArray,
  );
  if (!selectedRecordArray) {
    notFound();
  }
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <PersonalPdfTemplate />
    </PDFViewer>
  );
}
