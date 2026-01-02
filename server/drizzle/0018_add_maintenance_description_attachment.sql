-- Add description and attachmentUrl columns to maintenance_requests table
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS attachment_url TEXT;
