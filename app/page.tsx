"use client";

import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React from "react";
import RecordFormModal from "./components/RecordFormModal";
import { useRecordStore } from "./stores/recordStore";
import GlobalRecordsTable from "./components/GlobalRecordsTable";
import { useModalStore } from "./stores/modalStore";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function HomePage() {
  const handleModalStore = useModalStore((state) => state.handleModalState);
  const t = useTranslations();
  const records = useRecordStore((state) => state.records);
  return (
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
      <SnackbarProvider />

      {records.length === 0 && (
        <Button
          variant="outlined"
          sx={{ p: 6 }}
          onClick={() => handleModalStore(true)}
        >
          <Typography fontSize={"3rem"}>{t("addAmount")}</Typography>
          <AddCircleOutlineIcon
            sx={{ fontSize: "4rem", marginInlineStart: 3 }}
          />
        </Button>
      )}
      {records.length > 0 && <GlobalRecordsTable />}
      <RecordFormModal />
    </Box>
  );
}
