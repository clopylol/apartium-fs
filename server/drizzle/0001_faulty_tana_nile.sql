CREATE TYPE "public"."enum_announcement_priority" AS ENUM('High', 'Medium', 'Low');--> statement-breakpoint
CREATE TYPE "public"."enum_announcement_status" AS ENUM('Published', 'Scheduled', 'Draft');--> statement-breakpoint
CREATE TYPE "public"."enum_booking_status" AS ENUM('confirmed', 'pending', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."enum_cargo_status" AS ENUM('received', 'delivered', 'returned');--> statement-breakpoint
CREATE TYPE "public"."enum_cargo_type" AS ENUM('Small', 'Medium', 'Large');--> statement-breakpoint
CREATE TYPE "public"."enum_community_request_status" AS ENUM('pending', 'in-progress', 'resolved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."enum_community_request_type" AS ENUM('wish', 'suggestion');--> statement-breakpoint
CREATE TYPE "public"."enum_courier_method" AS ENUM('app', 'manual');--> statement-breakpoint
CREATE TYPE "public"."enum_courier_status" AS ENUM('pending', 'inside', 'completed');--> statement-breakpoint
CREATE TYPE "public"."enum_facility_status" AS ENUM('open', 'closed', 'maintenance');--> statement-breakpoint
CREATE TYPE "public"."enum_guest_visit_source" AS ENUM('app', 'manual', 'phone');--> statement-breakpoint
CREATE TYPE "public"."enum_guest_visit_status" AS ENUM('pending', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."enum_janitor_request_status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TYPE "public"."enum_janitor_request_type" AS ENUM('trash', 'market', 'cleaning', 'bread', 'other');--> statement-breakpoint
CREATE TYPE "public"."enum_janitor_status" AS ENUM('on-duty', 'off-duty', 'passive');--> statement-breakpoint
CREATE TYPE "public"."enum_maintenance_category" AS ENUM('Tesisat', 'Elektrik', 'Isıtma/Soğutma', 'Genel');--> statement-breakpoint
CREATE TYPE "public"."enum_maintenance_priority" AS ENUM('Low', 'Medium', 'High', 'Urgent');--> statement-breakpoint
CREATE TYPE "public"."enum_maintenance_status" AS ENUM('New', 'In Progress', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."enum_poll_status" AS ENUM('active', 'closed');--> statement-breakpoint
CREATE TYPE "public"."enum_transaction_category" AS ENUM('Gelir', 'Gider');--> statement-breakpoint
CREATE TYPE "public"."enum_transaction_status" AS ENUM('completed', 'pending');--> statement-breakpoint
CREATE TYPE "public"."enum_vote_choice" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"priority" "enum_announcement_priority" DEFAULT 'Medium' NOT NULL,
	"visibility" varchar(100) DEFAULT 'All Residents' NOT NULL,
	"status" "enum_announcement_status" DEFAULT 'Draft' NOT NULL,
	"publish_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"resident_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"booking_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"status" "enum_booking_status" DEFAULT 'pending' NOT NULL,
	"note" text,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cargo_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"tracking_no" varchar(100),
	"carrier" varchar(100) NOT NULL,
	"arrival_date" date NOT NULL,
	"arrival_time" time NOT NULL,
	"status" "enum_cargo_status" DEFAULT 'received' NOT NULL,
	"delivered_date" timestamp with time zone,
	"cargo_type" "enum_cargo_type" DEFAULT 'Medium' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"type" "enum_community_request_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "enum_community_request_status" DEFAULT 'pending' NOT NULL,
	"request_date" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courier_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resident_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"company" varchar(100) NOT NULL,
	"status" "enum_courier_status" DEFAULT 'pending' NOT NULL,
	"entry_time" timestamp with time zone,
	"exit_time" timestamp with time zone,
	"method" "enum_courier_method" DEFAULT 'manual' NOT NULL,
	"note" text,
	"plate" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expected_cargo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resident_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"tracking_no" varchar(100),
	"carrier" varchar(100) NOT NULL,
	"expected_date" date NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"image_url" text,
	"status" "enum_facility_status" DEFAULT 'open' NOT NULL,
	"hours" varchar(100),
	"capacity" integer DEFAULT 10 NOT NULL,
	"requires_booking" boolean DEFAULT true NOT NULL,
	"price_per_hour" numeric(8, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guest_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_id" uuid NOT NULL,
	"parking_spot_id" uuid,
	"plate" varchar(20) NOT NULL,
	"guest_name" varchar(255),
	"model" varchar(100),
	"color" varchar(50),
	"status" "enum_guest_visit_status" DEFAULT 'pending' NOT NULL,
	"source" "enum_guest_visit_source" DEFAULT 'manual' NOT NULL,
	"expected_date" date NOT NULL,
	"duration_days" integer DEFAULT 1 NOT NULL,
	"entry_time" timestamp with time zone,
	"exit_time" timestamp with time zone,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "janitor_block_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"janitor_id" uuid NOT NULL,
	"building_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "janitor_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resident_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"building_id" uuid NOT NULL,
	"assigned_janitor_id" uuid,
	"type" "enum_janitor_request_type" NOT NULL,
	"status" "enum_janitor_request_status" DEFAULT 'pending' NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "janitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"avatar" text,
	"status" "enum_janitor_status" DEFAULT 'off-duty' NOT NULL,
	"tasks_completed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "maintenance_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resident_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" "enum_maintenance_category" NOT NULL,
	"priority" "enum_maintenance_priority" DEFAULT 'Medium' NOT NULL,
	"status" "enum_maintenance_status" DEFAULT 'New' NOT NULL,
	"request_date" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parking_spots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"building_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"floor" integer DEFAULT -1 NOT NULL,
	"status" varchar(20) DEFAULT 'available',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" uuid NOT NULL,
	"resident_id" uuid NOT NULL,
	"choice" "enum_vote_choice" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"status" "enum_poll_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar(255) NOT NULL,
	"category" "enum_transaction_category" NOT NULL,
	"sub_category" varchar(100),
	"transaction_date" date NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" "enum_transaction_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resident_id" uuid NOT NULL,
	"parking_spot_id" uuid,
	"plate" varchar(20) NOT NULL,
	"model" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_plate_unique" UNIQUE("plate")
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_resident_id_residents_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cargo_items" ADD CONSTRAINT "cargo_items_recipient_id_residents_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cargo_items" ADD CONSTRAINT "cargo_items_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_requests" ADD CONSTRAINT "community_requests_author_id_residents_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_requests" ADD CONSTRAINT "community_requests_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courier_visits" ADD CONSTRAINT "courier_visits_resident_id_residents_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courier_visits" ADD CONSTRAINT "courier_visits_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expected_cargo" ADD CONSTRAINT "expected_cargo_resident_id_residents_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expected_cargo" ADD CONSTRAINT "expected_cargo_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest_visits" ADD CONSTRAINT "guest_visits_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest_visits" ADD CONSTRAINT "guest_visits_parking_spot_id_parking_spots_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "janitor_block_assignments" ADD CONSTRAINT "janitor_block_assignments_janitor_id_janitors_id_fk" FOREIGN KEY ("janitor_id") REFERENCES "public"."janitors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "janitor_block_assignments" ADD CONSTRAINT "janitor_block_assignments_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "janitor_requests" ADD CONSTRAINT "janitor_requests_resident_id_residents_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "janitor_requests" ADD CONSTRAINT "janitor_requests_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "janitor_requests" ADD CONSTRAINT "janitor_requests_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "janitor_requests" ADD CONSTRAINT "janitor_requests_assigned_janitor_id_janitors_id_fk" FOREIGN KEY ("assigned_janitor_id") REFERENCES "public"."janitors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_resident_id_residents_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parking_spots" ADD CONSTRAINT "parking_spots_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_resident_id_residents_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls" ADD CONSTRAINT "polls_author_id_residents_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_resident_id_residents_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_parking_spot_id_parking_spots_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spots"("id") ON DELETE set null ON UPDATE no action;