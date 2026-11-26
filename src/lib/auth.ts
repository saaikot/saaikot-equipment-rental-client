// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient, Db } from "mongodb";
import dns from "dns";

if (!process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
};

if (!globalWithMongo._mongoClient) {

  globalWithMongo._mongoClient = new MongoClient("mongodb://renteasy:renteasy1490@ac-7jnnrov-shard-00-00.oszzosb.mongodb.net:27017,ac-7jnnrov-shard-00-01.oszzosb.mongodb.net:27017,ac-7jnnrov-shard-00-02.oszzosb.mongodb.net:27017/equipment_rental?ssl=true&replicaSet=atlas-zacjyd-shard-0&authSource=admin&retryWrites=true&w=majority");
}

const client = globalWithMongo._mongoClient;
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.NODE_ENV === "production" 
    ? "https://saaikot-equipment-rental-client.vercel.app" 
    : "http://localhost:3001",
  trustedOrigins: [
    "http://localhost:3001",
    "https://saaikot-equipment-rental-client.vercel.app" 
  ],
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
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
        input: false, 
      },
    },
  },
  plugins: [jwt()],
});