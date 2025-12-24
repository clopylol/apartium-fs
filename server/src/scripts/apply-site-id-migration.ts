// Script to apply site_id migration to announcements table
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (same as apply-building-id-migration.ts)
const envPath = join(__dirname, '../../../.env');
dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

async function applyMigration() {
    const sql = postgres(process.env.DATABASE_URL!);
    
    try {
        console.log('🚀 Applying site_id migration to announcements table...');
        
        // Check if column already exists
        const columnCheck = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'announcements' 
            AND column_name = 'site_id'
        `;
        
        if (columnCheck.length > 0) {
            console.log('✅ site_id column already exists');
        } else {
            // Add column
            await sql`
                ALTER TABLE "announcements" 
                ADD COLUMN "site_id" uuid
            `;
            console.log('✅ site_id column added');
        }
        
        // Check if constraint already exists
        const constraintCheck = await sql`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'announcements_site_id_sites_id_fk'
            AND table_name = 'announcements'
        `;
        
        if (constraintCheck.length > 0) {
            console.log('✅ Foreign key constraint already exists');
        } else {
            // Add foreign key constraint
            await sql`
                ALTER TABLE "announcements" 
                ADD CONSTRAINT "announcements_site_id_sites_id_fk" 
                FOREIGN KEY ("site_id") REFERENCES "sites"("id") 
                ON DELETE SET NULL 
                ON UPDATE NO ACTION
            `;
            console.log('✅ Foreign key constraint added');
        }
        
        // Check if index already exists
        const indexCheck = await sql`
            SELECT indexname 
            FROM pg_indexes 
            WHERE tablename = 'announcements' 
            AND indexname = 'announcements_site_id_idx'
        `;
        
        if (indexCheck.length > 0) {
            console.log('✅ Index already exists');
        } else {
            // Create index
            await sql`
                CREATE INDEX "announcements_site_id_idx" ON "announcements"("site_id")
            `;
            console.log('✅ Index created');
        }
        
        console.log('\n🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

applyMigration();

