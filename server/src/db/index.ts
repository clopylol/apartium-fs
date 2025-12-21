import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from 'apartium-shared';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });
