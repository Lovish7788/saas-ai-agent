/**
 * @file src/db/index.ts
 * @description Database Connection Initializer (Drizzle ORM + Neon PostgreSQL)
 * 
 * --- PLACEMENT INTERVIEW BRIEFING ---
 * 
 * 1. WHAT IS DRIZZLE ORM?
 *    Drizzle is a lightweight, type-safe Object-Relational Mapper (ORM) for TypeScript. Unlike heavy ORMs 
 *    (like Prisma), Drizzle is "SQL-like" and has zero runtime overhead. It provides auto-completion for SQL queries 
 *    and maps database tables directly to TypeScript models.
 * 
 * 2. WHAT IS NEON?
 *    Neon is a fully-managed, serverless PostgreSQL database. It features storage-compute separation, meaning it 
 *    can scale database compute resources to zero when idle, saving costs.
 * 
 * 3. WHY NEON HTTP CLIENT (neon-http)?
 *    In serverless environments (like Next.js API routes or Vercel Edge functions), traditional TCP connections 
 *    (connection pools) can exceed limits quickly due to frequent container scaling. We use neon-http (HTTP-based 
 *    connection pooling) to run queries over secure HTTP requests, which avoids TCP handshake overhead and 
 *    connection limits.
 * 
 * 4. CONTROL FLOW:
 *    - Reads the secret connection string `DATABASE_URL` from environment variables (`.env`).
 *    - Initializes `drizzle` with the Neon HTTP driver.
 *    - Exports `db` as the primary client to execute database operations.
 */

import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing!");
}

// Establish the connection and export the db client
export const db = drizzle(process.env.DATABASE_URL);