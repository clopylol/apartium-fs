-- Recreate announcements table with building_id column
-- This migration drops and recreates the announcements table to include building_id

-- Drop foreign key constraints first
ALTER TABLE "announcements" 
DROP CONSTRAINT IF EXISTS "announcements_author_id_users_id_fk";

ALTER TABLE "announcements" 
DROP CONSTRAINT IF EXISTS "announcements_building_id_buildings_id_fk";

-- Drop the table
DROP TABLE IF EXISTS "announcements" CASCADE;

-- Recreate announcements table with building_id
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"building_id" uuid,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"priority" "enum_announcement_priority" DEFAULT 'Medium' NOT NULL,
	"visibility" varchar(100) DEFAULT 'All Residents' NOT NULL,
	"status" "enum_announcement_status" DEFAULT 'Draft' NOT NULL,
	"publish_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);

-- Add foreign key constraints
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

