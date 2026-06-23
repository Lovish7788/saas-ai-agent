import 'dotenv/config'; // <--- MUST BE THE FIRST LINE
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema.ts', // Make sure this file exists!
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});