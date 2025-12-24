import postgres from 'postgres';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables - try multiple paths
let envPath = join(__dirname, '../../../../.env');
if (!existsSync(envPath)) {
    // Try from server directory
    envPath = join(__dirname, '../../../.env');
}
const envResult = config({ path: envPath });
if (envResult.error && !process.env.DATABASE_URL) {
    console.warn('⚠️  Warning: Could not load .env file:', envResult.error.message);
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
}

async function migrateCommunitySiteBuilding() {
    const sql = postgres(DATABASE_URL);

    try {
        console.log('🔄 Starting community requests and polls site/building migration...\n');

        // ============================================================
        // MIGRATE COMMUNITY REQUESTS
        // ============================================================
        console.log('📝 Migrating community_requests...');

        // Update community_requests: unitId -> units -> buildings -> sites
        const requestsResult = await sql`
            UPDATE community_requests cr
            SET 
                building_id = u.building_id,
                site_id = b.site_id
            FROM units u
            INNER JOIN buildings b ON u.building_id = b.id
            WHERE cr.unit_id = u.id
                AND cr.building_id IS NULL
                AND cr.site_id IS NULL
                AND cr.deleted_at IS NULL;
        `;

        console.log(`✅ Updated ${requestsResult.count} community requests\n`);

        // ============================================================
        // MIGRATE POLLS
        // ============================================================
        console.log('📝 Migrating polls...');

        // Update polls: authorId -> residents -> units -> buildings -> sites
        const pollsResult = await sql`
            UPDATE polls p
            SET 
                building_id = u.building_id,
                site_id = b.site_id
            FROM residents r
            INNER JOIN units u ON r.unit_id = u.id
            INNER JOIN buildings b ON u.building_id = b.id
            WHERE p.author_id = r.id
                AND p.building_id IS NULL
                AND p.site_id IS NULL
                AND p.deleted_at IS NULL;
        `;

        console.log(`✅ Updated ${pollsResult.count} polls\n`);

        // ============================================================
        // VERIFICATION
        // ============================================================
        console.log('🔍 Verifying migration...\n');

        const requestsWithoutSiteBuilding = await sql`
            SELECT COUNT(*) as count
            FROM community_requests
            WHERE (building_id IS NULL AND site_id IS NULL)
                AND deleted_at IS NULL;
        `;

        const pollsWithoutSiteBuilding = await sql`
            SELECT COUNT(*) as count
            FROM polls
            WHERE (building_id IS NULL AND site_id IS NULL)
                AND deleted_at IS NULL;
        `;

        console.log(`📊 Community requests without site/building: ${requestsWithoutSiteBuilding[0].count}`);
        console.log(`📊 Polls without site/building: ${pollsWithoutSiteBuilding[0].count}\n`);

        if (requestsWithoutSiteBuilding[0].count > 0 || pollsWithoutSiteBuilding[0].count > 0) {
            console.log('⚠️  Warning: Some records could not be migrated (missing unit/building relationships)');
        } else {
            console.log('✅ All records successfully migrated!');
        }

        console.log('\n✨ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

migrateCommunitySiteBuilding();

