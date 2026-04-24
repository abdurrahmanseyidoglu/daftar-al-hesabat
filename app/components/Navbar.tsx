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
import { GoHome } from "./GoHome";
import CurrencySelector from "./CurrencySelector";
import {
  exportAllRecordsToCSV,
  exportSinglePersonToCSV,
  getRecordsFilteredByCurrency,
} from "@/lib/utils";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Divider, Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { allCurrencies } from "@/lib/currencies";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  const router = useRouter();

  const records = useRecordStore((state) => state.records);
  const t = useTranslations();
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const pathName = usePathname();
  const setSelectedRecordArray = useRecordStore(
    (state) => state.setSelectedRecordArray,
  );
  const globalRecordsFilteredByCurrency = useMemo(
    () => getRecordsFilteredByCurrency(selectedCurrency, records),
    [selectedCurrency, records],
  );
  const { name } = useParams<{ name: string }>();
  let recordsOwner;
  if (!!name) {
    recordsOwner = decodeURI(name);
  } else {
    recordsOwner = undefined;
  }
  const getRecordsArrayByName = useRecordStore(
    (state) => state.getRecordsArrayByName,
  );

  const handleCSVExportClick = () => {
    if (recordsOwner) {
      const recordsByName = getRecordsArrayByName(recordsOwner);
      const recordsByNameFilteredByCurrency = recordsByName?.filter(
        (r) => r.currency === selectedCurrency,
      );
      if (recordsByNameFilteredByCurrency) {
        exportSinglePersonToCSV(
          recordsOwner,
          recordsByNameFilteredByCurrency,
          selectedCurrency,
        );
      }
    } else {
      exportAllRecordsToCSV(globalRecordsFilteredByCurrency, selectedCurrency);
    }
  };

  const handlePDFExportClick = () => {
    if (recordsOwner) {
      const recordsByName = getRecordsArrayByName(recordsOwner);
      const recordsByNameFilteredByCurrency = recordsByName?.filter(
        (r) => r.currency === selectedCurrency,
      );
      setSelectedRecordArray({
        name: name,
        records: recordsByNameFilteredByCurrency ?? [],
      });
      router.push("/pdf-export-personal");
    } else {
      router.push("/pdf-export");
    }
  };

  const handleModalState = useModalStore((state) => state.handleModalState);

  // Desktop export menu (pdf, csv)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleExportMenuState = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const getUsedCurrencies = () => {
    const usedCurrenciesSet = new Set<string>();
    records.forEach((owner) => {
      owner.records.forEach((record) => {
        usedCurrenciesSet.add(record.currency);
      });
    });
    return allCurrencies.filter((c) => usedCurrenciesSet.has(c.value));
  };
  const usedCurrencies = getUsedCurrencies();

  const navActions = records.length > 0 && (
    <>
      <Button
        variant="outlined"
        color="white"
        sx={{ py: 1, px: 4 }}
        onClick={() => {
          handleModalState(true);
          setDrawerOpen(false);
        }}
      >
        <Typography fontSize={"1rem"}>{t("addNew")}</Typography>
        <AddCircleOutlineIcon
          sx={{ fontSize: "1.5rem", marginInlineStart: 1 }}
        />
      </Button>

      <Button
        id="basic-button"
        aria-controls={open ? "export-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleExportMenuState}
        variant="outlined"
        color="white"
        sx={{ py: 1, px: 4 }}
      >
        Export
      </Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 0.5 }}
        slotProps={{ list: { "aria-labelledby": "basic-button" } }}
      >
        <MenuItem
          onClick={() => {
            handlePDFExportClick();
            handleClose();
            setDrawerOpen(false);
          }}
        >
          Export as PDF
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCSVExportClick();
            handleClose();
            setDrawerOpen(false);
          }}
        >
          Export as CSV
        </MenuItem>
      </Menu>

      <CurrencySelector usedCurrencies={usedCurrencies} />
    </>
  );

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
            {pathName !== "/" && <GoHome />}

            {/* Desktop actions are hidden on md and below */}
            <Box
              sx={{
                display: { xs: "none", md: "none", lg: "flex" },
                height: "2.5rem",
                gap: ".5rem",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {navActions}
            </Box>

            {/* Mobile hamburger*/}
            {records.length > 0 && (
              <Box
                sx={{
                  display: { xs: "flex", lg: "none" },
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: "primary.main",
              color: "white",
              px: 2,
              py: 2,
            },
          },
        }}
      >
        {/* Drawer start */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <IconButton
            sx={{
              color: "#ffffff",
            }}
            onClick={toggleDrawer(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer items */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {records.length > 0 && (
            <>
              <Button
                variant="outlined"
                color="white"
                fullWidth
                sx={{ py: 1.5, justifyContent: "center", px: 3, gap: "1rem" }}
                onClick={() => {
                  handleModalState(true);
                  setDrawerOpen(false);
                }}
              >
                <Typography fontSize={"1rem"}>{t("addNew")}</Typography>
                <AddCircleOutlineIcon sx={{ fontSize: "1.5rem" }} />
              </Button>

              <Button
                id="drawer-export-button"
                aria-controls={open ? "drawer-export-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleExportMenuState}
                variant="outlined"
                color="white"
                fullWidth
                sx={{ py: 1.5, px: 3 }}
              >
                Export
              </Button>
              <Menu
                id="drawer-export-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ mt: 0.5 }}
                slotProps={{
                  list: { "aria-labelledby": "drawer-export-button" },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handlePDFExportClick();
                    handleClose();
                    setDrawerOpen(false);
                  }}
                >
                  Export as PDF
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCSVExportClick();
                    handleClose();
                    setDrawerOpen(false);
                  }}
                >
                  Export as CSV
                </MenuItem>
              </Menu>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

              <Box sx={{ px: 1 }}>
                <CurrencySelector usedCurrencies={usedCurrencies} />
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
