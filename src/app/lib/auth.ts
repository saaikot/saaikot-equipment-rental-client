// src/lib/auth.ts
// This is the main server-side configuration for BetterAuth.
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

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
      // We tell BetterAuth to save the 'role' field during registration
      role: {
        type: "string",
        required: true,
        defaultValue: "customer", // Google users will be customers by default
        input: true, 
      },
    },
  },
  // The JWT plugin generates a token that our Express backend will verify via JWKS
  plugins: [jwt()],
});