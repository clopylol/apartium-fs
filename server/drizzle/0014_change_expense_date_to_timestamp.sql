-- Change expense_date column from date to timestamp with time zone
ALTER TABLE expense_records 
ALTER COLUMN expense_date TYPE timestamp with time zone 
USING expense_date::timestamp with time zone;

