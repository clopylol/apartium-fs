
import { db } from './src/db';
import { facilities } from 'apartium-shared';
import { desc } from 'drizzle-orm';

async function checkFacilities() {
    console.log('Checking facilities table...');
    const allFacilities = await db.select().from(facilities).orderBy(desc(facilities.createdAt)).limit(5);

    console.log(`Found ${allFacilities.length} facilities.`);
    allFacilities.forEach(f => {
        console.log(`- ID: ${f.id}, Name: ${f.name}, SiteID: ${f.siteId}, Pricing: ${f.pricingType}, Price: ${f.price}`);
    });
    process.exit(0);
}

checkFacilities().catch(console.error);
