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
import ReplayIcon from "@mui/icons-material/Replay";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InternalServerError({ error, reset }: ErrorPageProps) {
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
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />

        <Typography
          variant="h1"
          sx={{ fontSize: "6rem", fontWeight: 700, color: "text.secondary" }}
        >
          500
        </Typography>

        <Typography variant="h4" fontWeight={600}>
          Internal Server Error
        </Typography>

        <Typography variant="body1" color="text.secondary" maxWidth={360}>
          Something went wrong on our end. Please try again, or come back later.
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
              maxWidth: 480,
              width: "100%",
              borderRadius: 2,
              overflow: "auto",
            }}
          >
            <Typography
              variant="caption"
              color="error"
              display="block"
              fontWeight={700}
              mb={0.5}
            >
              DEV ONLY — error details
            </Typography>

            <Typography
              variant="body2"
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
                variant="body2"
                component="pre"
                color="text.secondary"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  mt: 1,
                  fontSize: "0.7rem",
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
            onClick={reset}
            variant="contained"
            size="large"
            startIcon={<ReplayIcon />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Try Again
          </Button>

          <Button
            component={Link}
            href="/"
            variant="outlined"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Return Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
