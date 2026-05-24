"use client";
import { authClient } from "@/lib/auth-client";
import { Button, Tooltip } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslations } from "next-intl";
const SignInWithGoogle = () => {
  const t = useTranslations();
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <Tooltip title={t("syncTooltip")}>
      <Button
        variant="outlined"
        color="white"
        sx={{ py: 1, px: 4 }}
        onClick={handleGoogleLogin}
      >
        <div className="flex items-center justify-center gap-1">
          <p>{t("login")}</p>
          <GoogleIcon sx={{ color: "#ffffff" }} fontSize="small" />
        </div>
      </Button>
    </Tooltip>
  );
};

export default SignInWithGoogle;
