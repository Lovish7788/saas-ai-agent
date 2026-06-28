/**
 * @file src/db/schema.ts
 * @description Database Schema Definition (Drizzle ORM for PostgreSQL)
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. WHY DRIZZLE SCHEMA?
 *    Drizzle allows us to write database schemas in pure TypeScript. This acts as the single source of truth 
 *    for both our database structure (SQL) and our code's type definitions. It ensures complete type safety 
 *    across client, server, and queries.
 * 
 * 2. WHY THESE SPECIFIC TABLES (user, session, account, verification)?
 *    These four tables form the standard schema architecture required by **Better Auth**.
 *    - `user`: Stores basic profile data (name, email, profile image).
 *    - `session`: Stores active user login sessions. Used for session persistence (preventing users from logging out on refresh).
 *    - `account`: Tracks credentials (hashed password) and links social OAuth logins (Google, GitHub) to the same user.
 *    - `verification`: Stores temporary secure tokens for email verification or password resets.
 * 
 * 3. WHY CASCADING DELETES (onDelete: "cascade")?
 *    When a row in the `user` table is deleted, foreign key constraints with `onDelete: "cascade"` ensure that all 
 *    linked `session` and `account` records are automatically deleted by the database engine.
 *    - **Why?** It maintains referential integrity and prevents "orphan records" (dead data occupying disk space).
 * 
 * 4. WHY INDEXES (index)?
 *    We define indexes on foreign keys and unique identifiers (like `userId` and `identifier`):
 *    - **Why?** Every time a user navigates to a page, the server queries the database to check if the session token or 
 *      user ID exists. Without an index, the database performs a slow "Sequential Scan" (checking every row, O(N)). 
 *      An index organizes the data in a B-Tree structure, enabling high-speed "Index Scans" (O(log N)), which 
 *      drastically speeds up user authentication checks.
 */

import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
// 1. Core User Table
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

// 2. Active Login Sessions Table
export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }), // Cascades delete if the owner user is deleted
    },
    (table) => [index("session_userId_idx").on(table.userId)], // Indexes userId field for query performance
);

// 3. Authentication Credentials & OAuth Providers Table
export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(), // Unique user ID within the third-party provider
        providerId: text("provider_id").notNull(), // Provider identifier (e.g. google, github, credentials)
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }), // Links to user
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"), // Stores hashed password when credentials provider is used
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)], // Indexes userId for faster joins
);

// 4. Verification Codes & Passcode Tokens Table
export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(), // Unique identifier (e.g., user's email address)
        value: text("value").notNull(), // The verification token or code
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)], // Indexes verification identifier
);

export const agents = pgTable("agents",{
id: text("id")
.primaryKey()
.$defaultFn(()=> nanoid()),
name: text("name").notNull(),
userId: text("user_id")
.notNull()
.references(() => user.id, { onDelete: "cascade" }),
instructions: text("instructions").notNull(),

createdAt: timestamp("created_at").defaultNow().notNull(),
updatedAt: timestamp("updated_at")
.defaultNow()
.$onUpdate(() => new Date())
.notNull(),

})