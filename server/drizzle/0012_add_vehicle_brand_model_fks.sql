-- Migration: Add brand_id and model_id foreign keys to vehicles table
-- This migration adds foreign key relationships to vehicle_brands and vehicle_models tables

-- Step 1: Add brand_id column to vehicles table (nullable for custom brands)
ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "brand_id" uuid;
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_brand_id_fk" 
    FOREIGN KEY ("brand_id") REFERENCES "vehicle_brands"("id") ON DELETE SET NULL;

-- Step 2: Add model_id column to vehicles table (nullable for custom models)
ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "model_id" uuid;
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_model_id_fk" 
    FOREIGN KEY ("model_id") REFERENCES "vehicle_models"("id") ON DELETE SET NULL;

-- Step 3: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "vehicles_brand_id_idx" ON "vehicles"("brand_id");
CREATE INDEX IF NOT EXISTS "vehicles_model_id_idx" ON "vehicles"("model_id");

