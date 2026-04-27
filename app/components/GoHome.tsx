import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import { useTranslations } from "next-intl";
export const GoHome = () => {
  const t = useTranslations();
  return (
    <Link href={"/"}>
      <Tooltip title={t("homePage")}>
        <IconButton aria-label="home" sx={{ padding: 2 }}>
          <CottageOutlinedIcon sx={{ color: "#ffffff" }} />
        </IconButton>
      </Tooltip>
    </Link>
  );
};
