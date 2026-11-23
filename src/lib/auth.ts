// src/lib/auth.ts
// This is the main server-side configuration for BetterAuth.
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dns from "dns";

// Force Google DNS locally so MongoDB Atlas SRV records resolve on Windows.
// Vercel's own resolver handles this, and overriding it there can break lookups.
if (!process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { 
    enabled: true 
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer", 
        // New sign-ups (including Google) are always customers; only an admin
        // can promote an account through the admin dashboard endpoint.
        input: false, 
      },
    },
  },
  plugins: [jwt()],
});