CREATE TYPE "public"."enum_facility_pricing_type" AS ENUM('free', 'per_entry', 'hourly', 'monthly', 'yearly');--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "site_id" uuid;--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "open_time" time;--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "close_time" time;--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "is_open_24_hours" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "pricing_type" "enum_facility_pricing_type" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "price" numeric(8, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilities" DROP COLUMN "price_per_hour";