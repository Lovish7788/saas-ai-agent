// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema"; // Ensure this import is used if needed

export const auth = betterAuth({

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    database: drizzleAdapter(db, {
        provider: "pg", // Specifies we are using PostgreSQL
        schema: {
            ...schema,
        }, // It's good practice to pass your schema here
    }),
    emailAndPassword: {
        enabled: true, // Enables the email/password login flow
    },

});