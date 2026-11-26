// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  // Base URL is automatically picked up from env, but explicitly setting it for safety
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "https://saaikot-equipment-rental-client.vercel.app",
  plugins: [jwtClient(), inferAdditionalFields<typeof auth>()],
});