-- Safe migration: Only add building_id column to announcements table
-- This script only adds the building_id column without affecting other tables

-- Check if column already exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'announcements' 
        AND column_name = 'building_id'
    ) THEN
        ALTER TABLE "announcements" ADD COLUMN "building_id" uuid;
        ALTER TABLE "announcements" ADD CONSTRAINT "announcements_building_id_buildings_id_fk" 
            FOREIGN KEY ("building_id") REFERENCES "buildings"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION;
        RAISE NOTICE 'building_id column added successfully';
    ELSE
        RAISE NOTICE 'building_id column already exists';
    END IF;
END $$;

