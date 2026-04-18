"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import { useModalStore } from "../stores/modalStore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRecordStore } from "../stores/recordStore";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LangaugeSwitcher";
import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import { GoHome } from "./GoHome";
import CurrencySelector from "./CurrencySelector";
import { exportToCSV } from "@/utils";

function Navbar() {
  const records = useRecordStore((state) => state.records);
  const t = useTranslations();
  const handleExportClick = () => {
    exportToCSV(records, "test1");
  };
  const handleModalState = useModalStore((state) => state.handleModalState);

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
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <GoHome />

            <Box
              sx={{
                display: "flex",
                height: "2.5rem",
                gap: ".5rem",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {records.length > 0 && (
                <Button
                  variant="outlined"
                  color="white"
                  sx={{ py: 1, px: 4 }}
                  onClick={() => handleModalState(true)}
                >
                  <Typography fontSize={"1rem"}>{t("addNew")}</Typography>
                  <AddCircleOutlineIcon
                    sx={{ fontSize: "1.5rem", marginInlineStart: 1 }}
                  />
                </Button>
              )}
              <CurrencySelector />
              {/* <LanguageSwitcher /> */}
              <Button
                variant="outlined"
                color="white"
                sx={{ py: 1, px: 4 }}
                onClick={handleExportClick}
              >
                Export to CSV
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
