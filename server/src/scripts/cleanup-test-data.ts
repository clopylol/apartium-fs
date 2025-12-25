/**
 * Script to clean up test data (residents, units, vehicles, guest_visits)
 * 
 * Usage: npx tsx server/src/scripts/cleanup-test-data.ts
 */

import { db } from '../db/index.js';
import * as schema from 'apartium-shared';
import { sql } from 'drizzle-orm';

async function cleanupTestData() {
    try {
        console.log('🧹 Starting cleanup of test data...\n');

        // Sırayla sil (foreign key constraint'leri nedeniyle)
        console.log('1️⃣  Deleting guest visits...');
        await db.delete(schema.guestVisits);
        console.log('   ✅ Guest visits deleted\n');

        console.log('2️⃣  Deleting vehicles...');
        await db.delete(schema.vehicles);
        console.log('   ✅ Vehicles deleted\n');

        console.log('3️⃣  Deleting residents...');
        await db.delete(schema.residents);
        console.log('   ✅ Residents deleted\n');

        console.log('4️⃣  Deleting units...');
        await db.delete(schema.units);
        console.log('   ✅ Units deleted\n');

        // Sonuçları kontrol et
        const [unitsCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(schema.units);
        const [residentsCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(schema.residents);
        const [vehiclesCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(schema.vehicles);
        const [guestVisitsCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(schema.guestVisits);

        console.log('='.repeat(60));
        console.log('✅ Cleanup completed successfully!');
        console.log('='.repeat(60));
        console.log('\n📊 Remaining records:');
        console.log(`   Units: ${unitsCount.count}`);
        console.log(`   Residents: ${residentsCount.count}`);
        console.log(`   Vehicles: ${vehiclesCount.count}`);
        console.log(`   Guest Visits: ${guestVisitsCount.count}`);
        
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Cleanup failed:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

cleanupTestData();

