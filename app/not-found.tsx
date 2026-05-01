"use client";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useTranslations } from "next-intl";
export default function NotFound() {
  const t = useTranslations();
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <SearchOffIcon sx={{ fontSize: 80, color: "text.secondary" }} />

        <Typography
          variant="h1"
          sx={{ fontSize: "6rem", fontWeight: 700, color: "text.secondary" }}
        >
          404
        </Typography>

        <Typography variant="h4" fontWeight={600}>
        {t("pageNotFound")}
        </Typography>

        <Typography variant="body1" color="text.secondary" maxWidth={360}>
          {t("404ErrorMessage")}
        </Typography>

        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          sx={{ mt: 1, borderRadius: 2, px: 4 }}
        >
          {t("returnHome")}
        </Button>
      </Box>
    </Container>
  );
}
