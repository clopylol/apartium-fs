/**
 * Script to run migration 0012: Add brand_id and model_id to vehicles table
 * 
 * Usage: 
 *   npx tsx server/src/scripts/run-migration-0012.ts
 *   or
 *   npm run tsx server/src/scripts/run-migration-0012.ts
 */

import { db } from '../db/index.js';
import { sql } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
    try {
        console.log('🚀 Starting migration 0012: Add brand_id and model_id to vehicles table...\n');

        // Migration SQL dosyasını oku
        const migrationPath = join(__dirname, '../../drizzle/0012_add_vehicle_brand_model_fks.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf-8');

        // SQL komutlarını ayır (her satırı ayrı çalıştır)
        const statements = migrationSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

        // Her statement'ı çalıştır
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (!statement || statement.trim().length === 0) continue;

            try {
                console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
                console.log(`   ${statement.substring(0, 100)}...`);
                
                await db.execute(sql.raw(statement));
                
                console.log(`✅ Statement ${i + 1} executed successfully\n`);
            } catch (error: any) {
                // IF NOT EXISTS hatalarını yok say
                if (error?.message?.includes('already exists') || 
                    error?.code === '42P07' || // relation already exists
                    error?.code === '42710') { // duplicate object
                    console.log(`⚠️  Statement ${i + 1} skipped (already exists)\n`);
                    continue;
                }
                throw error;
            }
        }

        console.log('✅ Migration 0012 completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   - Added brand_id column to vehicles table');
        console.log('   - Added model_id column to vehicles table');
        console.log('   - Added foreign key constraints');
        console.log('   - Created indexes for performance');
        
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Migration failed:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

// Script'i çalıştır
runMigration();

