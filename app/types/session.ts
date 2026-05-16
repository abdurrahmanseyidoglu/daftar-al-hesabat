import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();
export type AuthSessionType = typeof authClient.$Infer.Session;
