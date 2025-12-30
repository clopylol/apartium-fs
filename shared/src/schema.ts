// @ts-nocheck
import { pgTable, uuid, varchar, text, integer, boolean, timestamp, decimal, date, time, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// ============================================================
// ENUMS
// ============================================================

// Core Enums
export const residentTypeEnum = pgEnum('enum_resident_type', ['owner', 'tenant']);
export const unitStatusEnum = pgEnum('enum_unit_status', ['occupied', 'empty']);
export const userRoleEnum = pgEnum('enum_user_role', ['admin', 'manager', 'staff', 'resident']);

// Payment & Expense Enums
export const paymentStatusEnum = pgEnum('enum_payment_status', ['paid', 'unpaid']);
export const paymentTypeEnum = pgEnum('enum_payment_type', ['aidat', 'demirbas', 'yakit']);
export const expenseCategoryEnum = pgEnum('enum_expense_category', ['utilities', 'maintenance', 'personnel', 'general']);
export const expenseStatusEnum = pgEnum('enum_expense_status', ['paid', 'pending']);

// Facilities & Bookings Enums
export const facilityStatusEnum = pgEnum('enum_facility_status', ['open', 'closed', 'maintenance']);
export const bookingStatusEnum = pgEnum('enum_booking_status', ['confirmed', 'pending', 'cancelled']);

// Cargo Enums
export const cargoStatusEnum = pgEnum('enum_cargo_status', ['received', 'delivered', 'returned']);
export const cargoTypeEnum = pgEnum('enum_cargo_type', ['Small', 'Medium', 'Large']);
export const courierStatusEnum = pgEnum('enum_courier_status', ['pending', 'inside', 'completed']);
export const courierMethodEnum = pgEnum('enum_courier_method', ['app', 'manual']);

// Guest Visits Enums
export const guestVisitStatusEnum = pgEnum('enum_guest_visit_status', ['pending', 'active', 'completed']);
export const guestVisitSourceEnum = pgEnum('enum_guest_visit_source', ['app', 'manual', 'phone']);

// Maintenance Enums
export const maintenancePriorityEnum = pgEnum('enum_maintenance_priority', ['Low', 'Medium', 'High', 'Urgent']);
export const maintenanceStatusEnum = pgEnum('enum_maintenance_status', ['New', 'In Progress', 'Completed']);
export const maintenanceCategoryEnum = pgEnum('enum_maintenance_category', ['Tesisat', 'Elektrik', 'Isıtma/Soğutma', 'Genel']);

// Announcements Enums
export const announcementPriorityEnum = pgEnum('enum_announcement_priority', ['High', 'Medium', 'Low']);
export const announcementStatusEnum = pgEnum('enum_announcement_status', ['Published', 'Scheduled', 'Draft']);

// Janitor Enums
export const janitorStatusEnum = pgEnum('enum_janitor_status', ['on-duty', 'off-duty', 'passive']);
export const janitorRequestTypeEnum = pgEnum('enum_janitor_request_type', ['trash', 'market', 'cleaning', 'bread', 'other']);
export const janitorRequestStatusEnum = pgEnum('enum_janitor_request_status', ['pending', 'completed']);

// Community Enums
export const communityRequestTypeEnum = pgEnum('enum_community_request_type', ['wish', 'suggestion']);
export const communityRequestStatusEnum = pgEnum('enum_community_request_status', ['pending', 'in-progress', 'resolved', 'rejected']);
export const pollStatusEnum = pgEnum('enum_poll_status', ['active', 'closed']);
export const voteChoiceEnum = pgEnum('enum_vote_choice', ['yes', 'no']);

// Transaction Enums
export const transactionCategoryEnum = pgEnum('enum_transaction_category', ['Gelir', 'Gider']);
export const transactionStatusEnum = pgEnum('enum_transaction_status', ['completed', 'pending']);

// ============================================================
// CORE TABLES
// ============================================================

// Users (Yönetici ve Personel)
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull().default('staff'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Sites (Siteler/Apartmanlar)
export const sites = pgTable('sites', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    address: text('address'),
    totalBuildings: integer('total_buildings').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// User Site Assignments (Kullanıcı-Site Atamaları)
export const userSiteAssignments = pgTable('user_site_assignments', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    siteId: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Buildings (Bloklar)
export const buildings = pgTable('buildings', {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    floorCount: integer('floor_count').notNull().default(5),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Units (Daireler)
export const units = pgTable('units', {
    id: uuid('id').defaultRandom().primaryKey(),
    buildingId: uuid('building_id').notNull().references(() => buildings.id, { onDelete: 'cascade' }),
    number: varchar('number', { length: 20 }).notNull(),
    floor: integer('floor').notNull(),
    status: unitStatusEnum('status').notNull().default('empty'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Residents (Sakinler)
export const residents = pgTable('residents', {
    id: uuid('id').defaultRandom().primaryKey(),
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    type: residentTypeEnum('type').notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }),
    passwordHash: varchar('password_hash', { length: 255 }),
    avatar: text('avatar'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ============================================================
// VEHICLES & PARKING
// ============================================================

// Parking Spots (Otopark Alanları)
export const parkingSpots = pgTable('parking_spots', {
    id: uuid('id').defaultRandom().primaryKey(),
    buildingId: uuid('building_id').notNull().references(() => buildings.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 50 }).notNull(),
    floor: integer('floor').notNull().default(-1),
    status: varchar('status', { length: 20 }).default('available'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Vehicle Brands (Araç Markaları)
export const vehicleBrands = pgTable('vehicle_brands', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Vehicle Models (Araç Modelleri)
export const vehicleModels = pgTable('vehicle_models', {
    id: uuid('id').defaultRandom().primaryKey(),
    brandId: uuid('brand_id').notNull().references(() => vehicleBrands.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Vehicles (Araçlar)
export const vehicles = pgTable('vehicles', {
    id: uuid('id').defaultRandom().primaryKey(),
    residentId: uuid('resident_id').notNull().references(() => residents.id, { onDelete: 'cascade' }),
    parkingSpotId: uuid('parking_spot_id').references(() => parkingSpots.id, { onDelete: 'set null' }),
    plate: varchar('plate', { length: 20 }).notNull().unique(),
    brandId: uuid('brand_id').references(() => vehicleBrands.id, { onDelete: 'set null' }),
    modelId: uuid('model_id').references(() => vehicleModels.id, { onDelete: 'set null' }),
    model: varchar('model', { length: 100 }),
    color: varchar('color', { length: 50 }),
    fuelType: varchar('fuel_type', { length: 20 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Guest Visits (Misafir Ziyaretleri)
export const guestVisits = pgTable('guest_visits', {
    id: uuid('id').defaultRandom().primaryKey(),
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    parkingSpotId: uuid('parking_spot_id').references(() => parkingSpots.id, { onDelete: 'set null' }),
    plate: varchar('plate', { length: 20 }).notNull(),
    guestName: varchar('guest_name', { length: 255 }),
    model: varchar('model', { length: 100 }),
    color: varchar('color', { length: 50 }),
    status: guestVisitStatusEnum('status').notNull().default('pending'),
    source: guestVisitSourceEnum('source').notNull().default('manual'),
    expectedDate: date('expected_date').notNull(),
    durationDays: integer('duration_days').notNull().default(1),
    entryTime: timestamp('entry_time', { withTimezone: true }),
    exitTime: timestamp('exit_time', { withTimezone: true }),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ============================================================
// PAYMENTS & EXPENSES
// ============================================================

// Payment Records (Aidat Ödemeleri)
export const paymentRecords = pgTable('payment_records', {
    id: uuid('id').defaultRandom().primaryKey(),
    residentId: uuid('resident_id').notNull().references(() => residents.id, { onDelete: 'cascade' }),
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    type: paymentTypeEnum('type').notNull().default('aidat'),
    status: paymentStatusEnum('status').notNull().default('unpaid'),
    paymentDate: timestamp('payment_date', { withTimezone: true }),
    periodMonth: varchar('period_month', { length: 20 }).notNull(),
    periodYear: integer('period_year').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Expense Records (Gider Kayıtları)
export const expenseRecords = pgTable('expense_records', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    category: expenseCategoryEnum('category').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    expenseDate: timestamp('expense_date', { withTimezone: true }).notNull(),
    status: expenseStatusEnum('status').notNull().default('pending'),
    description: text('description'),
    attachmentUrl: text('attachment_url'),
    siteId: uuid('site_id').references(() => sites.id, { onDelete: 'set null' }),
    buildingId: uuid('building_id').references(() => buildings.id, { onDelete: 'set null' }),
    periodMonth: varchar('period_month', { length: 20 }).notNull(),
    periodYear: integer('period_year').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ============================================================
// FACILITIES & BOOKINGS
// ============================================================

// Facilities (Ortak Alanlar)
export const facilities = pgTable('facilities', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    imageUrl: text('image_url'),
    status: facilityStatusEnum('status').notNull().default('open'),
    hours: varchar('hours', { length: 100 }),
    capacity: integer('capacity').notNull().default(10),
    requiresBooking: boolean('requires_booking').notNull().default(true),
    pricePerHour: decimal('price_per_hour', { precision: 8, scale: 2 }).notNull().default('0'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Bookings (Rezervasyonlar)
export const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey(),
    facilityId: uuid('facility_id').notNull().references(() => facilities.id, { onDelete: 'cascade' }),
    residentId: uuid('resident_id').notNull().references(() => residents.id, { onDelete: 'cascade' }),
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    bookingDate: date('booking_date').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    status: bookingStatusEnum('status').notNull().default('pending'),
    note: text('note'),
    rejectionReason: text('rejection_reason'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ============================================================
// CARGO MANAGEMENT
// ============================================================

// Cargo Items (Kargo Paketleri)
export const cargoItems = pgTable('cargo_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    recipientId: uuid('recipient_id').notNull().references(() => residents.id, { onDelete: 'cascade' }),
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    trackingNo: varchar('tracking_no', { length: 100 }),
    carrier: varchar('carrier', { length: 100 }).notNull(),
    arrivalDate: date('arrival_date').notNull(),
    arrivalTime: time('arrival_time').notNull(),
    status: cargoStatusEnum('status').notNull().default('received'),
    deliveredDate: timestamp('delivered_date', { withTimezone: true }),
    cargoType: cargoTypeEnum('cargo_type').notNull().default('Medium'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Expected Cargo (Beklenen Kargolar)
export const expectedCargo = pgTable('expected_cargo', {
    id: uuid('id').defaultRandom().primaryKey(),
    residentId: uuid('resident_id').notNull().references(() => residents.id, { onDelete: 'cascade' }),
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    trackingNo: varchar('tracking_no', { length: 100 }),
    carrier: varchar('carrier', { length: 100 }).notNull(),
    expectedDate: date('expected_date').notNull(),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Courier Visits (Kurye Ziyaretleri)
export const courierVisits = pgTable('courier_visits', {
    id: uuid('id').defaultRandom().primaryKey(),
    residentId: uuid('resident_id').notNull().references(() => residents.id, { onDelete: 'cascade' }),
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    company: varchar('company', { length: 100 }).notNull(),
    status: courierStatusEnum('status').notNull().default('pending'),
    entryTime: timestamp('entry_time', { withTimezone: true }),
    exitTime: timestamp('exit_time', { withTimezone: true }),
    method: courierMethodEnum('method').notNull().default('manual'),
    note: text('note'),
    plate: varchar('plate', { length: 20 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ============================================================
// MAINTENANCE
// ============================================================

// Maintenance Requests (Bakım Talepleri)
export const maintenanceRequests = pgTable('maintenance_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    residentId: uuid('resident_id').notNull().references(() => residents.id, { onDelete: 'cascade' }),
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    category: maintenanceCategoryEnum('category').notNull(),
    priority: maintenancePriorityEnum('priority').notNull().default('Medium'),
    status: maintenanceStatusEnum('status').notNull().default('New'),
    requestDate: timestamp('request_date', { withTimezone: true }).notNull().defaultNow(),
    completedDate: timestamp('completed_date', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ============================================================
// ANNOUNCEMENTS
// ============================================================

// Announcements (Duyurular)
export const announcements = pgTable('announcements', {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    siteId: uuid('site_id').references(() => sites.id, { onDelete: 'set null' }),
    buildingId: uuid('building_id').references(() => buildings.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    priority: announcementPriorityEnum('priority').notNull().default('Medium'),
    visibility: varchar('visibility', { length: 100 }).notNull().default('All Residents'),
    status: announcementStatusEnum('status').notNull().default('Draft'),
    publishDate: timestamp('publish_date', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ============================================================
// JANITOR MANAGEMENT
// ============================================================

// Janitors (Kapıcılar)
export const janitors = pgTable('janitors', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    avatar: text('avatar'),
    status: janitorStatusEnum('status').notNull().default('off-duty'),
    tasksCompleted: integer('tasks_completed').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Janitor Block Assignments (Many-to-Many)
export const janitorBlockAssignments = pgTable('janitor_block_assignments', {
    id: uuid('id').defaultRandom().primaryKey(),
    janitorId: uuid('janitor_id').notNull().references(() => janitors.id, { onDelete: 'cascade' }),
    buildingId: uuid('building_id').notNull().references(() => buildings.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Janitor Requests (Kapıcı Talepleri)
export const janitorRequests = pgTable('janitor_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    residentId: uuid('resident_id').notNull().references(() => residents.id, { onDelete: 'cascade' }),
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    buildingId: uuid('building_id').notNull().references(() => buildings.id, { onDelete: 'cascade' }),
    assignedJanitorId: uuid('assigned_janitor_id').references(() => janitors.id, { onDelete: 'set null' }),
    type: janitorRequestTypeEnum('type').notNull(),
    status: janitorRequestStatusEnum('status').notNull().default('pending'),
    openedAt: timestamp('opened_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ============================================================
// COMMUNITY
// ============================================================

// Community Requests (İstek/Öneri)
export const communityRequests = pgTable('community_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('author_id').notNull(), // Can be resident ID or user ID (no FK constraint to allow both)
    unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
    siteId: uuid('site_id').references(() => sites.id, { onDelete: 'set null' }),
    buildingId: uuid('building_id').references(() => buildings.id, { onDelete: 'set null' }),
    type: communityRequestTypeEnum('type').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    status: communityRequestStatusEnum('status').notNull().default('pending'),
    requestDate: timestamp('request_date', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Polls (Anketler)
export const polls = pgTable('polls', {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('author_id').notNull(), // Can be resident ID or user ID (no FK constraint to allow both)
    siteId: uuid('site_id').references(() => sites.id, { onDelete: 'set null' }),
    buildingId: uuid('building_id').references(() => buildings.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    status: pollStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Poll Votes (Anket Oyları)
export const pollVotes = pgTable('poll_votes', {
    id: uuid('id').defaultRandom().primaryKey(),
    pollId: uuid('poll_id').notNull().references(() => polls.id, { onDelete: 'cascade' }),
    residentId: uuid('resident_id').notNull().references(() => residents.id, { onDelete: 'cascade' }),
    choice: voteChoiceEnum('choice').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// TRANSACTIONS
// ============================================================

// Transactions (Gelir/Gider İşlemleri)
export const transactions = pgTable('transactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    description: varchar('description', { length: 255 }).notNull(),
    category: transactionCategoryEnum('category').notNull(),
    subCategory: varchar('sub_category', { length: 100 }),
    transactionDate: date('transaction_date').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    status: transactionStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ============================================================
// ZOD SCHEMAS (Type-safe validation)
// ============================================================

// Core Tables
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertSiteSchema = createInsertSchema(sites);
export const selectSiteSchema = createSelectSchema(sites);

export const insertUserSiteAssignmentSchema = createInsertSchema(userSiteAssignments);
export const selectUserSiteAssignmentSchema = createSelectSchema(userSiteAssignments);

export const insertBuildingSchema = createInsertSchema(buildings);
export const selectBuildingSchema = createSelectSchema(buildings);

export const insertUnitSchema = createInsertSchema(units);
export const selectUnitSchema = createSelectSchema(units);

export const insertResidentSchema = createInsertSchema(residents);
export const selectResidentSchema = createSelectSchema(residents);

// Vehicles & Parking
export const insertVehicleBrandSchema = createInsertSchema(vehicleBrands);
export const selectVehicleBrandSchema = createSelectSchema(vehicleBrands);

export const insertVehicleModelSchema = createInsertSchema(vehicleModels);
export const selectVehicleModelSchema = createSelectSchema(vehicleModels);

export const insertParkingSpotSchema = createInsertSchema(parkingSpots);
export const selectParkingSpotSchema = createSelectSchema(parkingSpots);

export const insertVehicleSchema = createInsertSchema(vehicles);
export const selectVehicleSchema = createSelectSchema(vehicles);

export const insertGuestVisitSchema = createInsertSchema(guestVisits);
export const selectGuestVisitSchema = createSelectSchema(guestVisits);

// Payments & Expenses
export const insertPaymentRecordSchema = createInsertSchema(paymentRecords, {
    amount: z.union([z.string(), z.number()]).transform(val => String(val)),
    paymentDate: z.union([z.string(), z.date()]).optional().nullable(),
});
export const selectPaymentRecordSchema = createSelectSchema(paymentRecords);

// Announcements pattern: No override, use createInsertSchema directly
// Route handler will handle null -> undefined conversion and manual transforms
export const insertExpenseRecordSchema = createInsertSchema(expenseRecords);
export const selectExpenseRecordSchema = createSelectSchema(expenseRecords);

// Facilities & Bookings
export const insertFacilitySchema = createInsertSchema(facilities);
export const selectFacilitySchema = createSelectSchema(facilities);

export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);

// Cargo
export const insertCargoItemSchema = createInsertSchema(cargoItems);
export const selectCargoItemSchema = createSelectSchema(cargoItems);

export const insertExpectedCargoSchema = createInsertSchema(expectedCargo);
export const selectExpectedCargoSchema = createSelectSchema(expectedCargo);

export const insertCourierVisitSchema = createInsertSchema(courierVisits);
export const selectCourierVisitSchema = createSelectSchema(courierVisits);

// Maintenance
export const insertMaintenanceRequestSchema = createInsertSchema(maintenanceRequests);
export const selectMaintenanceRequestSchema = createSelectSchema(maintenanceRequests);

// Announcements
export const insertAnnouncementSchema = createInsertSchema(announcements);
export const selectAnnouncementSchema = createSelectSchema(announcements);

// Janitor
export const insertJanitorSchema = createInsertSchema(janitors);
export const selectJanitorSchema = createSelectSchema(janitors);

export const insertJanitorBlockAssignmentSchema = createInsertSchema(janitorBlockAssignments);
export const selectJanitorBlockAssignmentSchema = createSelectSchema(janitorBlockAssignments);

export const insertJanitorRequestSchema = createInsertSchema(janitorRequests);
export const selectJanitorRequestSchema = createSelectSchema(janitorRequests);

// Community
export const insertCommunityRequestSchema = createInsertSchema(communityRequests);
export const selectCommunityRequestSchema = createSelectSchema(communityRequests);

export const insertPollSchema = createInsertSchema(polls);
export const selectPollSchema = createSelectSchema(polls);

export const insertPollVoteSchema = createInsertSchema(pollVotes);
export const selectPollVoteSchema = createSelectSchema(pollVotes);

// Transactions
export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);

// ============================================================
// TYPES (TypeScript types from schemas)
// ============================================================

// Core Types
export type User = z.infer<typeof selectUserSchema> & {};
export type InsertUser = z.infer<typeof insertUserSchema> & {};

export type Site = z.infer<typeof selectSiteSchema>;
export type InsertSite = z.infer<typeof insertSiteSchema>;

export type UserSiteAssignment = z.infer<typeof selectUserSiteAssignmentSchema>;
export type InsertUserSiteAssignment = z.infer<typeof insertUserSiteAssignmentSchema>;

export type Building = z.infer<typeof selectBuildingSchema> & {};
export type InsertBuilding = z.infer<typeof insertBuildingSchema> & {};

export type Unit = z.infer<typeof selectUnitSchema> & {};
export type InsertUnit = z.infer<typeof insertUnitSchema> & {};

export type Resident = z.infer<typeof selectResidentSchema> & {};
export type InsertResident = z.infer<typeof insertResidentSchema> & {};

// Vehicles & Parking Types
export type VehicleBrand = z.infer<typeof selectVehicleBrandSchema>;
export type InsertVehicleBrand = z.infer<typeof insertVehicleBrandSchema>;

export type VehicleModel = z.infer<typeof selectVehicleModelSchema>;
export type InsertVehicleModel = z.infer<typeof insertVehicleModelSchema>;

export type ParkingSpot = z.infer<typeof selectParkingSpotSchema>;
export type InsertParkingSpot = z.infer<typeof insertParkingSpotSchema>;

export type Vehicle = z.infer<typeof selectVehicleSchema>;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type GuestVisit = z.infer<typeof selectGuestVisitSchema>;
export type InsertGuestVisit = z.infer<typeof insertGuestVisitSchema>;

// Payments & Expenses Types
export type PaymentRecord = z.infer<typeof selectPaymentRecordSchema>;
export type InsertPaymentRecord = z.infer<typeof insertPaymentRecordSchema>;

export type ExpenseRecord = z.infer<typeof selectExpenseRecordSchema>;
export type InsertExpenseRecord = z.infer<typeof insertExpenseRecordSchema>;

// Facilities & Bookings Types
export type Facility = z.infer<typeof selectFacilitySchema>;
export type InsertFacility = z.infer<typeof insertFacilitySchema>;

export type Booking = z.infer<typeof selectBookingSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

// Cargo Types
export type CargoItem = z.infer<typeof selectCargoItemSchema>;
export type InsertCargoItem = z.infer<typeof insertCargoItemSchema>;

export type ExpectedCargo = z.infer<typeof selectExpectedCargoSchema>;
export type InsertExpectedCargo = z.infer<typeof insertExpectedCargoSchema>;

export type CourierVisit = z.infer<typeof selectCourierVisitSchema>;
export type InsertCourierVisit = z.infer<typeof insertCourierVisitSchema>;

// Maintenance Types
export type MaintenanceRequest = z.infer<typeof selectMaintenanceRequestSchema>;
export type InsertMaintenanceRequest = z.infer<typeof insertMaintenanceRequestSchema>;

// Announcements Types
export type Announcement = z.infer<typeof selectAnnouncementSchema>;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// Janitor Types
export type Janitor = z.infer<typeof selectJanitorSchema>;
export type InsertJanitor = z.infer<typeof insertJanitorSchema>;

export type JanitorBlockAssignment = z.infer<typeof selectJanitorBlockAssignmentSchema>;
export type InsertJanitorBlockAssignment = z.infer<typeof insertJanitorBlockAssignmentSchema>;

export type JanitorRequest = z.infer<typeof selectJanitorRequestSchema>;
export type InsertJanitorRequest = z.infer<typeof insertJanitorRequestSchema>;

// Community Types
export type CommunityRequest = z.infer<typeof selectCommunityRequestSchema>;
export type InsertCommunityRequest = z.infer<typeof insertCommunityRequestSchema>;

export type Poll = z.infer<typeof selectPollSchema>;
export type InsertPoll = z.infer<typeof insertPollSchema>;

export type PollVote = z.infer<typeof selectPollVoteSchema>;
export type InsertPollVote = z.infer<typeof insertPollVoteSchema>;

// Transaction Types
export type Transaction = z.infer<typeof selectTransactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
