ALTER TABLE "facilities" ADD COLUMN "site_id" uuid;
DO $$ BEGIN
 ALTER TABLE "facilities" ADD CONSTRAINT "facilities_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
