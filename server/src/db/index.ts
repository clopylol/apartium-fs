import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from 'apartium-shared';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (2 levels up from server/src/db)
const envPath = join(__dirname, '../../../.env');
console.log('🔍 Looking for .env at:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('❌ Error loading .env:', result.error);
} else {
    console.log('✅ .env loaded successfully');
}
console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Not found');

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });
