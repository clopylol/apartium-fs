// Script to create a test announcement for a different user and building
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
        
        // Get all users
        const users = await sql`
            SELECT id, email, name, role 
            FROM users 
            WHERE deleted_at IS NULL 
            ORDER BY created_at DESC 
            LIMIT 5
        `;
        
        console.log('\n📋 Available users:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - ID: ${user.id}`);
        });
        
        // Get all buildings with their sites
        const buildings = await sql`
            SELECT b.id, b.name, b.site_id, s.name as site_name
            FROM buildings b
            JOIN sites s ON b.site_id = s.id
            WHERE b.deleted_at IS NULL
            ORDER BY s.name, b.name
            LIMIT 10
        `;
        
        console.log('\n🏢 Available buildings:');
        buildings.forEach((building, index) => {
            console.log(`${index + 1}. ${building.name} (Site: ${building.site_name}) - ID: ${building.id}`);
        });
        
        if (users.length === 0 || buildings.length === 0) {
            console.log('\n❌ No users or buildings found. Please create some first.');
            process.exit(1);
        }
        
        // Use second user (if exists) or first user, and a different building
        const testUser = users.length > 1 ? users[1] : users[0];
        const testBuilding = buildings.length > 1 ? buildings[1] : buildings[0];
        
        console.log(`\n✅ Selected user: ${testUser.name} (${testUser.email})`);
        console.log(`✅ Selected building: ${testBuilding.name} (Site: ${testBuilding.site_name})`);
        
        // Create test announcement
        const [newAnnouncement] = await db
            .insert(schema.announcements)
            .values({
                authorId: testUser.id,
                buildingId: testBuilding.id,
                title: `[TEST] Başka Kullanıcıdan - ${testBuilding.name} için Duyuru`,
                content: 'Bu bir test duyurusudur. Başka bir kullanıcı tarafından farklı bir apartman için oluşturulmuştur.',
                priority: 'High',
                visibility: testBuilding.name,
                status: 'Published',
                publishDate: new Date(),
            })
            .returning();
        
        console.log('\n🎉 Test announcement created successfully!');
        console.log('Announcement ID:', newAnnouncement.id);
        console.log('Author:', testUser.name);
        console.log('Building:', testBuilding.name);
        console.log('Title:', newAnnouncement.title);
        
        // Check user's site assignments
        const userSites = await sql`
            SELECT s.id, s.name
            FROM user_site_assignments usa
            JOIN sites s ON usa.site_id = s.id
            WHERE usa.user_id = ${testUser.id}
        `;
        
        console.log(`\n📌 User "${testUser.name}" is assigned to sites:`);
        userSites.forEach(site => {
            console.log(`  - ${site.name} (ID: ${site.id})`);
        });
        
        console.log(`\n📌 Test building "${testBuilding.name}" belongs to site: ${testBuilding.site_name}`);
        
        if (userSites.length > 0) {
            const userSiteIds = userSites.map(s => s.id);
            const buildingBelongsToUserSite = userSiteIds.includes(testBuilding.site_id);
            
            if (buildingBelongsToUserSite) {
                console.log('\n✅ This announcement SHOULD be visible to users assigned to this building\'s site');
            } else {
                console.log('\n❌ This announcement SHOULD NOT be visible to users assigned to other sites');
            }
        } else {
            console.log('\n⚠️  User has no site assignments - announcement will only be visible to the author');
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

