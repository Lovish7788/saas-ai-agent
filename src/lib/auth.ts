// Better Auth Server Configuration
// This file initializes and configures the core authentication instance for the server-side API.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema"; // Import the database schema definitions

// Core authentication configuration using better-auth
export const auth = betterAuth({

    // Configures social login providers (OAuth)
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

    // Connects Better Auth to the database using Drizzle Adapter
    database: drizzleAdapter(db, {
        provider: "pg", // Specifies we are using PostgreSQL as our database
        schema: {
            ...schema,
        }, // Passes schema definitions for Better Auth to automatically map tables
    }),
    
    // Configures traditional email and password authentication
    emailAndPassword: {
        enabled: true, // Enables the email/password login flow
    },

});