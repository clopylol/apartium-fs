import { eq, and } from 'drizzle-orm';
import { db } from './db/index.js';
import type { IStorage } from './storage.js';
import * as schema from 'apartium-shared';
import type {
    User, InsertUser,
    Building, InsertBuilding,
    Unit, InsertUnit,
    Resident, InsertResident,
    PaymentRecord, InsertPaymentRecord,
    ExpenseRecord, InsertExpenseRecord
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

    async deleteExpenseRecord(id: string): Promise<void> {
        await db
            .delete(schema.expenseRecords)
            .where(eq(schema.expenseRecords.id, id));
    }
}
