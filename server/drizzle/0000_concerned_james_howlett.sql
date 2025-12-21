CREATE TYPE "public"."enum_expense_category" AS ENUM('utilities', 'maintenance', 'personnel', 'general');--> statement-breakpoint
CREATE TYPE "public"."enum_expense_status" AS ENUM('paid', 'pending');--> statement-breakpoint
CREATE TYPE "public"."enum_payment_status" AS ENUM('paid', 'unpaid');--> statement-breakpoint
CREATE TYPE "public"."enum_payment_type" AS ENUM('aidat', 'demirbas', 'yakit');--> statement-breakpoint
CREATE TYPE "public"."enum_resident_type" AS ENUM('owner', 'tenant');--> statement-breakpoint
CREATE TYPE "public"."enum_unit_status" AS ENUM('occupied', 'empty');--> statement-breakpoint
CREATE TYPE "public"."enum_user_role" AS ENUM('admin', 'manager', 'staff');--> statement-breakpoint
CREATE TABLE "buildings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" text,
	"floor_count" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" "enum_expense_category" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"expense_date" date NOT NULL,
	"status" "enum_expense_status" DEFAULT 'pending' NOT NULL,
	"description" text,
	"attachment_url" text,
	"period_month" varchar(20) NOT NULL,
	"period_year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resident_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"type" "enum_payment_type" DEFAULT 'aidat' NOT NULL,
	"status" "enum_payment_status" DEFAULT 'unpaid' NOT NULL,
	"payment_date" timestamp with time zone,
	"period_month" varchar(20) NOT NULL,
	"period_year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "residents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "enum_resident_type" NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255),
	"avatar" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"building_id" uuid NOT NULL,
	"number" varchar(20) NOT NULL,
	"floor" integer NOT NULL,
	"status" "enum_unit_status" DEFAULT 'empty' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "enum_user_role" DEFAULT 'staff' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_resident_id_residents_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "residents" ADD CONSTRAINT "residents_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;