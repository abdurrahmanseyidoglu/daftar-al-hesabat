"use client";

import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React from "react";
import AmountFormModal from "./components/RecordFormModal";
import { useRecordStore } from "./stores/recordStore";

export default function HomePage() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
      {true && (
        <Button variant="outlined" sx={{ p: 6 }} onClick={handleOpen}>
          <Typography fontSize={"3rem"}>Add a new amount</Typography>
          <AddCircleOutlineIcon
            sx={{ fontSize: "4rem", marginInlineStart: 3 }}
          />
        </Button>
      )}

      <AmountFormModal open={open} record={null} onDismiss={handleClose} />
      <h1>{records[0]?.name ?? ""}</h1>
    </Box>
  );
}
