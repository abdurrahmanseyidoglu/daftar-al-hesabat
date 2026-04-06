"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import { alpha, InputBase, styled } from "@mui/material";
import { useModalStore } from "../stores/modalStore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRecordStore } from "../stores/recordStore";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LangaugeSwitcher";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];
const notifications = [
  "Test Notification 1",
  "Test Notification 2",
  "Test Notification 3",
];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginInlineEnd: "1rem",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function Navbar() {
  const records = useRecordStore((state) => state.records);
  const t = useTranslations();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotification, setAnchorElNotification] =
    useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };
  const handleModalStore = useModalStore((state) => state.handleModalState);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Burger Menu for mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: "flex", height: "2.5rem", gap: ".5rem" }}>
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

          <Box sx={{ flexGrow: 0 }}>
            {/* !TODO: handle avatar 1- hide if guest, show if logged in either a generic img or users selected profile pic. */}
            {/* <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Profile Pic" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip> */}

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <Box>
            <Tooltip title="Open notifications">
              <IconButton
                onClick={handleOpenNotificationMenu}
                sx={{ p: "1rem", color: "white" }}
              >
                <Badge color="error" badgeContent={1}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="nav-notifications"
              anchorEl={anchorElNotification}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNotification)}
              onClose={handleCloseNotificationMenu}
            >
              {notifications.map((notification) => (
                <MenuItem
                  key={notification}
                  onClick={handleCloseNotificationMenu}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {notification}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
