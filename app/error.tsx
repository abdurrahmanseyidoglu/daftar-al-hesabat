"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Collapse,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTranslations } from "next-intl";
interface ErrorPageProps {
  error: Error & { digest?: string };
}

export default function InternalServerError({ error }: ErrorPageProps) {
  const t = useTranslations();
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (isDev) {
      console.group("🔴 [500] Internal Server Error");
      console.error("Message :", error.message);
      if (error.digest) console.warn("Digest  :", error.digest);
      if (error.stack) console.error("Stack   :\n", error.stack);
      console.groupEnd();
    }
  }, [error, isDev]);

  return (
    <Container maxWidth="lg">
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
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />

        <Typography
          variant="h1"
          sx={{ fontSize: "6rem", fontWeight: 700, color: "text.secondary" }}
        >
          500
        </Typography>

        <Typography variant="h4" fontWeight={600}>
          {t("internalError")}
        </Typography>

        <Typography variant="body1" color="text.secondary" maxWidth={360}>
          {t("500Message")}{" "}
        </Typography>

        {/* Dev-only error details panel */}
        <Collapse in={isDev} unmountOnExit>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              textAlign: "left",
              bgcolor: "grey.50",
              borderColor: "error.light",

              width: "100%",
              borderRadius: 2,
              overflow: "auto",
            }}
          >
            <Typography
              variant="h2"
              component="pre"
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", m: 0 }}
            >
              {error.message}
            </Typography>

            {error.digest && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={1}
              >
                digest: {error.digest}
              </Typography>
            )}

            {error.stack && (
              <Typography
                component="pre"
                color="text.secondary"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  mt: 1,
                  fontSize: "1.7rem",
                  m: 0,
                }}
              >
                {error.stack}
              </Typography>
            )}
          </Paper>
        </Collapse>

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            sx={{ borderRadius: 2, px: 3, mb: 3 }}
          >
            {t("returnHome")}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
