-- Remove foreign key constraint from community_requests.author_id
-- This allows both residents and users (admin/staff) to create community requests

-- Drop the existing foreign key constraint
ALTER TABLE "community_requests" 
DROP CONSTRAINT IF EXISTS "community_requests_author_id_residents_id_fk";

-- Note: author_id column remains NOT NULL, but now can reference either residents.id or users.id
-- The application logic will handle validation

