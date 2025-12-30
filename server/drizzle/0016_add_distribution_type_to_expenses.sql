-- Create enum for expense distribution type
CREATE TYPE enum_expense_distribution_type AS ENUM ('equal', 'area_based');

-- Add distribution_type column to expense_records table
ALTER TABLE expense_records 
ADD COLUMN distribution_type enum_expense_distribution_type NOT NULL DEFAULT 'equal';

