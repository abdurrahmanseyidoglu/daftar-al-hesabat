"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { GlobalPdfTemplate } from "../components/PDF/GlobalPdfTemplate";
import { isMobileOrTablet } from "../../lib/deviceUtils";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

export default function StatementPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileOrTablet());
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    // Generate the PDF blob and trigger download/open on mobile
    const generateAndOpen = async () => {
      setLoading(true);
      try {
        const blob = await pdf(<GlobalPdfTemplate />).toBlob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        // On mobile: trigger download directly (most compatible cross-browser approach)
        const a = document.createElement("a");
        a.href = url;
        a.download = "statement.pdf";
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
              <a href={blobUrl} download="statement.pdf">
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
      <GlobalPdfTemplate />
    </PDFViewer>
  );
}
