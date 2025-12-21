import type {
    User, InsertUser,
    Building, InsertBuilding,
    Unit, InsertUnit,
    Resident, InsertResident,
    PaymentRecord, InsertPaymentRecord,
    ExpenseRecord, InsertExpenseRecord
} from 'apartium-shared';

/**
 * Storage Interface
 * Tüm database işlemleri bu interface üzerinden yapılır.
 * Bu abstraction sayesinde database implementasyonu değiştirilebilir.
 */
export interface IStorage {
    // Users
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    createUser(user: InsertUser): Promise<User>;

    // Buildings
    getAllBuildings(): Promise<Building[]>;
    getBuildingById(id: string): Promise<Building | null>;
    createBuilding(building: InsertBuilding): Promise<Building>;

    // Units
    getUnitsByBuildingId(buildingId: string): Promise<Unit[]>;
    getUnitById(id: string): Promise<Unit | null>;
    createUnit(unit: InsertUnit): Promise<Unit>;

    // Residents
    getResidentsByUnitId(unitId: string): Promise<Resident[]>;
    getResidentById(id: string): Promise<Resident | null>;
    createResident(resident: InsertResident): Promise<Resident>;

    // Payment Records
    getPaymentRecordsByPeriod(month: string, year: number): Promise<PaymentRecord[]>;
    getPaymentRecordById(id: string): Promise<PaymentRecord | null>;
    createPaymentRecord(payment: InsertPaymentRecord): Promise<PaymentRecord>;
    updatePaymentStatus(id: string, status: 'paid' | 'unpaid', paymentDate?: Date): Promise<PaymentRecord>;

    // Expense Records
    getExpenseRecordsByPeriod(month: string, year: number): Promise<ExpenseRecord[]>;
    getExpenseRecordById(id: string): Promise<ExpenseRecord | null>;
    createExpenseRecord(expense: InsertExpenseRecord): Promise<ExpenseRecord>;
    deleteExpenseRecord(id: string): Promise<void>;
}
