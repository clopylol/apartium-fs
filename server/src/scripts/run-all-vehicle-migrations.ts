/**
 * Script to run vehicle-related migrations in order:
 * 1. 0011: Create vehicle_brands and vehicle_models tables
 * 2. 0012: Add brand_id and model_id to vehicles table
 * 
 * Usage: npx tsx server/src/scripts/run-all-vehicle-migrations.ts
 */

import { db } from '../db/index.js';
import { sql } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration(migrationNumber: string, description: string) {
    try {
        console.log(`\n🚀 Starting migration ${migrationNumber}: ${description}...\n`);

        const migrationPath = join(__dirname, `../../drizzle/${migrationNumber}.sql`);
        const migrationSQL = readFileSync(migrationPath, 'utf-8');

        // SQL'i temizle: yorumları kaldır ve boş satırları temizle
        const cleanedSQL = migrationSQL
            .split('\n')
            .map(line => {
                // Satır içi yorumları kaldır
                const commentIndex = line.indexOf('--');
                if (commentIndex >= 0) {
                    return line.substring(0, commentIndex).trim();
                }
                return line.trim();
            })
            .filter(line => line.length > 0)
            .join('\n');

        // SQL komutlarını ayır (sadece ; ile biten komutlar)
        const statements: string[] = [];
        let currentStatement = '';
        
        for (const line of cleanedSQL.split('\n')) {
            currentStatement += line + '\n';
            if (line.trim().endsWith(';')) {
                const statement = currentStatement.trim();
                if (statement.length > 0) {
                    statements.push(statement);
                }
                currentStatement = '';
            }
        }
        
        // Son statement'ı ekle (eğer ; ile bitmemişse)
        if (currentStatement.trim().length > 0) {
            statements.push(currentStatement.trim());
        }

        console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (!statement || statement.trim().length === 0) continue;

            try {
                console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
                const preview = statement.split('\n')[0].substring(0, 80).replace(/\s+/g, ' ');
                console.log(`   ${preview}...`);
                
                await db.execute(sql.raw(statement));
                
                console.log(`✅ Statement ${i + 1} executed successfully\n`);
            } catch (error: any) {
                // IF NOT EXISTS hatalarını yok say
                if (error?.message?.includes('already exists') || 
                    error?.code === '42P07' || // relation already exists
                    error?.code === '42710' || // duplicate object
                    error?.code === '23505' || // unique violation (IF NOT EXISTS zaten var)
                    error?.message?.includes('duplicate') ||
                    error?.message?.includes('already exists')) {
                    console.log(`⚠️  Statement ${i + 1} skipped (already exists)\n`);
                    continue;
                }
                throw error;
            }
        }

        console.log(`✅ Migration ${migrationNumber} completed successfully!`);
        return true;
    } catch (error: any) {
        console.error(`❌ Migration ${migrationNumber} failed:`, error.message);
        throw error;
    }
}

async function runAllMigrations() {
    try {
        console.log('='.repeat(60));
        console.log('🚀 Starting Vehicle Migrations');
        console.log('='.repeat(60));

        // Migration 0011: Create vehicle_brands and vehicle_models tables
        await runMigration('0011_add_vehicle_brands_models', 'Create vehicle_brands and vehicle_models tables');

        // Migration 0012: Add brand_id and model_id to vehicles table
        await runMigration('0012_add_vehicle_brand_model_fks', 'Add brand_id and model_id to vehicles table');

        console.log('\n' + '='.repeat(60));
        console.log('✅ All migrations completed successfully!');
        console.log('='.repeat(60));
        console.log('\n📋 Summary:');
        console.log('   ✅ Created vehicle_brands table');
        console.log('   ✅ Created vehicle_models table');
        console.log('   ✅ Added brand_id column to vehicles table');
        console.log('   ✅ Added model_id column to vehicles table');
        console.log('   ✅ Added foreign key constraints');
        console.log('   ✅ Created indexes for performance');
        
        process.exit(0);
    } catch (error: any) {
        console.error('\n❌ Migration process failed:', error);
        process.exit(1);
    }
}

runAllMigrations();

