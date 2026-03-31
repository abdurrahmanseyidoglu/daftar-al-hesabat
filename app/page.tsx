"use client";

import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React from "react";
import AmountFormModal from "./components/AmountFormModal";

const openAddAmountModal = () => {
  console.log("Clicked");
};
export default function HomePage() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const t = useTranslations();
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button variant="outlined" sx={{ p: 6 }} onClick={handleOpen}>
        <Typography fontSize={"3rem"}>Add a new amount</Typography>
        <AddCircleOutlineIcon sx={{ fontSize: "4rem", marginInlineStart: 3 }} />
      </Button>
      <AmountFormModal open={open} amount={null} onDismiss={handleClose} />
    </Box>
  );
}
