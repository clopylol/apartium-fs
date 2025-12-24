// Script to apply building_id migration to announcements table
import { db } from '../db/index.js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
const envPath = join(__dirname, '../../../.env');
dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

async function applyMigration() {
    const sql = postgres(process.env.DATABASE_URL!);
    
    try {
        console.log('🚀 Applying building_id migration...');
        
        // Check if column already exists
        const columnCheck = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'announcements' 
            AND column_name = 'building_id'
        `;
        
        if (columnCheck.length > 0) {
            console.log('✅ building_id column already exists');
        } else {
            // Add column
            await sql`
                ALTER TABLE "announcements" 
                ADD COLUMN "building_id" uuid
            `;
            console.log('✅ building_id column added');
        }
        
        // Check if constraint already exists
        const constraintCheck = await sql`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'announcements_building_id_buildings_id_fk'
            AND table_name = 'announcements'
        `;
        
        if (constraintCheck.length > 0) {
            console.log('✅ Foreign key constraint already exists');
        } else {
            // Add foreign key constraint
            await sql`
                ALTER TABLE "announcements" 
                ADD CONSTRAINT "announcements_building_id_buildings_id_fk" 
                FOREIGN KEY ("building_id") REFERENCES "buildings"("id") 
                ON DELETE SET NULL ON UPDATE NO ACTION
            `;
            console.log('✅ Foreign key constraint added');
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

