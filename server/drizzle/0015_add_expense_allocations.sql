-- Create expense_allocations table
CREATE TABLE expense_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expense_records(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    allocated_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT expense_unit_unique UNIQUE(expense_id, unit_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_expense_allocations_expense_id ON expense_allocations(expense_id);
CREATE INDEX idx_expense_allocations_unit_id ON expense_allocations(unit_id);
CREATE INDEX idx_expense_allocations_deleted_at ON expense_allocations(deleted_at) WHERE deleted_at IS NULL;

