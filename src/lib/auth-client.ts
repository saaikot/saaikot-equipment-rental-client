import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: "https://saaikot-equipment-rental-client.vercel.app",
  plugins: [jwtClient(), inferAdditionalFields<typeof auth>()],
});