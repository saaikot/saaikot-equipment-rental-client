// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// This exposes all BetterAuth endpoints (e.g., /api/auth/sign-in/email, /api/auth/jwks)
export const { POST, GET } = toNextJsHandler(auth);