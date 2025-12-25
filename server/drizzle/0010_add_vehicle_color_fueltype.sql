-- Migration: Add color and fuel_type to vehicles table
-- This migration adds color and fuel_type fields to vehicles table

-- Step 1: Add color column to vehicles table
ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "color" varchar(50);

-- Step 2: Add fuel_type column to vehicles table
ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "fuel_type" varchar(20);

