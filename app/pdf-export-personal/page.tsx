"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { PersonalPdfTemplate } from "../components/PDF/PersonalPdfTemplate";
import { notFound } from "next/navigation";
import { useRecordStore } from "../stores/recordStore";
import { isMobileOrTablet } from "../../lib/deviceUtils";
import { useTranslations } from "next-intl";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

export default function PersonalStatementPage() {
  const selectedRecordArray = useRecordStore(
    (state) => state.selectedRecordArray,
  );

  // All hooks must run before any conditional returns
  const [direction, setDirection] = useState<"rtl" | "ltr">("ltr");
  const [isMobile, setIsMobile] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const t = useTranslations();

  useEffect(() => {
    const updateDirection = () => {
      setDirection(document.dir === "rtl" ? "rtl" : "ltr");
    };
    updateDirection();
    const observer = new MutationObserver(updateDirection);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsMobile(isMobileOrTablet());
  }, []);

  const translations = {
    title: t("recordsFor"), 
    date: t("date"),
    amount: t("amount"),
    currency: t("currency"),
    details: t("details"),
    youOwed: t("youOwed"),
    youOwe: t("youOwe"),
    netYouOwe: t("netYouOwe"),
    netYouOwed: t("netYouOwed"),
  };

  useEffect(() => {
    if (!isMobile) return;

    const generateAndOpen = async () => {
      setLoading(true);
      try {
        const blob = await pdf(
          <PersonalPdfTemplate
            direction={direction}
            translations={translations}
          />,
        ).toBlob();
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

  // Safe to conditionally return AFTER all hooks have run
  if (!selectedRecordArray) {
    notFound();
  }

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
      <PersonalPdfTemplate direction={direction} translations={translations} />
    </PDFViewer>
  );
}
