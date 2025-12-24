// Script to create a test announcement for Berkay with a different building
import { db } from '../db/index.js';
import * as schema from 'apartium-shared';
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

async function createTestAnnouncement() {
    const sql = postgres(process.env.DATABASE_URL!);
    
    try {
        console.log('🔍 Fetching users and buildings...');
        
        // Get Berkay user
        const [berkay] = await sql`
            SELECT id, email, name, role 
            FROM users 
            WHERE email = 'berkayertugrulfb@hotmail.com'
            AND deleted_at IS NULL
        `;
        
        if (!berkay) {
            console.log('❌ Berkay user not found');
            process.exit(1);
        }
        
        console.log(`\n✅ Found user: ${berkay.name} (${berkay.email}) - Role: ${berkay.role} - ID: ${berkay.id}`);
        
        // Get Berkay's site assignments
        const berkaySites = await sql`
            SELECT s.id, s.name
            FROM user_site_assignments usa
            JOIN sites s ON usa.site_id = s.id
            WHERE usa.user_id = ${berkay.id}
        `;
        
        console.log(`\n📌 Berkay is assigned to sites:`);
        berkaySites.forEach(site => {
            console.log(`  - ${site.name} (ID: ${site.id})`);
        });
        
        // Get all buildings with their sites
        const buildings = await sql`
            SELECT b.id, b.name, b.site_id, s.name as site_name
            FROM buildings b
            JOIN sites s ON b.site_id = s.id
            WHERE b.deleted_at IS NULL
            ORDER BY s.name, b.name
        `;
        
        console.log('\n🏢 Available buildings:');
        buildings.forEach((building, index) => {
            const isBerkaySite = berkaySites.some(s => s.id === building.site_id);
            const marker = isBerkaySite ? '✅' : '❌';
            console.log(`${marker} ${index + 1}. ${building.name} (Site: ${building.site_name}) - ID: ${building.id}`);
        });
        
        // Find a building that Berkay does NOT have access to
        const berkaySiteIds = berkaySites.map(s => s.id);
        const inaccessibleBuildings = buildings.filter(b => !berkaySiteIds.includes(b.site_id));
        
        if (inaccessibleBuildings.length === 0) {
            console.log('\n⚠️  All buildings belong to Berkay\'s sites. Using a building from a different site...');
            // Use first building that's not in Berkay's sites
            const testBuilding = buildings.find(b => !berkaySiteIds.includes(b.site_id)) || buildings[0];
            
            console.log(`\n✅ Selected building: ${testBuilding.name} (Site: ${testBuilding.site_name})`);
            console.log(`   This building belongs to a site that Berkay is NOT assigned to`);
            
            // Create test announcement
            const [newAnnouncement] = await db
                .insert(schema.announcements)
                .values({
                    authorId: berkay.id,
                    buildingId: testBuilding.id,
                    title: `[TEST] Berkay'dan - ${testBuilding.name} için Duyuru (Erişimi Olmayan Site)`,
                    content: 'Bu bir test duyurusudur. Berkay tarafından erişimi olmayan bir site\'in building\'i için oluşturulmuştur. Bu duyuru Berkay\'a görünmemeli çünkü bu building\'e erişimi yok.',
                    priority: 'High',
                    visibility: testBuilding.name,
                    status: 'Published',
                    publishDate: new Date(),
                })
                .returning();
            
            console.log('\n🎉 Test announcement created successfully!');
            console.log('Announcement ID:', newAnnouncement.id);
            console.log('Author:', berkay.name);
            console.log('Building:', testBuilding.name);
            console.log('Title:', newAnnouncement.title);
            console.log('\n📝 Expected behavior:');
            console.log('   - This announcement should NOT be visible to Berkay');
            console.log('   - Because the building belongs to a site Berkay is not assigned to');
        } else {
            const testBuilding = inaccessibleBuildings[0];
            
            console.log(`\n✅ Selected building: ${testBuilding.name} (Site: ${testBuilding.site_name})`);
            console.log(`   This building belongs to a site that Berkay is NOT assigned to`);
            
            // Create test announcement
            const [newAnnouncement] = await db
                .insert(schema.announcements)
                .values({
                    authorId: berkay.id,
                    buildingId: testBuilding.id,
                    title: `[TEST] Berkay'dan - ${testBuilding.name} için Duyuru (Erişimi Olmayan Site)`,
                    content: 'Bu bir test duyurusudur. Berkay tarafından erişimi olmayan bir site\'in building\'i için oluşturulmuştur. Bu duyuru Berkay\'a görünmemeli çünkü bu building\'e erişimi yok.',
                    priority: 'High',
                    visibility: testBuilding.name,
                    status: 'Published',
                    publishDate: new Date(),
                })
                .returning();
            
            console.log('\n🎉 Test announcement created successfully!');
            console.log('Announcement ID:', newAnnouncement.id);
            console.log('Author:', berkay.name);
            console.log('Building:', testBuilding.name);
            console.log('Title:', newAnnouncement.title);
            console.log('\n📝 Expected behavior:');
            console.log('   - This announcement should NOT be visible to Berkay');
            console.log('   - Because the building belongs to a site Berkay is not assigned to');
        }
        
        // Also create one for a building Berkay HAS access to
        const accessibleBuildings = buildings.filter(b => berkaySiteIds.includes(b.site_id));
        if (accessibleBuildings.length > 0) {
            const accessibleBuilding = accessibleBuildings[0];
            
            const [newAnnouncement2] = await db
                .insert(schema.announcements)
                .values({
                    authorId: berkay.id,
                    buildingId: accessibleBuilding.id,
                    title: `[TEST] Berkay'dan - ${accessibleBuilding.name} için Duyuru (Erişimi Olan Site)`,
                    content: 'Bu bir test duyurusudur. Berkay tarafından erişimi olan bir site\'in building\'i için oluşturulmuştur. Bu duyuru Berkay\'a görünmeli.',
                    priority: 'Medium',
                    visibility: accessibleBuilding.name,
                    status: 'Published',
                    publishDate: new Date(),
                })
                .returning();
            
            console.log('\n🎉 Second test announcement created!');
            console.log('Announcement ID:', newAnnouncement2.id);
            console.log('Building:', accessibleBuilding.name);
            console.log('Title:', newAnnouncement2.title);
            console.log('\n📝 Expected behavior:');
            console.log('   - This announcement SHOULD be visible to Berkay');
            console.log('   - Because the building belongs to a site Berkay is assigned to');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test announcement:', error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

createTestAnnouncement();

