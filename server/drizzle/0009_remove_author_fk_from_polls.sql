-- Remove foreign key constraint from polls.author_id
-- This allows both residents and users (admin/staff) to create polls

-- Drop the existing foreign key constraint
ALTER TABLE "polls" 
DROP CONSTRAINT IF EXISTS "polls_author_id_residents_id_fk";

-- Note: author_id column remains NOT NULL, but now can reference either residents.id or users.id
-- The application logic will handle validation

