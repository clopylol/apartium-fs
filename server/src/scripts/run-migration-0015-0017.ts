/**
 * Script to run expense allocation migrations in order:
 * 1. 0015: Create expense_allocations table
 * 2. 0016: Add distribution_type to expense_records table
 * 3. 0017: Add area to units table
 * 
 * Usage: npx tsx server/src/scripts/run-migration-0015-0017.ts
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
                    error?.message?.includes('already exists') ||
                    error?.message?.includes('column') && error?.message?.includes('already exists')) {
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
        console.log('🚀 Starting Expense Allocation Migrations');
        console.log('='.repeat(60));

        // Migration 0015: Create expense_allocations table
        await runMigration('0015_add_expense_allocations', 'Create expense_allocations table');

        // Migration 0016: Add distribution_type to expense_records table
        await runMigration('0016_add_distribution_type_to_expenses', 'Add distribution_type to expense_records table');

        // Migration 0017: Add area to units table
        await runMigration('0017_add_area_to_units', 'Add area to units table');

        console.log('\n' + '='.repeat(60));
        console.log('✅ All migrations completed successfully!');
        console.log('='.repeat(60));
        console.log('\n📋 Summary:');
        console.log('   ✅ Created expense_allocations table');
        console.log('   ✅ Created indexes for expense_allocations');
        console.log('   ✅ Created enum_expense_distribution_type enum');
        console.log('   ✅ Added distribution_type column to expense_records table');
        console.log('   ✅ Added area column to units table');
        
        process.exit(0);
    } catch (error: any) {
        console.error('\n❌ Migration process failed:', error);
        process.exit(1);
    }
}

runAllMigrations();

