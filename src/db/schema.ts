// Database Schema Definitions
// This file defines the PostgreSQL database schema for Drizzle ORM, mapping users, sessions, accounts, and verifications.
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

// Define the core 'user' table mapping system users and their metadata.
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

// Define the 'session' table representing active login sessions for users.
export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }), // Cascades delete if the owner user is deleted
    },
    (table) => [index("session_userId_idx").on(table.userId)], // Indexes userId field for query performance
);

// Define the 'account' table representing connected credentials/OAuth providers (Google, GitHub, etc.) for users.
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
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)], // Indexes userId
);

// Define the 'verification' table for storage of email and password verification/reset tokens.
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
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)], // Indexes verification identifier
);