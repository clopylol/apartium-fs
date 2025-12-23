-- Migration: Add User Site Assignments Table
-- Allows assigning users to specific sites for access control

-- Create user_site_assignments table
CREATE TABLE IF NOT EXISTS "user_site_assignments" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "site_id" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "user_site_assignments_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
    CONSTRAINT "user_site_assignments_site_id_sites_id_fk" 
        FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE cascade ON UPDATE no action
);

-- Unique constraint: Bir kullanıcı bir site'a sadece bir kez atanabilir
ALTER TABLE "user_site_assignments" 
ADD CONSTRAINT "user_site_assignments_user_site_unique" 
UNIQUE ("user_id", "site_id");

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "user_site_assignments_user_id_idx" ON "user_site_assignments" ("user_id");
CREATE INDEX IF NOT EXISTS "user_site_assignments_site_id_idx" ON "user_site_assignments" ("site_id");

