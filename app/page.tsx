"use client";

import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RecordFormModal from "./components/Modals/RecordFormModal";
import { useRecordStore } from "./stores/recordStore";
import GlobalRecordsTable from "./components/GlobalRecordsTable";
import { useModalStore } from "./stores/modalStore";
import Footer from "./components/Footer";
import { useAppStore } from "./stores/appStore";
import { useEffect } from "react";

export default function HomePage() {
  const handleModalState = useModalStore((state) => state.handleModalState);

  const calculateTotalGlobally = useRecordStore(
    (state) => state.calculateTotalGlobally,
  );
  const resetModalPredefinedProps = useModalStore(
    (state) => state.resetModalPredefinedProps,
  );
  useEffect(() => {
    resetModalPredefinedProps();
  }, []);
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const initialized = useAppStore((state) => state.initialized);

  const calculationObject = initialized
    ? calculateTotalGlobally(selectedCurrency)
    : undefined;

  const t = useTranslations();
  const records = useRecordStore((state) => state.records);
  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          ...(records.length === 0 && {
            alignItems: "center",
            justifyContent: "center",
          }),
        }}
      >
        {records.length === 0 && (
          <Button
            variant="outlined"
            sx={{ padding: { xs: "1.5rem", md: "3rem", lg: "6rem" } }}
            onClick={() => handleModalState(true)}
          >
            <Typography
              sx={{ fontSize: { xs: "1.5rem", md: "2rem", lg: "3rem" } }}
            >
              {t("addAmount")}
            </Typography>
            <AddCircleOutlineIcon
              sx={{
                fontSize: { xs: "2rem", md: "3rem", lg: "4rem" },
                marginInlineStart: 3,
              }}
            />
          </Button>
        )}
        {records.length > 0 && <GlobalRecordsTable />}
        <RecordFormModal />
      </Box>
      {records.length > 0 && (
        <Footer
          totalOn={calculationObject?.totalOnThem}
          totalTo={calculationObject?.totalToThem}
          total={calculationObject?.total}
          direction={calculationObject?.direction}
        />
      )}
    </>
  );
}
