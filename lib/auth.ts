import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      scopes: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/drive.appdata",
        "https://www.googleapis.com/auth/drive.appfolder",
      ],
      prompt: "select_account consent",
    },
  },
  plugins: [nextCookies()],
});
