"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";

export default function Account() {
  const t = useTranslations();
  const { data: session } = authClient.useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        onClose={handleClose}
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
            handleClose();
          }}
          sx={{ color: "error.main", gap: 1 }}
        >
          <LogoutIcon fontSize="small" />
          {t("logout")}
        </MenuItem>
      </Menu>
    </>
  );
}
