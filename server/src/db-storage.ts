import { eq, and, or, desc, gte, lte, count, isNull, ilike, sql, inArray } from 'drizzle-orm';
import { db } from './db/index.js';
import type { IStorage } from './storage.js';
import * as schema from 'apartium-shared';
import type {
    User, InsertUser,
    Site, InsertSite,
    Building, InsertBuilding,
    Unit, InsertUnit,
    Resident, InsertResident,
    PaymentRecord, InsertPaymentRecord,
    ExpenseRecord, InsertExpenseRecord,
    Vehicle, InsertVehicle,
    ParkingSpot, InsertParkingSpot,
    GuestVisit, InsertGuestVisit,
    Facility, InsertFacility,
    Booking, InsertBooking,
    CargoItem, InsertCargoItem,
    ExpectedCargo, InsertExpectedCargo,
    CourierVisit, InsertCourierVisit,
    MaintenanceRequest, InsertMaintenanceRequest,
    Announcement, InsertAnnouncement,
    Janitor, InsertJanitor,
    JanitorBlockAssignment, InsertJanitorBlockAssignment,
    JanitorRequest, InsertJanitorRequest,
    CommunityRequest, InsertCommunityRequest,
    Poll, InsertPoll,
    PollVote, InsertPollVote,
    Transaction, InsertTransaction,
    UserSiteAssignment, InsertUserSiteAssignment
} from 'apartium-shared';

/**
 * DatabaseStorage
 * Drizzle ORM kullanarak PostgreSQL ile konuşan storage implementasyonu
 */
export class DatabaseStorage implements IStorage {
    // ==================== USERS ====================
    async getUserByEmail(email: string): Promise<User | null> {
        const [user] = await db
            .select()
            .from(schema.users)
            .where(
                and(
                    eq(schema.users.email, email),
                    isNull(schema.users.deletedAt)
                )
            )
            .limit(1);
        return user || null;
    }

    async getResidentByEmail(email: string): Promise<Resident | null> {
        const [resident] = await db
            .select()
            .from(schema.residents)
            .where(
                and(
                    eq(schema.residents.email, email),
                    isNull(schema.residents.deletedAt)
                )
            )
            .limit(1);
        return resident || null;
    }

    async getUserById(id: string): Promise<User | null> {
        const [user] = await db
            .select()
            .from(schema.users)
            .where(
                and(
                    eq(schema.users.id, id),
                    isNull(schema.users.deletedAt)
                )
            )
            .limit(1);
        return user || null;
    }

    async createUser(user: InsertUser): Promise<User> {
        const [newUser] = await db
            .insert(schema.users)
            .values(user)
            .returning();
        return newUser;
    }

    async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
        const [updated] = await db
            .update(schema.users)
            .set({ ...user, updatedAt: new Date() })
            .where(eq(schema.users.id, id))
            .returning();
        return updated;
    }

    async deleteUser(id: string): Promise<void> {
        await db.update(schema.users).set({ deletedAt: new Date(), isActive: false }).where(eq(schema.users.id, id));
    }

    // ==================== SITES ====================
    async getAllSites(): Promise<Site[]> {
        return await db
            .select()
            .from(schema.sites)
            .where(isNull(schema.sites.deletedAt))
            .orderBy(schema.sites.name);
    }

    async getSiteById(id: string): Promise<Site | null> {
        const [site] = await db
            .select()
            .from(schema.sites)
            .where(
                and(
                    eq(schema.sites.id, id),
                    isNull(schema.sites.deletedAt)
                )
            )
            .limit(1);
        return site || null;
    }

    async getSitesByUserId(userId: string): Promise<Site[]> {
        // Admin kullanıcı tüm siteleri görebilir
        const user = await this.getUserById(userId);
        if (user?.role === 'admin') {
            return this.getAllSites();
        }

        // Diğer kullanıcılar sadece atandıkları siteleri görebilir
        const sites = await db
            .select({
                id: schema.sites.id,
                name: schema.sites.name,
                address: schema.sites.address,
                totalBuildings: schema.sites.totalBuildings,
                createdAt: schema.sites.createdAt,
                updatedAt: schema.sites.updatedAt,
                deletedAt: schema.sites.deletedAt,
            })
            .from(schema.sites)
            .innerJoin(
                schema.userSiteAssignments,
                eq(schema.sites.id, schema.userSiteAssignments.siteId)
            )
            .where(
                and(
                    eq(schema.userSiteAssignments.userId, userId),
                    isNull(schema.sites.deletedAt)
                )
            )
            .orderBy(schema.sites.name);

        return sites;
    }

    async createSite(site: InsertSite): Promise<Site> {
        const [newSite] = await db
            .insert(schema.sites)
            .values(site)
            .returning();
        return newSite;
    }

    async updateSite(id: string, site: Partial<InsertSite>): Promise<Site> {
        const [updated] = await db
            .update(schema.sites)
            .set({ ...site, updatedAt: new Date() })
            .where(eq(schema.sites.id, id))
            .returning();
        return updated;
    }

    async deleteSite(id: string): Promise<void> {
        await db
            .update(schema.sites)
            .set({ deletedAt: new Date() })
            .where(eq(schema.sites.id, id));
    }

    async assignUserToSite(userId: string, siteId: string): Promise<UserSiteAssignment> {
        const [assignment] = await db
            .insert(schema.userSiteAssignments)
            .values({ userId, siteId })
            .returning();
        return assignment;
    }

    async unassignUserFromSite(userId: string, siteId: string): Promise<void> {
        await db
            .delete(schema.userSiteAssignments)
            .where(
                and(
                    eq(schema.userSiteAssignments.userId, userId),
                    eq(schema.userSiteAssignments.siteId, siteId)
                )
            );
    }

    async getUserSiteAssignments(userId: string): Promise<UserSiteAssignment[]> {
        return await db
            .select()
            .from(schema.userSiteAssignments)
            .where(eq(schema.userSiteAssignments.userId, userId));
    }

    // ==================== BUILDINGS ====================
    async getAllBuildings(): Promise<Building[]> {
        return await db
            .select()
            .from(schema.buildings)
            .where(isNull(schema.buildings.deletedAt));
    }

    async getBuildingById(id: string): Promise<Building | null> {
        const [building] = await db
            .select()
            .from(schema.buildings)
            .where(
                and(
                    eq(schema.buildings.id, id),
                    isNull(schema.buildings.deletedAt)
                )
            )
            .limit(1);
        return building || null;
    }

    async getBuildingsBySiteId(siteId: string): Promise<Building[]> {
        return await db
            .select()
            .from(schema.buildings)
            .where(
                and(
                    eq(schema.buildings.siteId, siteId),
                    isNull(schema.buildings.deletedAt)
                )
            )
            .orderBy(schema.buildings.name);
    }

    async createBuilding(building: InsertBuilding): Promise<Building> {
        const [newBuilding] = await db
            .insert(schema.buildings)
            .values(building)
            .returning();
        return newBuilding;
    }

    async updateBuilding(id: string, building: Partial<InsertBuilding>): Promise<Building> {
        const [updated] = await db
            .update(schema.buildings)
            .set({ ...building, updatedAt: new Date() })
            .where(eq(schema.buildings.id, id))
            .returning();
        return updated;
    }

    async deleteBuilding(id: string): Promise<void> {
        await db
            .update(schema.buildings)
            .set({ deletedAt: new Date() })
            .where(eq(schema.buildings.id, id));
    }

    // ==================== UNITS ====================
    async getUnitsByBuildingId(buildingId: string): Promise<Unit[]> {
        return await db
            .select()
            .from(schema.units)
            .where(
                and(
                    eq(schema.units.buildingId, buildingId),
                    isNull(schema.units.deletedAt)
                )
            );
    }

    async getUnitById(id: string): Promise<Unit | null> {
        const [unit] = await db
            .select()
            .from(schema.units)
            .where(
                and(
                    eq(schema.units.id, id),
                    isNull(schema.units.deletedAt)
                )
            )
            .limit(1);
        return unit || null;
    }

    async createUnit(unit: InsertUnit): Promise<Unit> {
        const [newUnit] = await db
            .insert(schema.units)
            .values(unit)
            .returning();
        return newUnit;
    }

    async updateUnit(id: string, unit: Partial<InsertUnit>): Promise<Unit> {
        const [updated] = await db
            .update(schema.units)
            .set({ ...unit, updatedAt: new Date() })
            .where(eq(schema.units.id, id))
            .returning();
        return updated;
    }

    async deleteUnit(id: string): Promise<void> {
        await db
            .update(schema.units)
            .set({ deletedAt: new Date() })
            .where(eq(schema.units.id, id));
    }

    // ==================== RESIDENTS ====================
    async getResidentsByUnitId(unitId: string): Promise<Resident[]> {
        return await db
            .select()
            .from(schema.residents)
            .where(
                and(
                    eq(schema.residents.unitId, unitId),
                    isNull(schema.residents.deletedAt)
                )
            );
    }

    async getResidentById(id: string): Promise<Resident | null> {
        const [resident] = await db
            .select()
            .from(schema.residents)
            .where(
                and(
                    eq(schema.residents.id, id),
                    isNull(schema.residents.deletedAt)
                )
            )
            .limit(1);
        return resident || null;
    }

    async createResident(resident: InsertResident): Promise<Resident> {
        const [newResident] = await db
            .insert(schema.residents)
            .values(resident)
            .returning();
        return newResident;
    }

    async updateResident(id: string, resident: Partial<InsertResident>): Promise<Resident> {
        const [updated] = await db
            .update(schema.residents)
            .set({ ...resident, updatedAt: new Date() })
            .where(eq(schema.residents.id, id))
            .returning();
        return updated;
    }

    async deleteResident(id: string): Promise<void> {
        await db
            .update(schema.residents)
            .set({ deletedAt: new Date() })
            .where(eq(schema.residents.id, id));
    }

    // ==================== VEHICLES & PARKING ====================
    async getVehiclesByResidentId(residentId: string): Promise<Vehicle[]> {
        return await db
            .select()
            .from(schema.vehicles)
            .where(
                and(
                    eq(schema.vehicles.residentId, residentId),
                    isNull(schema.vehicles.deletedAt)
                )
            );
    }

    async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
        const [newVehicle] = await db
            .insert(schema.vehicles)
            .values(vehicle)
            .returning();
        return newVehicle;
    }

    async updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle> {
        const [updated] = await db
            .update(schema.vehicles)
            .set({ ...vehicle, updatedAt: new Date() })
            .where(eq(schema.vehicles.id, id))
            .returning();
        return updated;
    }

    async deleteVehicle(id: string): Promise<void> {
        await db
            .update(schema.vehicles)
            .set({ deletedAt: new Date() })
            .where(eq(schema.vehicles.id, id));
    }

    async getParkingSpotsByBuildingId(buildingId: string): Promise<ParkingSpot[]> {
        return await db
            .select()
            .from(schema.parkingSpots)
            .where(
                and(
                    eq(schema.parkingSpots.buildingId, buildingId),
                    isNull(schema.parkingSpots.deletedAt)
                )
            );
    }

    async createParkingSpot(spot: InsertParkingSpot): Promise<ParkingSpot> {
        const [newSpot] = await db
            .insert(schema.parkingSpots)
            .values(spot)
            .returning();
        return newSpot;
    }

    async updateParkingSpot(id: string, spot: Partial<InsertParkingSpot>): Promise<ParkingSpot> {
        const [updated] = await db
            .update(schema.parkingSpots)
            .set({ ...spot, updatedAt: new Date() })
            .where(eq(schema.parkingSpots.id, id))
            .returning();
        return updated;
    }

    async deleteParkingSpot(id: string): Promise<void> {
        await db
            .update(schema.parkingSpots)
            .set({ deletedAt: new Date() })
            .where(eq(schema.parkingSpots.id, id));
    }

    async getGuestVisitsByUnitId(unitId: string): Promise<GuestVisit[]> {
        return await db
            .select()
            .from(schema.guestVisits)
            .where(
                and(
                    eq(schema.guestVisits.unitId, unitId),
                    isNull(schema.guestVisits.deletedAt)
                )
            );
    }

    async createGuestVisit(visit: InsertGuestVisit): Promise<GuestVisit> {
        const [newVisit] = await db
            .insert(schema.guestVisits)
            .values(visit)
            .returning();
        return newVisit;
    }

    async updateGuestVisitStatus(id: string, status: string): Promise<GuestVisit> {
        const [updated] = await db
            .update(schema.guestVisits)
            .set({ status: status as any, updatedAt: new Date() })
            .where(eq(schema.guestVisits.id, id))
            .returning();
        return updated;
    }

    async deleteGuestVisit(id: string): Promise<void> {
        await db
            .update(schema.guestVisits)
            .set({ deletedAt: new Date() })
            .where(eq(schema.guestVisits.id, id));
    }

    // ==================== PAYMENT RECORDS ====================
    async getPaymentRecordsByPeriod(month: string, year: number): Promise<PaymentRecord[]> {
        return await db
            .select()
            .from(schema.paymentRecords)
            .where(
                and(
                    eq(schema.paymentRecords.periodMonth, month),
                    eq(schema.paymentRecords.periodYear, year),
                    isNull(schema.paymentRecords.deletedAt)
                )
            );
    }

    async getPaymentRecordsPaginated(
        month: string,
        year: number,
        page: number,
        limit: number,
        filters?: { search?: string; status?: 'paid' | 'unpaid' }
    ): Promise<{
        payments: any[];
        total: number;
        stats: { total: number; collected: number; pending: number; rate: number };
    }> {
        // Build WHERE conditions
        const conditions = [
            eq(schema.paymentRecords.periodMonth, month),
            eq(schema.paymentRecords.periodYear, year),
            isNull(schema.paymentRecords.deletedAt),
        ];

        // Add status filter
        if (filters?.status) {
            conditions.push(eq(schema.paymentRecords.status, filters.status));
        }

        // Add search filter (resident name or unit number)
        // Search minimum 3 characters for security
        if (filters?.search && filters.search.trim().length >= 3) {
            const searchTerm = `%${filters.search.trim().toLowerCase()}%`;
            conditions.push(
                or(
                    ilike(schema.residents.name, searchTerm),
                    ilike(schema.units.number, searchTerm)
                )
            );
        }

        // Get total count
        const [{ count: totalCount }] = await db
            .select({ count: count() })
            .from(schema.paymentRecords)
            .leftJoin(schema.residents, eq(schema.paymentRecords.residentId, schema.residents.id))
            .leftJoin(schema.units, eq(schema.paymentRecords.unitId, schema.units.id))
            .where(and(...conditions));

        // Get paginated data with JOINs
        const offset = (page - 1) * limit;
        const payments = await db
            .select({
                id: schema.paymentRecords.id,
                residentId: schema.paymentRecords.residentId,
                unitId: schema.paymentRecords.unitId,
                amount: schema.paymentRecords.amount,
                type: schema.paymentRecords.type,
                status: schema.paymentRecords.status,
                paymentDate: schema.paymentRecords.paymentDate,
                periodMonth: schema.paymentRecords.periodMonth,
                periodYear: schema.paymentRecords.periodYear,
                createdAt: schema.paymentRecords.createdAt,
                updatedAt: schema.paymentRecords.updatedAt,
                // JOIN data
                residentName: schema.residents.name,
                residentPhone: schema.residents.phone,
                residentAvatar: schema.residents.avatar,
                unitNumber: schema.units.number,
                buildingId: schema.units.buildingId,
            })
            .from(schema.paymentRecords)
            .leftJoin(schema.residents, eq(schema.paymentRecords.residentId, schema.residents.id))
            .leftJoin(schema.units, eq(schema.paymentRecords.unitId, schema.units.id))
            .where(and(...conditions))
            .orderBy(desc(schema.paymentRecords.createdAt))
            .limit(limit)
            .offset(offset);

        // Calculate stats for the period (without search filter for accurate stats)
        const statsConditions = [
            eq(schema.paymentRecords.periodMonth, month),
            eq(schema.paymentRecords.periodYear, year),
            isNull(schema.paymentRecords.deletedAt),
        ];

        const [statsResult] = await db
            .select({
                totalAmount: sql<string>`COALESCE(SUM(${schema.paymentRecords.amount}), 0)`,
                collectedAmount: sql<string>`COALESCE(SUM(CASE WHEN ${schema.paymentRecords.status} = 'paid' THEN ${schema.paymentRecords.amount} ELSE 0 END), 0)`,
                totalCount: count(),
            })
            .from(schema.paymentRecords)
            .where(and(...statsConditions));

        const total = parseFloat(statsResult.totalAmount);
        const collected = parseFloat(statsResult.collectedAmount);
        const pending = total - collected;
        const rate = total > 0 ? Math.round((collected / total) * 100) : 0;

        return {
            payments,
            total: totalCount,
            stats: { total, collected, pending, rate },
        };
    }

    async updatePaymentAmountByPeriod(month: string, year: number, amount: string): Promise<number> {
        const result = await db
            .update(schema.paymentRecords)
            .set({
                amount: amount,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(schema.paymentRecords.periodMonth, month),
                    eq(schema.paymentRecords.periodYear, year),
                    isNull(schema.paymentRecords.deletedAt)
                )
            )
            .returning({ id: schema.paymentRecords.id });
        
        return result.length;
    }

    async getPaymentRecordsByResidentId(residentId: string): Promise<PaymentRecord[]> {
        return await db
            .select()
            .from(schema.paymentRecords)
            .where(
                and(
                    eq(schema.paymentRecords.residentId, residentId),
                    isNull(schema.paymentRecords.deletedAt)
                )
            );
    }

    async getPaymentRecordById(id: string): Promise<PaymentRecord | null> {
        const [payment] = await db
            .select()
            .from(schema.paymentRecords)
            .where(
                and(
                    eq(schema.paymentRecords.id, id),
                    isNull(schema.paymentRecords.deletedAt)
                )
            )
            .limit(1);
        return payment || null;
    }

    async createPaymentRecord(payment: InsertPaymentRecord): Promise<PaymentRecord> {
        const [newPayment] = await db
            .insert(schema.paymentRecords)
            .values(payment)
            .returning();
        return newPayment;
    }

    async updatePaymentStatus(
        id: string,
        status: 'paid' | 'unpaid',
        paymentDate?: Date
    ): Promise<PaymentRecord> {
        const [updated] = await db
            .update(schema.paymentRecords)
            .set({
                status,
                paymentDate: paymentDate || (status === 'paid' ? new Date() : null),
                updatedAt: new Date(),
            })
            .where(eq(schema.paymentRecords.id, id))
            .returning();
        return updated;
    }

    async deletePaymentRecord(id: string): Promise<void> {
        await db
            .update(schema.paymentRecords)
            .set({ deletedAt: new Date() })
            .where(eq(schema.paymentRecords.id, id));
    }

    // ==================== EXPENSE RECORDS ====================
    async getExpenseRecordsByPeriod(month: string, year: number): Promise<ExpenseRecord[]> {
        return await db
            .select()
            .from(schema.expenseRecords)
            .where(
                and(
                    eq(schema.expenseRecords.periodMonth, month),
                    eq(schema.expenseRecords.periodYear, year),
                    isNull(schema.expenseRecords.deletedAt)
                )
            );
    }

    async getExpenseRecordsPaginated(
        month: string,
        year: number,
        page: number,
        limit: number,
        filters?: { search?: string; category?: string }
    ): Promise<{
        expenses: ExpenseRecord[];
        total: number;
        stats: { total: number; paid: number; pending: number };
    }> {
        // Build WHERE conditions
        const conditions = [
            eq(schema.expenseRecords.periodMonth, month),
            eq(schema.expenseRecords.periodYear, year),
            isNull(schema.expenseRecords.deletedAt),
        ];

        // Add category filter
        if (filters?.category) {
            conditions.push(eq(schema.expenseRecords.category, filters.category as any));
        }

        // Add search filter (title or description)
        // Search minimum 3 characters for security
        if (filters?.search && filters.search.trim().length >= 3) {
            const searchTerm = `%${filters.search.trim().toLowerCase()}%`;
            conditions.push(
                or(
                    ilike(schema.expenseRecords.title, searchTerm),
                    ilike(schema.expenseRecords.description, searchTerm)
                )
            );
        }

        // Get total count
        const [{ count: totalCount }] = await db
            .select({ count: count() })
            .from(schema.expenseRecords)
            .where(and(...conditions));

        // Get paginated data
        const offset = (page - 1) * limit;
        const expenses = await db
            .select()
            .from(schema.expenseRecords)
            .where(and(...conditions))
            .orderBy(desc(schema.expenseRecords.expenseDate))
            .limit(limit)
            .offset(offset);

        // Calculate stats for the period (without search filter for accurate stats)
        const statsConditions = [
            eq(schema.expenseRecords.periodMonth, month),
            eq(schema.expenseRecords.periodYear, year),
            isNull(schema.expenseRecords.deletedAt),
        ];

        const [statsResult] = await db
            .select({
                totalAmount: sql<string>`COALESCE(SUM(${schema.expenseRecords.amount}), 0)`,
                paidAmount: sql<string>`COALESCE(SUM(CASE WHEN ${schema.expenseRecords.status} = 'paid' THEN ${schema.expenseRecords.amount} ELSE 0 END), 0)`,
            })
            .from(schema.expenseRecords)
            .where(and(...statsConditions));

        const total = parseFloat(statsResult.totalAmount);
        const paid = parseFloat(statsResult.paidAmount);
        const pending = total - paid;

        return {
            expenses,
            total: totalCount,
            stats: { total, paid, pending },
        };
    }

    async getExpenseRecordById(id: string): Promise<ExpenseRecord | null> {
        const [expense] = await db
            .select()
            .from(schema.expenseRecords)
            .where(
                and(
                    eq(schema.expenseRecords.id, id),
                    isNull(schema.expenseRecords.deletedAt)
                )
            )
            .limit(1);
        return expense || null;
    }

    async createExpenseRecord(expense: InsertExpenseRecord): Promise<ExpenseRecord> {
        const [newExpense] = await db
            .insert(schema.expenseRecords)
            .values(expense)
            .returning();
        return newExpense;
    }

    async updateExpenseRecord(id: string, expense: Partial<InsertExpenseRecord>): Promise<ExpenseRecord> {
        const [updated] = await db
            .update(schema.expenseRecords)
            .set({ ...expense, updatedAt: new Date() })
            .where(eq(schema.expenseRecords.id, id))
            .returning();
        return updated;
    }

    async deleteExpenseRecord(id: string): Promise<void> {
        await db
            .update(schema.expenseRecords)
            .set({ deletedAt: new Date() })
            .where(eq(schema.expenseRecords.id, id));
    }

    // ==================== FACILITIES & BOOKINGS ====================
    async getAllFacilities(): Promise<Facility[]> {
        return await db.select().from(schema.facilities).where(isNull(schema.facilities.deletedAt));
    }

    async getFacilityById(id: string): Promise<Facility | null> {
        const [facility] = await db
            .select()
            .from(schema.facilities)
            .where(
                and(
                    eq(schema.facilities.id, id),
                    isNull(schema.facilities.deletedAt)
                )
            )
            .limit(1);
        return facility || null;
    }

    async createFacility(facility: InsertFacility): Promise<Facility> {
        const [newFacility] = await db
            .insert(schema.facilities)
            .values(facility)
            .returning();
        return newFacility;
    }

    async updateFacility(id: string, facility: Partial<InsertFacility>): Promise<Facility> {
        const [updated] = await db
            .update(schema.facilities)
            .set({ ...facility, updatedAt: new Date() })
            .where(eq(schema.facilities.id, id))
            .returning();
        return updated;
    }

    async deleteFacility(id: string): Promise<void> {
        await db
            .update(schema.facilities)
            .set({ deletedAt: new Date() })
            .where(eq(schema.facilities.id, id));
    }

    async getBookingsByFacilityId(facilityId: string): Promise<Booking[]> {
        return await db
            .select()
            .from(schema.bookings)
            .where(
                and(
                    eq(schema.bookings.facilityId, facilityId),
                    isNull(schema.bookings.deletedAt)
                )
            );
    }

    async getBookingsByResidentId(residentId: string): Promise<Booking[]> {
        return await db
            .select()
            .from(schema.bookings)
            .where(
                and(
                    eq(schema.bookings.residentId, residentId),
                    isNull(schema.bookings.deletedAt)
                )
            );
    }

    async createBooking(booking: InsertBooking): Promise<Booking> {
        const [newBooking] = await db
            .insert(schema.bookings)
            .values(booking)
            .returning();
        return newBooking;
    }

    async deleteBooking(id: string): Promise<void> {
        await db
            .update(schema.bookings)
            .set({ deletedAt: new Date() })
            .where(eq(schema.bookings.id, id));
    }

    async updateBookingStatus(
        id: string,
        status: string,
        rejectionReason?: string
    ): Promise<Booking> {
        const [updated] = await db
            .update(schema.bookings)
            .set({
                status: status as any,
                note: rejectionReason || null, // Using note field for rejection reason if needed
                updatedAt: new Date(),
            })
            .where(eq(schema.bookings.id, id))
            .returning();
        return updated;
    }

    // ==================== CARGO MANAGEMENT ====================
    async getCargoItemsByUnitId(unitId: string): Promise<CargoItem[]> {
        return await db
            .select()
            .from(schema.cargoItems)
            .where(
                and(
                    eq(schema.cargoItems.unitId, unitId),
                    isNull(schema.cargoItems.deletedAt)
                )
            );
    }

    async createCargoItem(cargo: InsertCargoItem): Promise<CargoItem> {
        const [newItem] = await db
            .insert(schema.cargoItems)
            .values(cargo)
            .returning();
        return newItem;
    }

    async updateCargoStatus(id: string, status: string, deliveredDate?: Date): Promise<CargoItem> {
        const [updated] = await db
            .update(schema.cargoItems)
            .set({
                status: status as any,
                deliveredDate: deliveredDate || (status === 'delivered' ? new Date() : null),
                updatedAt: new Date(),
            })
            .where(eq(schema.cargoItems.id, id))
            .returning();
        return updated;
    }

    async deleteCargoItem(id: string): Promise<void> {
        await db
            .update(schema.cargoItems)
            .set({ deletedAt: new Date() })
            .where(eq(schema.cargoItems.id, id));
    }

    async getExpectedCargoByResidentId(residentId: string): Promise<ExpectedCargo[]> {
        return await db
            .select()
            .from(schema.expectedCargo)
            .where(
                and(
                    eq(schema.expectedCargo.residentId, residentId),
                    isNull(schema.expectedCargo.deletedAt)
                )
            );
    }

    async createExpectedCargo(cargo: InsertExpectedCargo): Promise<ExpectedCargo> {
        const [newItem] = await db
            .insert(schema.expectedCargo)
            .values(cargo)
            .returning();
        return newItem;
    }

    async deleteExpectedCargo(id: string): Promise<void> {
        await db
            .update(schema.expectedCargo)
            .set({ deletedAt: new Date() })
            .where(eq(schema.expectedCargo.id, id));
    }

    async getCourierVisitsByUnitId(unitId: string): Promise<CourierVisit[]> {
        return await db
            .select()
            .from(schema.courierVisits)
            .where(
                and(
                    eq(schema.courierVisits.unitId, unitId),
                    isNull(schema.courierVisits.deletedAt)
                )
            );
    }

    async createCourierVisit(visit: InsertCourierVisit): Promise<CourierVisit> {
        const [newVisit] = await db
            .insert(schema.courierVisits)
            .values(visit)
            .returning();
        return newVisit;
    }

    async deleteCourierVisit(id: string): Promise<void> {
        await db
            .update(schema.courierVisits)
            .set({ deletedAt: new Date() })
            .where(eq(schema.courierVisits.id, id));
    }

    // ==================== MAINTENANCE ====================
    async getMaintenanceRequestsByUnitId(unitId: string): Promise<MaintenanceRequest[]> {
        return await db
            .select()
            .from(schema.maintenanceRequests)
            .where(
                and(
                    eq(schema.maintenanceRequests.unitId, unitId),
                    isNull(schema.maintenanceRequests.deletedAt)
                )
            );
    }

    async createMaintenanceRequest(req: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
        const [newRequest] = await db
            .insert(schema.maintenanceRequests)
            .values(req)
            .returning();
        return newRequest;
    }

    async updateMaintenanceStatus(
        id: string,
        status: string,
        completedDate?: Date
    ): Promise<MaintenanceRequest> {
        const [updated] = await db
            .update(schema.maintenanceRequests)
            .set({
                status: status as any,
                completedDate: completedDate || (status === 'Completed' ? new Date() : null),
                updatedAt: new Date(),
            })
            .where(eq(schema.maintenanceRequests.id, id))
            .returning();
        return updated;
    }

    async deleteMaintenanceRequest(id: string): Promise<void> {
        await db
            .update(schema.maintenanceRequests)
            .set({ deletedAt: new Date() })
            .where(eq(schema.maintenanceRequests.id, id));
    }

    // ==================== ANNOUNCEMENTS ====================
    async getAnnouncements(): Promise<Announcement[]> {
        return await db
            .select()
            .from(schema.announcements)
            .where(isNull(schema.announcements.deletedAt))
            .orderBy(desc(schema.announcements.publishDate));
    }

    async getAnnouncementsPaginated(page: number, limit: number, userId?: string): Promise<{
        announcements: (Announcement & { authorName: string; authorEmail: string })[];
        total: number;
    }> {
        const offset = (page - 1) * limit;

        // Build where conditions
        let whereConditions = [isNull(schema.announcements.deletedAt)];

        // Filter by user's authorized sites if userId provided
        if (userId) {
            const user = await this.getUserById(userId);
            
            // Admin can see all announcements
            if (user?.role !== 'admin') {
                // Get user's site assignments
                const userSiteAssignments = await this.getUserSiteAssignments(userId);
                const userSiteIds = userSiteAssignments.map(assignment => assignment.siteId);

                if (userSiteIds.length > 0) {
                    // Get buildings for user's sites
                    const userBuildings = await db
                        .select({ id: schema.buildings.id })
                        .from(schema.buildings)
                        .where(
                            and(
                                inArray(schema.buildings.siteId, userSiteIds),
                                isNull(schema.buildings.deletedAt)
                            )
                        );

                    const userBuildingIds = userBuildings.map(b => b.id);

                    console.log(`[DEBUG] User ${userId} has ${userBuildingIds.length} buildings:`, userBuildingIds);
                    console.log(`[DEBUG] User site IDs:`, userSiteIds);

                    // Filter announcements: Show announcements for user's buildings OR user's sites
                    // Kullanıcı sadece erişebileceği building'lerin veya site'lerin duyurularını görmeli
                    // - Building-specific announcements: buildingId matches user's buildings
                    // - Site-wide announcements: siteId matches user's sites
                    const conditions: any[] = [];
                    
                    if (userBuildingIds.length > 0) {
                        conditions.push(inArray(schema.announcements.buildingId, userBuildingIds));
                    }
                    
                    // Check if siteId exists in schema before using it
                    if (userSiteIds.length > 0 && schema.announcements.siteId) {
                        conditions.push(inArray(schema.announcements.siteId, userSiteIds));
                    }

                    if (conditions.length > 0) {
                        // Show announcements that match either building OR site
                        whereConditions.push(or(...conditions));
                    } else {
                        // No buildings and no sites = show nothing (user has no access)
                        whereConditions.push(sql`1 = 0`); // Always false condition
                    }
                } else {
                    // User has no site assignments, only show their own announcements
                    whereConditions.push(eq(schema.announcements.authorId, userId));
                }
            }
        }

        // Get paginated announcements with author info
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/50ac2de9-6b44-4ca9-86c9-62829607e1e5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-storage.ts:1097',message:'getAnnouncementsPaginated - checking schema.buildingId',data:{buildingIdExists:!!schema.announcements.buildingId,buildingIdType:typeof schema.announcements.buildingId,buildingIdConstructor:schema.announcements.buildingId?.constructor?.name,allColumns:Object.keys(schema.announcements)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Build select object - check if siteId exists in schema
        const selectObj: any = {
            id: schema.announcements.id,
            authorId: schema.announcements.authorId,
            buildingId: schema.announcements.buildingId,
            title: schema.announcements.title,
            content: schema.announcements.content,
            priority: schema.announcements.priority,
            visibility: schema.announcements.visibility,
            status: schema.announcements.status,
            publishDate: schema.announcements.publishDate,
            createdAt: schema.announcements.createdAt,
            updatedAt: schema.announcements.updatedAt,
            deletedAt: schema.announcements.deletedAt,
            authorName: schema.users.name,
            authorEmail: schema.users.email,
        };
        
        // Add siteId if it exists in schema (it should after migration)
        if (schema.announcements.siteId) {
            selectObj.siteId = schema.announcements.siteId;
        }
        
        // #region agent log
        const safeSelectObj = Object.entries(selectObj).reduce((acc,[k,v])=>{acc[k]={exists:!!v,type:typeof v,isUndefined:v===undefined,isNull:v===null,constructor:v?.constructor?.name};return acc;},{});
        fetch('http://127.0.0.1:7242/ingest/50ac2de9-6b44-4ca9-86c9-62829607e1e5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-storage.ts:1115',message:'getAnnouncementsPaginated - select object before query',data:{selectKeys:Object.keys(selectObj),buildingIdExists:!!selectObj.buildingId,buildingIdUndefined:selectObj.buildingId===undefined,buildingIdNull:selectObj.buildingId===null,safeSelectObj},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        const announcements = await db
            .select(selectObj)
            .from(schema.announcements)
            .leftJoin(schema.users, eq(schema.announcements.authorId, schema.users.id))
            .where(and(...whereConditions))
            .orderBy(desc(schema.announcements.publishDate))
            .limit(limit)
            .offset(offset);

        // Get total count with same filters
        const [{ count: totalCount }] = await db
            .select({ count: sql<number>`COUNT(*)::int` })
            .from(schema.announcements)
            .where(and(...whereConditions));

        return {
            announcements: announcements as (Announcement & { authorName: string; authorEmail: string })[],
            total: totalCount,
        };
    }

    async getAnnouncementById(id: string): Promise<(Announcement & { authorName: string; authorEmail: string }) | null> {
        const [announcement] = await db
            .select({
                id: schema.announcements.id,
                authorId: schema.announcements.authorId,
                buildingId: schema.announcements.buildingId, // Include buildingId
                title: schema.announcements.title,
                content: schema.announcements.content,
                priority: schema.announcements.priority,
                visibility: schema.announcements.visibility,
                status: schema.announcements.status,
                publishDate: schema.announcements.publishDate,
                createdAt: schema.announcements.createdAt,
                updatedAt: schema.announcements.updatedAt,
                deletedAt: schema.announcements.deletedAt,
                authorName: schema.users.name,
                authorEmail: schema.users.email,
            })
            .from(schema.announcements)
            .leftJoin(schema.users, eq(schema.announcements.authorId, schema.users.id))
            .where(and(
                eq(schema.announcements.id, id),
                isNull(schema.announcements.deletedAt)
            ))
            .limit(1);

        return announcement ? (announcement as Announcement & { authorName: string; authorEmail: string }) : null;
    }

    async getAnnouncementStats(userId?: string): Promise<{
        totalCount: number;
        activeCount: number;
        scheduledCount: number;
        draftCount: number;
        highPriorityCount: number;
    }> {
        // Build where conditions (same logic as getAnnouncementsPaginated)
        let whereConditions = [isNull(schema.announcements.deletedAt)];

        // Filter by user's authorized sites if userId provided
        if (userId) {
            const user = await this.getUserById(userId);
            
            // Admin can see all announcements
            if (user?.role !== 'admin') {
                // Get user's site assignments
                const userSiteAssignments = await this.getUserSiteAssignments(userId);
                const userSiteIds = userSiteAssignments.map(assignment => assignment.siteId);

                if (userSiteIds.length > 0) {
                    // Get buildings for user's sites
                    const userBuildings = await db
                        .select({ id: schema.buildings.id })
                        .from(schema.buildings)
                        .where(inArray(schema.buildings.siteId, userSiteIds));

                    const userBuildingIds = userBuildings.map(b => b.id);

                    // Filter announcements: ONLY show announcements for user's buildings
                    // Kullanıcı sadece erişebileceği building'lerin duyurularını görmeli
                    if (userBuildingIds.length > 0) {
                        whereConditions.push(
                            inArray(schema.announcements.buildingId, userBuildingIds)
                        );
                    } else {
                        // No buildings = show nothing (user has no access to any buildings)
                        whereConditions.push(sql`1 = 0`); // Always false condition
                    }
                } else {
                    // User has no site assignments = show nothing
                    whereConditions.push(sql`1 = 0`); // Always false condition
                }
            }
        }

        const [stats] = await db
            .select({
                totalCount: sql<number>`COUNT(*)::int`,
                activeCount: sql<number>`COUNT(CASE WHEN ${schema.announcements.status} = 'Published' THEN 1 END)::int`,
                scheduledCount: sql<number>`COUNT(CASE WHEN ${schema.announcements.status} = 'Scheduled' THEN 1 END)::int`,
                draftCount: sql<number>`COUNT(CASE WHEN ${schema.announcements.status} = 'Draft' THEN 1 END)::int`,
                highPriorityCount: sql<number>`COUNT(CASE WHEN ${schema.announcements.priority} = 'High' AND ${schema.announcements.status} = 'Published' THEN 1 END)::int`,
            })
            .from(schema.announcements)
            .where(and(...whereConditions));

        return stats;
    }

    async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
        // Ensure buildingId and siteId are explicitly null (not undefined) if not provided
        const insertData = {
            ...announcement,
            buildingId: announcement.buildingId ?? null,
            siteId: announcement.siteId ?? null,
        };
        
        // Debug log
        console.log('[createAnnouncement] insertData:', JSON.stringify(insertData, null, 2));
        console.log('[createAnnouncement] siteId value:', insertData.siteId);
        console.log('[createAnnouncement] siteId type:', typeof insertData.siteId);
        
        // Explicitly return all columns including siteId
        // Check if siteId exists in schema (it should after migration)
        const returningObj: any = {
            id: schema.announcements.id,
            authorId: schema.announcements.authorId,
            buildingId: schema.announcements.buildingId,
            title: schema.announcements.title,
            content: schema.announcements.content,
            priority: schema.announcements.priority,
            visibility: schema.announcements.visibility,
            status: schema.announcements.status,
            publishDate: schema.announcements.publishDate,
            createdAt: schema.announcements.createdAt,
            updatedAt: schema.announcements.updatedAt,
            deletedAt: schema.announcements.deletedAt,
        };
        
        // Add siteId if it exists in schema
        if (schema.announcements.siteId) {
            returningObj.siteId = schema.announcements.siteId;
        }
        
        const [newAnnouncement] = await db
            .insert(schema.announcements)
            .values(insertData)
            .returning(returningObj);
        
        console.log('[createAnnouncement] returned announcement:', JSON.stringify(newAnnouncement, null, 2));
        
        // If siteId was in insertData but not in returned announcement, add it manually
        // This happens when schema is not rebuilt after adding siteId column
        if (insertData.siteId && !(newAnnouncement as any).siteId) {
            (newAnnouncement as any).siteId = insertData.siteId;
            console.log('[createAnnouncement] Manually added siteId to returned announcement:', insertData.siteId);
        }
        
        return newAnnouncement;
    }

    async updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement> {
        const [updated] = await db
            .update(schema.announcements)
            .set({ ...announcement, updatedAt: new Date() })
            .where(eq(schema.announcements.id, id))
            .returning();
        return updated;
    }

    async deleteAnnouncement(id: string): Promise<void> {
        await db
            .update(schema.announcements)
            .set({ deletedAt: new Date() })
            .where(eq(schema.announcements.id, id));
    }

    // ==================== JANITOR ====================
    async getAllJanitors(): Promise<Janitor[]> {
        return await db.select().from(schema.janitors).where(isNull(schema.janitors.deletedAt));
    }

    async getJanitorRequestsByUnitId(unitId: string): Promise<JanitorRequest[]> {
        return await db
            .select()
            .from(schema.janitorRequests)
            .where(
                and(
                    eq(schema.janitorRequests.unitId, unitId),
                    isNull(schema.janitorRequests.deletedAt)
                )
            );
    }

    async getJanitorsByBuildingId(buildingId: string): Promise<Janitor[]> {
        const results = await db
            .select({
                janitor: schema.janitors
            })
            .from(schema.janitors)
            .innerJoin(
                schema.janitorBlockAssignments,
                eq(schema.janitors.id, schema.janitorBlockAssignments.janitorId)
            )
            .where(
                and(
                    eq(schema.janitorBlockAssignments.buildingId, buildingId),
                    isNull(schema.janitors.deletedAt)
                )
            );

        return results.map(r => r.janitor);
    }

    async createJanitor(janitor: InsertJanitor): Promise<Janitor> {
        const [newJanitor] = await db.insert(schema.janitors).values(janitor).returning();
        return newJanitor;
    }

    async updateJanitor(id: string, janitor: Partial<InsertJanitor>): Promise<Janitor> {
        const [updated] = await db
            .update(schema.janitors)
            .set({ ...janitor, updatedAt: new Date() })
            .where(eq(schema.janitors.id, id))
            .returning();
        return updated;
    }

    async createJanitorRequest(req: InsertJanitorRequest): Promise<JanitorRequest> {
        const [newRequest] = await db
            .insert(schema.janitorRequests)
            .values(req)
            .returning();
        return newRequest;
    }

    async updateJanitorRequestStatus(
        id: string,
        status: string,
        completedAt?: Date
    ): Promise<JanitorRequest> {
        const [updated] = await db
            .update(schema.janitorRequests)
            .set({
                status: status as any,
                completedAt: completedAt || (status === 'completed' ? new Date() : null),
                updatedAt: new Date(),
            })
            .where(eq(schema.janitorRequests.id, id))
            .returning();
        return updated;
    }

    async deleteJanitorRequest(id: string): Promise<void> {
        await db
            .update(schema.janitorRequests)
            .set({ deletedAt: new Date() })
            .where(eq(schema.janitorRequests.id, id));
    }

    async assignJanitorToBuilding(janitorId: string, buildingId: string): Promise<void> {
        await db.insert(schema.janitorBlockAssignments).values({ janitorId, buildingId });
    }

    async unassignJanitorFromBuilding(janitorId: string, buildingId: string): Promise<void> {
        await db
            .delete(schema.janitorBlockAssignments)
            .where(
                and(
                    eq(schema.janitorBlockAssignments.janitorId, janitorId),
                    eq(schema.janitorBlockAssignments.buildingId, buildingId)
                )
            );
    }

    async deleteJanitor(id: string): Promise<void> {
        await db
            .update(schema.janitors)
            .set({ deletedAt: new Date() })
            .where(eq(schema.janitors.id, id));
    }

    // ==================== COMMUNITY & POLLS ====================
    async getCommunityStats(): Promise<any> {
        const [pendingRequests] = await db
            .select({ value: count() })
            .from(schema.communityRequests)
            .where(and(
                eq(schema.communityRequests.status, 'pending'),
                isNull(schema.communityRequests.deletedAt)
            ));

        const [resolvedRequests] = await db
            .select({ value: count() })
            .from(schema.communityRequests)
            .where(and(
                eq(schema.communityRequests.status, 'resolved'),
                isNull(schema.communityRequests.deletedAt)
            ));

        const [rejectedRequests] = await db
            .select({ value: count() })
            .from(schema.communityRequests)
            .where(and(
                eq(schema.communityRequests.status, 'rejected'),
                isNull(schema.communityRequests.deletedAt)
            ));

        const [activePolls] = await db
            .select({ value: count() })
            .from(schema.polls)
            .where(and(
                eq(schema.polls.status, 'active'),
                isNull(schema.polls.deletedAt)
            ));

        const [closedPolls] = await db
            .select({ value: count() })
            .from(schema.polls)
            .where(and(
                eq(schema.polls.status, 'closed'),
                isNull(schema.polls.deletedAt)
            ));

        return {
            pendingRequests: pendingRequests.value,
            resolvedRequests: resolvedRequests.value,
            rejectedRequests: rejectedRequests.value,
            activePolls: activePolls.value,
            closedPolls: closedPolls.value,
        };
    }

    async getCommunityRequests(): Promise<CommunityRequest[]> {
        return await db
            .select()
            .from(schema.communityRequests)
            .where(isNull(schema.communityRequests.deletedAt))
            .orderBy(desc(schema.communityRequests.createdAt));
    }

    async getCommunityRequestsPaginated(
        page: number,
        limit: number,
        filters?: { search?: string; status?: string; type?: 'wish' | 'suggestion' }
    ): Promise<{
        requests: CommunityRequest[];
        total: number;
    }> {
        const offset = (page - 1) * limit;

        // Build where clause with filters
        const whereConditions = [isNull(schema.communityRequests.deletedAt)];

        if (filters?.search) {
            whereConditions.push(
                or(
                    ilike(schema.communityRequests.title, `%${filters.search}%`),
                    ilike(schema.communityRequests.description, `%${filters.search}%`)
                ) as any
            );
        }

        if (filters?.status) {
            whereConditions.push(eq(schema.communityRequests.status, filters.status as any));
        }

        if (filters?.type) {
            whereConditions.push(eq(schema.communityRequests.type, filters.type));
        }

        const whereClause = and(...whereConditions);

        const [requests, totalResult] = await Promise.all([
            db
                .select()
                .from(schema.communityRequests)
                .where(whereClause)
                .orderBy(desc(schema.communityRequests.createdAt))
                .limit(limit)
                .offset(offset),
            db
                .select({ count: count() })
                .from(schema.communityRequests)
                .where(whereClause)
        ]);

        return {
            requests,
            total: totalResult[0]?.count || 0,
        };
    }

    async createCommunityRequest(req: InsertCommunityRequest): Promise<CommunityRequest> {
        const [newRequest] = await db
            .insert(schema.communityRequests)
            .values(req)
            .returning();
        return newRequest;
    }

    async updateCommunityRequestType(id: string, type: string): Promise<CommunityRequest> {
        const [updated] = await db
            .update(schema.communityRequests)
            .set({
                type: type as any,
                updatedAt: new Date(),
            })
            .where(eq(schema.communityRequests.id, id))
            .returning();
        return updated;
    }

    async updateCommunityRequestStatus(id: string, status: string): Promise<CommunityRequest> {
        const [updated] = await db
            .update(schema.communityRequests)
            .set({
                status: status as any,
                updatedAt: new Date(),
            })
            .where(eq(schema.communityRequests.id, id))
            .returning();
        return updated;
    }

    async deleteCommunityRequest(id: string): Promise<void> {
        await db
            .update(schema.communityRequests)
            .set({ deletedAt: new Date() })
            .where(eq(schema.communityRequests.id, id));
    }

    async getPolls(): Promise<any[]> {
        // Get all polls
        const polls = await db
            .select()
            .from(schema.polls)
            .where(isNull(schema.polls.deletedAt))
            .orderBy(desc(schema.polls.createdAt));

        // Get votes for each poll
        const pollsWithVotes = await Promise.all(
            polls.map(async (poll) => {
                const votes = await this.getPollVotes(poll.id);
                return {
                    ...poll,
                    votes,
                };
            })
        );

        return pollsWithVotes;
    }

    async getPollsPaginated(
        page: number,
        limit: number,
        filters?: { search?: string; status?: 'active' | 'closed' }
    ): Promise<{
        polls: any[];
        total: number;
    }> {
        const offset = (page - 1) * limit;

        // Build where clause with filters
        const whereConditions = [isNull(schema.polls.deletedAt)];

        if (filters?.search) {
            whereConditions.push(
                or(
                    ilike(schema.polls.title, `%${filters.search}%`),
                    ilike(schema.polls.description, `%${filters.search}%`)
                ) as any
            );
        }

        if (filters?.status) {
            whereConditions.push(eq(schema.polls.status, filters.status));
        }

        const whereClause = and(...whereConditions);

        // Get paginated polls
        const [polls, totalResult] = await Promise.all([
            db
                .select()
                .from(schema.polls)
                .where(whereClause)
                .orderBy(desc(schema.polls.createdAt))
                .limit(limit)
                .offset(offset),
            db
                .select({ count: count() })
                .from(schema.polls)
                .where(whereClause)
        ]);

        // Get votes for each poll
        const pollsWithVotes = await Promise.all(
            polls.map(async (poll) => {
                const votes = await this.getPollVotes(poll.id);
                return {
                    ...poll,
                    votes,
                };
            })
        );

        return {
            polls: pollsWithVotes,
            total: totalResult[0]?.count || 0,
        };
    }

    async createPoll(poll: InsertPoll): Promise<Poll> {
        const [newPoll] = await db
            .insert(schema.polls)
            .values(poll)
            .returning();
        return newPoll;
    }

    async updatePollStatus(id: string, status: string): Promise<Poll> {
        const [updated] = await db
            .update(schema.polls)
            .set({
                status: status as any,
                updatedAt: new Date(),
            })
            .where(eq(schema.polls.id, id))
            .returning();
        return updated;
    }

    async deletePoll(id: string): Promise<void> {
        await db
            .update(schema.polls)
            .set({ deletedAt: new Date() })
            .where(eq(schema.polls.id, id));
    }

    async getPollVotes(pollId: string): Promise<PollVote[]> {
        return await db
            .select()
            .from(schema.pollVotes)
            .where(eq(schema.pollVotes.pollId, pollId));
    }

    async createPollVote(vote: InsertPollVote): Promise<PollVote> {
        const [newVote] = await db
            .insert(schema.pollVotes)
            .values(vote)
            .returning();
        return newVote;
    }

    // ==================== TRANSACTIONS ====================
    async getTransactionsByPeriod(startDate: Date, endDate: Date): Promise<Transaction[]> {
        return await db
            .select()
            .from(schema.transactions)
            .where(
                and(
                    gte(schema.transactions.transactionDate, startDate),
                    lte(schema.transactions.transactionDate, endDate),
                    isNull(schema.transactions.deletedAt)
                )
            )
            .orderBy(desc(schema.transactions.transactionDate));
    }

    async createTransaction(tx: InsertTransaction): Promise<Transaction> {
        const [newTx] = await db
            .insert(schema.transactions)
            .values(tx)
            .returning();
        return newTx;
    }

    async updateTransaction(id: string, tx: Partial<InsertTransaction>): Promise<Transaction> {
        const [updated] = await db
            .update(schema.transactions)
            .set({ ...tx, updatedAt: new Date() })
            .where(eq(schema.transactions.id, id))
            .returning();
        return updated;
    }

    async deleteTransaction(id: string): Promise<void> {
        await db
            .update(schema.transactions)
            .set({ deletedAt: new Date() })
            .where(eq(schema.transactions.id, id));
    }

    async hasResidentVotedInPoll(residentId: string, pollId: string): Promise<boolean> {
        const [vote] = await db
            .select()
            .from(schema.pollVotes)
            .where(
                and(
                    eq(schema.pollVotes.residentId, residentId),
                    eq(schema.pollVotes.pollId, pollId)
                )
            )
            .limit(1);
        return !!vote;
    }

    // ==================== STATS ====================
    async getDashboardStats(): Promise<any> {
        const [residentsCount] = await db.select({ value: count() }).from(schema.residents).where(isNull(schema.residents.deletedAt));
        const [unitsCount] = await db.select({ value: count() }).from(schema.units).where(isNull(schema.units.deletedAt));
        const [occupiedUnitsCount] = await db.select({ value: count() }).from(schema.units).where(and(eq(schema.units.status, 'occupied'), isNull(schema.units.deletedAt)));
        const [pendingMaintenanceCount] = await db.select({ value: count() }).from(schema.maintenanceRequests).where(and(eq(schema.maintenanceRequests.status, 'New'), isNull(schema.maintenanceRequests.deletedAt)));
        const [pendingJanitorCount] = await db.select({ value: count() }).from(schema.janitorRequests).where(and(eq(schema.janitorRequests.status, 'pending'), isNull(schema.janitorRequests.deletedAt)));
        const [pendingCargoCount] = await db.select({ value: count() }).from(schema.cargoItems).where(and(eq(schema.cargoItems.status, 'received'), isNull(schema.cargoItems.deletedAt)));

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [dailyBookingsCount] = await db.select({ value: count() }).from(schema.bookings).where(and(eq(schema.bookings.bookingDate, startOfToday.toISOString().split('T')[0]), isNull(schema.bookings.deletedAt)));
        const [unpaidDuesCount] = await db.select({ value: count() }).from(schema.paymentRecords).where(and(eq(schema.paymentRecords.status, 'unpaid'), gte(schema.paymentRecords.createdAt, startOfMonth), isNull(schema.paymentRecords.deletedAt)));

        return {
            totalResidents: residentsCount.value,
            totalUnits: unitsCount.value,
            occupiedUnits: occupiedUnitsCount.value,
            vacancyRate: unitsCount.value > 0 ? ((unitsCount.value - occupiedUnitsCount.value) / unitsCount.value) * 100 : 0,
            pendingMaintenance: pendingMaintenanceCount.value,
            pendingJanitor: pendingJanitorCount.value,
            pendingCargo: pendingCargoCount.value,
            dailyBookings: dailyBookingsCount.value,
            unpaidDues: unpaidDuesCount.value
        };
    }

    // ==================== DASHBOARD ====================
    async getRecentPayments(limit = 5): Promise<PaymentRecord[]> {
        return await db.select()
            .from(schema.paymentRecords)
            .where(isNull(schema.paymentRecords.deletedAt))
            .orderBy(desc(schema.paymentRecords.createdAt))
            .limit(limit);
    }

    async getRecentMaintenanceRequests(limit = 4): Promise<MaintenanceRequest[]> {
        return await db.select()
            .from(schema.maintenanceRequests)
            .where(isNull(schema.maintenanceRequests.deletedAt))
            .orderBy(desc(schema.maintenanceRequests.createdAt))
            .limit(limit);
    }

    async getTodayBookings(): Promise<Booking[]> {
        const today = new Date().toISOString().split('T')[0];
        return await db.select()
            .from(schema.bookings)
            .where(and(
                eq(schema.bookings.bookingDate, today),
                isNull(schema.bookings.deletedAt)
            ))
            .orderBy(schema.bookings.startTime);
    }

    async getMonthlyIncome(year: number): Promise<{ month: number; value: number }[]> {
        const result = await db.select({
            month: sql<number>`EXTRACT(MONTH FROM ${schema.paymentRecords.createdAt})`,
            value: sql<number>`SUM(CAST(${schema.paymentRecords.amount} AS NUMERIC))`
        })
        .from(schema.paymentRecords)
        .where(and(
            eq(schema.paymentRecords.status, 'paid'),
            sql`EXTRACT(YEAR FROM ${schema.paymentRecords.createdAt}) = ${year}`,
            isNull(schema.paymentRecords.deletedAt)
        ))
        .groupBy(sql`EXTRACT(MONTH FROM ${schema.paymentRecords.createdAt})`)
        .orderBy(sql`EXTRACT(MONTH FROM ${schema.paymentRecords.createdAt})`);
        
        // Convert string values to numbers
        return result.map(row => ({
            month: Number(row.month),
            value: Number(row.value)
        }));
    }

    // ==================== RESIDENTS FULL DATA (JOIN) ====================
    /**
     * Get full building data with nested relationships (JOIN)
     * Returns: building + units + residents + vehicles + parkingSpots
     * This avoids waterfall requests by fetching all related data in one go
     */
    async getBuildingFullData(buildingId: string): Promise<any> {
        // 1. Building bilgisi
        const building = await this.getBuildingById(buildingId);
        if (!building) throw new Error('Building not found');

        // 2. Units + Residents + Vehicles (JOIN ile)
        const unitsWithResidents = await db
            .select({
                unit: schema.units,
                resident: schema.residents,
                vehicle: schema.vehicles,
            })
            .from(schema.units)
            .leftJoin(schema.residents, and(
                eq(schema.residents.unitId, schema.units.id),
                isNull(schema.residents.deletedAt)
            ))
            .leftJoin(schema.vehicles, and(
                eq(schema.vehicles.residentId, schema.residents.id),
                isNull(schema.vehicles.deletedAt)
            ))
            .where(
                and(
                    eq(schema.units.buildingId, buildingId),
                    isNull(schema.units.deletedAt)
                )
            );

        // 3. Parking Spots + Assigned Vehicles
        const parkingSpotsWithVehicles = await db
            .select({
                spot: schema.parkingSpots,
                vehicle: schema.vehicles,
            })
            .from(schema.parkingSpots)
            .leftJoin(schema.vehicles, and(
                eq(schema.vehicles.parkingSpotId, schema.parkingSpots.id),
                isNull(schema.vehicles.deletedAt)
            ))
            .where(
                and(
                    eq(schema.parkingSpots.buildingId, buildingId),
                    isNull(schema.parkingSpots.deletedAt)
                )
            );

        // 4. Data'yı nested structure'a dönüştür
        const units = this.transformToNestedUnits(unitsWithResidents);
        const parkingSpots = this.transformToParkingSpots(parkingSpotsWithVehicles);

        return {
            building,
            units,
            parkingSpots,
        };
    }

    /**
     * Helper: Flat JOIN result'ı nested structure'a çevir
     * Units -> Residents -> Vehicles hierarchy'si oluşturur
     */
    private transformToNestedUnits(rows: any[]): any[] {
        const unitsMap = new Map<string, any>();
        
        rows.forEach(row => {
            const unitId = row.unit.id;
            
            // Unit yoksa ekle
            if (!unitsMap.has(unitId)) {
                unitsMap.set(unitId, {
                    ...row.unit,
                    residents: [],
                });
            }
            
            const unit = unitsMap.get(unitId)!;
            
            // Resident varsa ekle
            if (row.resident) {
                let resident = unit.residents.find((r: any) => r.id === row.resident.id);
                if (!resident) {
                    resident = {
                        ...row.resident,
                        vehicles: [],
                    };
                    unit.residents.push(resident);
                }
                
                // Vehicle varsa ekle
                if (row.vehicle) {
                    const vehicleExists = resident.vehicles.some((v: any) => v.id === row.vehicle.id);
                    if (!vehicleExists) {
                        resident.vehicles.push(row.vehicle);
                    }
                }
            }
        });
        
        return Array.from(unitsMap.values());
    }

    /**
     * Helper: Parking spots ile assigned vehicles'ı birleştir
     */
    private transformToParkingSpots(rows: any[]): any[] {
        const spotsMap = new Map<string, any>();
        
        rows.forEach(row => {
            const spotId = row.spot.id;
            
            if (!spotsMap.has(spotId)) {
                spotsMap.set(spotId, {
                    ...row.spot,
                    assignedVehicle: row.vehicle || null,
                });
            }
        });
        
        return Array.from(spotsMap.values());
    }

    /**
     * Get paginated guest visits with filters
     */
    async getGuestVisitsPaginated(
        page: number,
        limit: number,
        filters?: { status?: string; search?: string }
    ): Promise<{ visits: GuestVisit[]; total: number; page: number; limit: number }> {
        const offset = (page - 1) * limit;
        
        // Build where conditions
        const conditions = [isNull(schema.guestVisits.deletedAt)];
        
        if (filters?.status) {
            conditions.push(eq(schema.guestVisits.status, filters.status as any));
        }
        
        if (filters?.search) {
            const searchCondition = or(
                ilike(schema.guestVisits.plate, `%${filters.search}%`),
                ilike(schema.guestVisits.guestName, `%${filters.search}%`)
            );
            if (searchCondition) {
                conditions.push(searchCondition);
            }
        }
        
        // Build where clause
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        
        // Get total count
        const [{ count: totalCount }] = await db
            .select({ count: count() })
            .from(schema.guestVisits)
            .where(whereClause);
        
        // Get paginated results
        const visits = await db
            .select()
            .from(schema.guestVisits)
            .where(whereClause)
            .orderBy(desc(schema.guestVisits.createdAt))
            .limit(limit)
            .offset(offset);
        
        return {
            visits,
            total: Number(totalCount),
            page,
            limit,
        };
    }
}
