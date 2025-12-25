-- Migration: Add vehicle_brands and vehicle_models tables
-- This migration creates tables to store vehicle brands and models in the database

-- Step 1: Create vehicle_brands table
CREATE TABLE IF NOT EXISTS "vehicle_brands" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(100) NOT NULL UNIQUE,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone
);

-- Step 2: Create vehicle_models table
CREATE TABLE IF NOT EXISTS "vehicle_models" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "brand_id" uuid NOT NULL REFERENCES "vehicle_brands"("id") ON DELETE cascade,
    "name" varchar(100) NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    UNIQUE("brand_id", "name")
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS "vehicle_models_brand_id_idx" ON "vehicle_models"("brand_id");
CREATE INDEX IF NOT EXISTS "vehicle_brands_name_idx" ON "vehicle_brands"("name");

