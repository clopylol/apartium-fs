/**
 * Migration script to fix expense records with null siteId
 * Building-specific expenses should have siteId set based on their building's siteId
 */

import { db } from '../db/index.js';
import * as schema from 'apartium-shared';
import { eq, isNull, and, isNotNull } from 'drizzle-orm';

async function fixExpenseSiteIds() {
    console.log('Starting expense siteId fix migration...');
    
    try {
        // Find all expenses with buildingId but null siteId
        const expensesToFix = await db
            .select({
                id: schema.expenseRecords.id,
                buildingId: schema.expenseRecords.buildingId,
                title: schema.expenseRecords.title,
            })
            .from(schema.expenseRecords)
            .where(
                and(
                    isNotNull(schema.expenseRecords.buildingId),
                    isNull(schema.expenseRecords.siteId),
                    isNull(schema.expenseRecords.deletedAt)
                )
            );
        
        console.log(`Found ${expensesToFix.length} expenses with buildingId but null siteId`);
        
        if (expensesToFix.length === 0) {
            console.log('No expenses to fix. Migration complete.');
            return;
        }
        
        let fixedCount = 0;
        let errorCount = 0;
        
        for (const expense of expensesToFix) {
            try {
                // Get the building to find its siteId
                const [building] = await db
                    .select({
                        id: schema.buildings.id,
                        siteId: schema.buildings.siteId,
                        name: schema.buildings.name,
                    })
                    .from(schema.buildings)
                    .where(eq(schema.buildings.id, expense.buildingId!))
                    .limit(1);
                
                if (building && building.siteId) {
                    // Update the expense with the building's siteId
                    await db
                        .update(schema.expenseRecords)
                        .set({
                            siteId: building.siteId,
                            updatedAt: new Date(),
                        })
                        .where(eq(schema.expenseRecords.id, expense.id));
                    
                    console.log(`Fixed expense "${expense.title}" (${expense.id}): set siteId to ${building.siteId} from building "${building.name}"`);
                    fixedCount++;
                } else {
                    console.error(`Building not found for expense "${expense.title}" (${expense.id}), buildingId: ${expense.buildingId}`);
                    errorCount++;
                }
            } catch (error: any) {
                console.error(`Error fixing expense "${expense.title}" (${expense.id}):`, error.message);
                errorCount++;
            }
        }
        
        console.log(`\nMigration complete:`);
        console.log(`  - Fixed: ${fixedCount}`);
        console.log(`  - Errors: ${errorCount}`);
        console.log(`  - Total processed: ${expensesToFix.length}`);
        
    } catch (error: any) {
        console.error('Migration failed:', error);
        throw error;
    }
}

// Run the migration
fixExpenseSiteIds()
    .then(() => {
        console.log('Migration script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration script failed:', error);
        process.exit(1);
    });

