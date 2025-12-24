-- Add site_id column to announcements table
-- This allows announcements to be associated with a site (for site-wide announcements)
-- or with a specific building (building_id)

-- Add site_id column
ALTER TABLE "announcements" 
ADD COLUMN IF NOT EXISTS "site_id" uuid;

-- Add foreign key constraint
ALTER TABLE "announcements" 
ADD CONSTRAINT "announcements_site_id_sites_id_fk" 
FOREIGN KEY ("site_id") REFERENCES "sites"("id") 
ON DELETE SET NULL 
ON UPDATE NO ACTION;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS "announcements_site_id_idx" ON "announcements"("site_id");

