/**
 * Script to run migration 0013: Add site_id and building_id to expense_records table
 * 
 * Usage: npx tsx server/src/scripts/run-migration-0013.ts
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
        console.log('🚀 Starting migration 0013: Add site_id and building_id to expense_records table...\n');

        // Migration SQL dosyasını oku
        const migrationPath = join(__dirname, '../../drizzle/0013_add_site_building_to_expenses.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf-8');

        // SQL komutlarını ayır (yorumları kaldır ve boş satırları temizle)
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

        // SQL komutlarını ayır (her statement'ı ; ile ayır)
        const statements = cleanedSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

        // Her statement'ı çalıştır
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim().length === 0) continue;

            console.log(`Executing statement ${i + 1}/${statements.length}...`);
            console.log(statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));
            
            await db.execute(sql.raw(statement));
            console.log('✅ Statement executed successfully\n');
        }

        console.log('🎉 Migration 0013 completed successfully!');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Migration failed:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

runMigration();

