-- Migration: Add site_id and building_id columns to expense_records table
-- This allows expenses to be associated with a site or a specific building

-- Add site_id column
ALTER TABLE "expense_records" 
ADD COLUMN IF NOT EXISTS "site_id" uuid;

-- Add foreign key constraint for site_id
ALTER TABLE "expense_records" 
ADD CONSTRAINT "expense_records_site_id_sites_id_fk" 
FOREIGN KEY ("site_id") REFERENCES "sites"("id") 
ON DELETE SET NULL 
ON UPDATE NO ACTION;

-- Add building_id column
ALTER TABLE "expense_records" 
ADD COLUMN IF NOT EXISTS "building_id" uuid;

-- Add foreign key constraint for building_id
ALTER TABLE "expense_records" 
ADD CONSTRAINT "expense_records_building_id_buildings_id_fk" 
FOREIGN KEY ("building_id") REFERENCES "buildings"("id") 
ON DELETE SET NULL 
ON UPDATE NO ACTION;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "expense_records_site_id_idx" ON "expense_records"("site_id");
CREATE INDEX IF NOT EXISTS "expense_records_building_id_idx" ON "expense_records"("building_id");

