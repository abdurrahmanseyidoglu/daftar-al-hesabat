"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { PersonalPdfTemplate } from "../components/PDF/PersonalPdfTemplate";
import { notFound } from "next/navigation";
import { useRecordStore } from "../stores/recordStore";
import { isMobileOrTablet } from "../../lib/deviceUtils";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

export default function StatementPage() {
  const selectedRecordArray = useRecordStore(
    (state) => state.selectedRecordArray,
  );

  const [isMobile, setIsMobile] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!selectedRecordArray) {
    notFound();
  }

  useEffect(() => {
    setIsMobile(isMobileOrTablet());
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const generateAndOpen = async () => {
      setLoading(true);
      try {
        const blob = await pdf(<PersonalPdfTemplate />).toBlob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        const a = document.createElement("a");
        a.href = url;
        a.download = "personal-statement.pdf";
        a.click();
      } catch (err) {
        console.error("PDF generation failed:", err);
      } finally {
        setLoading(false);
      }
    };

    generateAndOpen();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        {loading ? (
          <p>Generating PDF...</p>
        ) : (
          <>
            <p>Your PDF is downloading. If it did not start,</p>
            {blobUrl && (
              <a href={blobUrl} download="personal-statement.pdf">
                tap here to download
              </a>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <PersonalPdfTemplate />
    </PDFViewer>
  );
}
