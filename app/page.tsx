"use client";

import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import RecordFormModal from "./components/Modals/RecordFormModal";
import { useRecordStore } from "./stores/recordStore";
import GlobalRecordsTable from "./components/GlobalRecordsTable";
import { useModalStore } from "./stores/modalStore";
import Footer from "./components/Footer";
import { useAppStore } from "./stores/appStore";
import { useEffect, useState } from "react";
import ConfirmDialog from "./components/ConfirmDialog";
import { createFile, getFileIfExists, readFile } from "@/lib/google-drive";
import { useTokenStore } from "./stores/tokenStore";
import { authClient } from "@/lib/auth-client";
import { isLoggedIn } from "@/lib/utils";

export default function HomePage() {
  const { data: session } = authClient.useSession();
  const handleModalState = useModalStore((state) => state.handleModalState);
  const accessToken = useTokenStore((state) => state.accessToken);
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

  useEffect(() => {
    const hasFile = async () => {
      try {
        const result = await getFileIfExists(accessToken);
        if (result === null) {
          const createResp = await createFile(accessToken, records);
          console.log(createResp);
        } else {
          const fileContent = await readFile(accessToken, result.id);
          //See if there is records in the localStorage
          // if there is ask the user which version he wants to keep 
          // if there is not accept the cloud data
          console.log(fileContent);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    if (isLoggedIn(session)) {
      hasFile();
    }
  }, [session, accessToken]);

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflowY: "scroll",
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
            type="button"
          >
            <Typography
              sx={{ fontSize: { xs: "1.5rem", md: "2rem", lg: "3rem" } }}
            >
              {t("addAmount")}
            </Typography>
            <ControlPointRoundedIcon
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
