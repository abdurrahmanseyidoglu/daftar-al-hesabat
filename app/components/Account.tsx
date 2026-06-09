"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { useTokenStore } from "../stores/tokenStore";
import { getFileIfExists, readFile } from "@/lib/google-drive";
import { useRecordStore } from "../stores/recordStore";
import { RecordsSourceOfTruth } from "../types/recordsSourceOfTruth";
import RecordsDiffsDialog from "./RecordsDiffsDialog";
import { Record } from "../schemas/record.schema";

export default function Account() {
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const accessToken = useTokenStore((state) => state.accessToken);
  const recordsInStore = useRecordStore((state) => state.records);
  const t = useTranslations();
  const { data: session } = authClient.useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [recordMissMatchDialog, setRecordMissMatchDialog] = useState(false);
  const [recordsSourceOfTruth, setRecordsSourceOfTruth] =
    useState<RecordsSourceOfTruth>("local");
  const [cloudRecords, setCloudRecords] = useState<Record[] | null>(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleRecordsDiffClose = () => {
    setRecordMissMatchDialog(false);
  };
  const getAccessToken = async () => {
    const result = await authClient.getAccessToken({
      providerId: "google",
    });

    if (result.error) {
      console.error("Failed to get access token:", result.error);
      return;
    }
    setAccessToken(result.data.accessToken);
  };

  useEffect(() => {
    if (!!accessToken || accessToken.length <= 0) {
      const timer = setTimeout(async () => {
        await getAccessToken();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  // Check if user already has a file in google
  useEffect(() => {
    if (session?.user) {
      const checkFileExistence = async () => {
        const getFileIfExist = await getFileIfExists(accessToken);
        if (getFileIfExist) {
          const id = getFileIfExist.id;
          const resp = await readFile(accessToken || "", id);
          setCloudRecords(resp.records);
          if (true) {
            setRecordMissMatchDialog(true);
          }
        }
      };
      checkFileExistence();
    }
  }, [session]);

  return (
    <>
      <Button
        id="drawer-user-button"
        aria-controls={open ? "drawer-user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleMenuOpen}
        variant="outlined"
        color="white"
        sx={{ py: 1, px: 4 }}
      >
        <div className="flex items-center justify-center gap-2">
          <Avatar
            src={session?.user?.image ?? undefined}
            alt={session?.user?.name ?? "User"}
            sx={{ width: 23, height: 23 }}
          />
          <Typography
            variant="body2"
            noWrap
            sx={{ flex: 1, textAlign: "left" }}
          >
            {session?.user?.name}
          </Typography>
        </div>
      </Button>

      <Menu
        id="drawer-user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        sx={{ mt: 0.5 }}
        slotProps={{
          list: { "aria-labelledby": "drawer-user-button" },
          paper: {
            style: {
              width: anchorEl?.offsetWidth,
            },
          },
        }}
      >
        <MenuItem
          onClick={async () => {
            await authClient.signOut();
            handleMenuClose();
          }}
          sx={{ color: "error.main", gap: 1 }}
        >
          <LogoutIcon fontSize="small" />
          {t("logout")}
        </MenuItem>
      </Menu>
      <RecordsDiffsDialog
        open={recordMissMatchDialog}
        handleRecordsDiffClose={handleRecordsDiffClose}
        cloudRecords={cloudRecords}
        localRecords={recordsInStore}
      />
    </>
  );
}
