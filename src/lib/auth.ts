// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema"; // Ensure this import is used if needed

export const auth = betterAuth({

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