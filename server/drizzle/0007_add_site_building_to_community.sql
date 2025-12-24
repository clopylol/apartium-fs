-- Add site_id and building_id columns to community_requests and polls tables
-- This allows community requests and polls to be associated with a site (for site-wide) 
-- or with a specific building (building_id)

-- ============================================================
-- COMMUNITY REQUESTS
-- ============================================================

-- Add site_id column to community_requests
ALTER TABLE "community_requests" 
ADD COLUMN IF NOT EXISTS "site_id" uuid;

-- Add building_id column to community_requests
ALTER TABLE "community_requests" 
ADD COLUMN IF NOT EXISTS "building_id" uuid;

-- Add foreign key constraint for site_id
ALTER TABLE "community_requests" 
ADD CONSTRAINT "community_requests_site_id_sites_id_fk" 
FOREIGN KEY ("site_id") REFERENCES "sites"("id") 
ON DELETE SET NULL 
ON UPDATE NO ACTION;

-- Add foreign key constraint for building_id
ALTER TABLE "community_requests" 
ADD CONSTRAINT "community_requests_building_id_buildings_id_fk" 
FOREIGN KEY ("building_id") REFERENCES "buildings"("id") 
ON DELETE SET NULL 
ON UPDATE NO ACTION;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "community_requests_site_id_idx" ON "community_requests"("site_id");
CREATE INDEX IF NOT EXISTS "community_requests_building_id_idx" ON "community_requests"("building_id");

-- ============================================================
-- POLLS
-- ============================================================

-- Add site_id column to polls
ALTER TABLE "polls" 
ADD COLUMN IF NOT EXISTS "site_id" uuid;

-- Add building_id column to polls
ALTER TABLE "polls" 
ADD COLUMN IF NOT EXISTS "building_id" uuid;

-- Add foreign key constraint for site_id
ALTER TABLE "polls" 
ADD CONSTRAINT "polls_site_id_sites_id_fk" 
FOREIGN KEY ("site_id") REFERENCES "sites"("id") 
ON DELETE SET NULL 
ON UPDATE NO ACTION;

-- Add foreign key constraint for building_id
ALTER TABLE "polls" 
ADD CONSTRAINT "polls_building_id_buildings_id_fk" 
FOREIGN KEY ("building_id") REFERENCES "buildings"("id") 
ON DELETE SET NULL 
ON UPDATE NO ACTION;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "polls_site_id_idx" ON "polls"("site_id");
CREATE INDEX IF NOT EXISTS "polls_building_id_idx" ON "polls"("building_id");

