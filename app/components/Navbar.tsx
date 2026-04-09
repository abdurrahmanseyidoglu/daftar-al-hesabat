"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";


import { useModalStore } from "../stores/modalStore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRecordStore } from "../stores/recordStore";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LangaugeSwitcher";

function Navbar() {
  const records = useRecordStore((state) => state.records);
  const t = useTranslations();

  const handleModalStore = useModalStore((state) => state.handleModalState);

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              height: "2.5rem",
              gap: ".5rem",
              alignItems: "center",
              width: "100%",

              justifyContent: "flex-end",
            }}
          >
            {records.length > 0 && (
              <Button
                variant="outlined"
                color="white"
                sx={{ py: 1, px: 4 }}
                onClick={() => handleModalStore(true)}
              >
                <Typography fontSize={"1rem"}>{t("addNew")}</Typography>
                <AddCircleOutlineIcon
                  sx={{ fontSize: "1.5rem", marginInlineStart: 1 }}
                />
              </Button>
            )}
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
