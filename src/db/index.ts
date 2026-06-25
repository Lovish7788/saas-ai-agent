// Database Connection Configuration
// This file establishes the PostgreSQL database connection using Drizzle ORM and Neon HTTP client.
import { drizzle } from 'drizzle-orm/neon-http';

// Exports the database instance initialized with the environment variable connection string.
export const db = drizzle(process.env.DATABASE_URL!);