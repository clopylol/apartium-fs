-- Migration: Add Sites Table and Update Buildings
-- This migration adds a sites table and links buildings to sites

-- Step 1: Create sites table
CREATE TABLE IF NOT EXISTS "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text,
	"total_buildings" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);

-- Step 2: Create a default site for existing buildings
INSERT INTO "sites" (name, address, total_buildings, created_at, updated_at)
VALUES ('Varsayılan Site', NULL, 0, NOW(), NOW());

-- Step 3: Add site_id column to buildings (nullable first)
ALTER TABLE "buildings" ADD COLUMN "site_id" uuid;

-- Step 4: Set site_id for all existing buildings to the default site
UPDATE "buildings" 
SET "site_id" = (SELECT id FROM "sites" WHERE name = 'Varsayılan Site' LIMIT 1)
WHERE "site_id" IS NULL;

-- Step 5: Make site_id NOT NULL and add foreign key constraint
ALTER TABLE "buildings" ALTER COLUMN "site_id" SET NOT NULL;
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_site_id_sites_id_fk" 
    FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE cascade ON UPDATE no action;

-- Step 6: Remove address column from buildings (moved to sites)
ALTER TABLE "buildings" DROP COLUMN IF EXISTS "address";

-- Step 7: Update total_buildings count for the default site
UPDATE "sites" 
SET "total_buildings" = (SELECT COUNT(*) FROM "buildings" WHERE "site_id" = "sites"."id")
WHERE name = 'Varsayılan Site';

