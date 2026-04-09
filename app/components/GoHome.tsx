import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
export const GoHome = () => {
  return (
    <Link href={"/"}>
      <Tooltip title={"Go Home"}>
        <IconButton aria-label="home" sx={{ padding: 2 }}>
          <CottageOutlinedIcon sx={{ color: "#ffffff" }} />
        </IconButton>
      </Tooltip>
    </Link>
  );
};
