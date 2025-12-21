import { eq, and, desc, gte, lte, count } from 'drizzle-orm';
import { db } from './db/index.js';
import type { IStorage } from './storage.js';
import * as schema from 'apartium-shared';
import type {
    User, InsertUser,
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
    Transaction, InsertTransaction
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
            .where(eq(schema.users.email, email))
            .limit(1);
        return user || null;
    }

    async getUserById(id: string): Promise<User | null> {
        const [user] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, id))
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

    // ==================== BUILDINGS ====================
    async getAllBuildings(): Promise<Building[]> {
        return await db.select().from(schema.buildings);
    }

    async getBuildingById(id: string): Promise<Building | null> {
        const [building] = await db
            .select()
            .from(schema.buildings)
            .where(eq(schema.buildings.id, id))
            .limit(1);
        return building || null;
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
            .delete(schema.buildings)
            .where(eq(schema.buildings.id, id));
    }

    // ==================== UNITS ====================
    async getUnitsByBuildingId(buildingId: string): Promise<Unit[]> {
        return await db
            .select()
            .from(schema.units)
            .where(eq(schema.units.buildingId, buildingId));
    }

    async getUnitById(id: string): Promise<Unit | null> {
        const [unit] = await db
            .select()
            .from(schema.units)
            .where(eq(schema.units.id, id))
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
            .delete(schema.units)
            .where(eq(schema.units.id, id));
    }

    // ==================== RESIDENTS ====================
    async getResidentsByUnitId(unitId: string): Promise<Resident[]> {
        return await db
            .select()
            .from(schema.residents)
            .where(eq(schema.residents.unitId, unitId));
    }

    async getResidentById(id: string): Promise<Resident | null> {
        const [resident] = await db
            .select()
            .from(schema.residents)
            .where(eq(schema.residents.id, id))
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
            .delete(schema.residents)
            .where(eq(schema.residents.id, id));
    }

    // ==================== VEHICLES & PARKING ====================
    async getVehiclesByResidentId(residentId: string): Promise<Vehicle[]> {
        return await db
            .select()
            .from(schema.vehicles)
            .where(eq(schema.vehicles.residentId, residentId));
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
            .delete(schema.vehicles)
            .where(eq(schema.vehicles.id, id));
    }

    async getParkingSpotsByBuildingId(buildingId: string): Promise<ParkingSpot[]> {
        return await db
            .select()
            .from(schema.parkingSpots)
            .where(eq(schema.parkingSpots.buildingId, buildingId));
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
            .delete(schema.parkingSpots)
            .where(eq(schema.parkingSpots.id, id));
    }

    async getGuestVisitsByUnitId(unitId: string): Promise<GuestVisit[]> {
        return await db
            .select()
            .from(schema.guestVisits)
            .where(eq(schema.guestVisits.unitId, unitId));
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
        await db.delete(schema.guestVisits).where(eq(schema.guestVisits.id, id));
    }

    // ==================== PAYMENT RECORDS ====================
    async getPaymentRecordsByPeriod(month: string, year: number): Promise<PaymentRecord[]> {
        return await db
            .select()
            .from(schema.paymentRecords)
            .where(
                and(
                    eq(schema.paymentRecords.periodMonth, month),
                    eq(schema.paymentRecords.periodYear, year)
                )
            );
    }

    async getPaymentRecordsByResidentId(residentId: string): Promise<PaymentRecord[]> {
        return await db
            .select()
            .from(schema.paymentRecords)
            .where(eq(schema.paymentRecords.residentId, residentId));
    }

    async getPaymentRecordById(id: string): Promise<PaymentRecord | null> {
        const [payment] = await db
            .select()
            .from(schema.paymentRecords)
            .where(eq(schema.paymentRecords.id, id))
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
        await db.delete(schema.paymentRecords).where(eq(schema.paymentRecords.id, id));
    }

    // ==================== EXPENSE RECORDS ====================
    async getExpenseRecordsByPeriod(month: string, year: number): Promise<ExpenseRecord[]> {
        return await db
            .select()
            .from(schema.expenseRecords)
            .where(
                and(
                    eq(schema.expenseRecords.periodMonth, month),
                    eq(schema.expenseRecords.periodYear, year)
                )
            );
    }

    async getExpenseRecordById(id: string): Promise<ExpenseRecord | null> {
        const [expense] = await db
            .select()
            .from(schema.expenseRecords)
            .where(eq(schema.expenseRecords.id, id))
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
            .delete(schema.expenseRecords)
            .where(eq(schema.expenseRecords.id, id));
    }

    // ==================== FACILITIES & BOOKINGS ====================
    async getAllFacilities(): Promise<Facility[]> {
        return await db.select().from(schema.facilities);
    }

    async getFacilityById(id: string): Promise<Facility | null> {
        const [facility] = await db
            .select()
            .from(schema.facilities)
            .where(eq(schema.facilities.id, id))
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
            .delete(schema.facilities)
            .where(eq(schema.facilities.id, id));
    }

    async getBookingsByFacilityId(facilityId: string): Promise<Booking[]> {
        return await db
            .select()
            .from(schema.bookings)
            .where(eq(schema.bookings.facilityId, facilityId));
    }

    async getBookingsByResidentId(residentId: string): Promise<Booking[]> {
        return await db
            .select()
            .from(schema.bookings)
            .where(eq(schema.bookings.residentId, residentId));
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
            .delete(schema.bookings)
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
            .where(eq(schema.cargoItems.unitId, unitId));
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
            .delete(schema.cargoItems)
            .where(eq(schema.cargoItems.id, id));
    }

    async getExpectedCargoByResidentId(residentId: string): Promise<ExpectedCargo[]> {
        return await db
            .select()
            .from(schema.expectedCargo)
            .where(eq(schema.expectedCargo.residentId, residentId));
    }

    async createExpectedCargo(cargo: InsertExpectedCargo): Promise<ExpectedCargo> {
        const [newItem] = await db
            .insert(schema.expectedCargo)
            .values(cargo)
            .returning();
        return newItem;
    }

    async deleteExpectedCargo(id: string): Promise<void> {
        await db.delete(schema.expectedCargo).where(eq(schema.expectedCargo.id, id));
    }

    async getCourierVisitsByUnitId(unitId: string): Promise<CourierVisit[]> {
        return await db
            .select()
            .from(schema.courierVisits)
            .where(eq(schema.courierVisits.unitId, unitId));
    }

    async createCourierVisit(visit: InsertCourierVisit): Promise<CourierVisit> {
        const [newVisit] = await db
            .insert(schema.courierVisits)
            .values(visit)
            .returning();
        return newVisit;
    }

    async deleteCourierVisit(id: string): Promise<void> {
        await db.delete(schema.courierVisits).where(eq(schema.courierVisits.id, id));
    }

    // ==================== MAINTENANCE ====================
    async getMaintenanceRequestsByUnitId(unitId: string): Promise<MaintenanceRequest[]> {
        return await db
            .select()
            .from(schema.maintenanceRequests)
            .where(eq(schema.maintenanceRequests.unitId, unitId));
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
            .delete(schema.maintenanceRequests)
            .where(eq(schema.maintenanceRequests.id, id));
    }

    // ==================== ANNOUNCEMENTS ====================
    async getAnnouncements(): Promise<Announcement[]> {
        return await db
            .select()
            .from(schema.announcements)
            .orderBy(desc(schema.announcements.publishDate));
    }

    async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
        const [newAnnouncement] = await db
            .insert(schema.announcements)
            .values(announcement)
            .returning();
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
            .delete(schema.announcements)
            .where(eq(schema.announcements.id, id));
    }

    // ==================== JANITOR ====================
    async getAllJanitors(): Promise<Janitor[]> {
        return await db.select().from(schema.janitors);
    }

    async getJanitorRequestsByUnitId(unitId: string): Promise<JanitorRequest[]> {
        return await db
            .select()
            .from(schema.janitorRequests)
            .where(eq(schema.janitorRequests.unitId, unitId));
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
            .where(eq(schema.janitorBlockAssignments.buildingId, buildingId));

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
            .delete(schema.janitorRequests)
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
    async getCommunityRequests(): Promise<CommunityRequest[]> {
        return await db
            .select()
            .from(schema.communityRequests)
            .orderBy(desc(schema.communityRequests.createdAt));
    }

    async createCommunityRequest(req: InsertCommunityRequest): Promise<CommunityRequest> {
        const [newRequest] = await db
            .insert(schema.communityRequests)
            .values(req)
            .returning();
        return newRequest;
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
            .delete(schema.communityRequests)
            .where(eq(schema.communityRequests.id, id));
    }

    async getPolls(): Promise<Poll[]> {
        return await db
            .select()
            .from(schema.polls)
            .orderBy(desc(schema.polls.createdAt));
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
            .delete(schema.polls)
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
                    lte(schema.transactions.transactionDate, endDate)
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
            .delete(schema.transactions)
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
        const [residentsCount] = await db.select({ value: count() }).from(schema.residents);
        const [unitsCount] = await db.select({ value: count() }).from(schema.units);
        const [occupiedUnitsCount] = await db.select({ value: count() }).from(schema.units).where(eq(schema.units.status, 'occupied'));
        const [pendingMaintenanceCount] = await db.select({ value: count() }).from(schema.maintenanceRequests).where(eq(schema.maintenanceRequests.status, 'New'));
        const [pendingJanitorCount] = await db.select({ value: count() }).from(schema.janitorRequests).where(eq(schema.janitorRequests.status, 'pending'));
        const [pendingCargoCount] = await db.select({ value: count() }).from(schema.cargoItems).where(eq(schema.cargoItems.status, 'received'));

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [dailyBookingsCount] = await db.select({ value: count() }).from(schema.bookings).where(eq(schema.bookings.bookingDate, startOfToday.toISOString().split('T')[0]));
        const [unpaidDuesCount] = await db.select({ value: count() }).from(schema.paymentRecords).where(and(eq(schema.paymentRecords.status, 'unpaid'), gte(schema.paymentRecords.createdAt, startOfMonth)));

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
}
