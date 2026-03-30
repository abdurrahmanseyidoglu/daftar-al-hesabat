"use client";

import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
const openAddAmountModal = () => {
  console.log("Clicked");
};
export default function HomePage() {
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
      <Button variant="outlined" sx={{ p: 6 }} onClick={openAddAmountModal}>
        <Typography fontSize={"3rem"}>Add a new amount</Typography>
        <AddCircleOutlineIcon sx={{ fontSize: "4rem", marginInlineStart: 3 }} />
      </Button>
    </Box>
  );
}
