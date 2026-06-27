/**
 * @file src/lib/auth.ts
 * @description Better Auth Server-side Configuration
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. WHAT IS BETTER AUTH?
 *    Better Auth is a modern, TypeScript-first, developer-friendly authentication framework for web applications. 
 *    Unlike cloud providers (like Clerk or Auth0), Better Auth runs locally within your server environment (fully self-hosted), 
 *    storing session data directly in your database. This gives you complete control over your users' data, avoids vendor lock-in, 
 *    and removes subscription paywalls.
 * 
 * 2. WHAT IS A DATABASE ADAPTER (drizzleAdapter)?
 *    An adapter acts as a bridge between the authentication library (Better Auth) and the database ORM (Drizzle). 
 *    Better Auth needs to read, write, and verify users, sessions, and verification tokens. The `drizzleAdapter` allows 
 *    Better Auth to query the database using Drizzle ORM syntax and your established database schemas.
 * 
 * 3. AUTHENTICATION FLOWS:
 *    - Traditional Credential Login: Enabled via `emailAndPassword`. It hashes passwords securely using algorithms like bcrypt 
 *      or scrypt under the hood before storing them.
 *    - OAuth Social Login: Enabled via `socialProviders`. Users log in via Github or Google. Better Auth manages the exchange of 
 *      authorization codes for access tokens, retrieves the user profile, and creates a user account record.
 * 
 * 4. CONFIGURATION DETAILS:
 *    - `socialProviders`: Connects client credentials (OAuth client IDs/secrets) securely from env variables.
 *    - `database`: Bridges the adapter with the Drizzle client (`db`) and our database tables (`schema`).
 *    - `emailAndPassword`: Enables secure email/password account creation and login flows.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema"; 

export const auth = betterAuth({
    // 1. Configure OAuth / Social Providers (Github, Google)
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

    // 2. Map authentication operations to database tables using Drizzle
    database: drizzleAdapter(db, {
        provider: "pg", // Specify PostgreSQL dialect
        schema: {
            ...schema, // Import schema configurations to let Better Auth map structures
        },
    }),
    
    // 3. Enable standard email and password authentication
    emailAndPassword: {
        enabled: true, 
    },
});