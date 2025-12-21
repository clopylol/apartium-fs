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
 * Storage Interface
 * Tüm database işlemleri bu interface üzerinden yapılır.
 * Bu abstraction sayesinde database implementasyonu değiştirilebilir.
 */
export interface IStorage {
    // Users
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    createUser(user: InsertUser): Promise<User>;
    updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
    deleteUser(id: string): Promise<void>;

    // Buildings
    getAllBuildings(): Promise<Building[]>;
    getBuildingById(id: string): Promise<Building | null>;
    createBuilding(building: InsertBuilding): Promise<Building>;
    updateBuilding(id: string, building: Partial<InsertBuilding>): Promise<Building>;
    deleteBuilding(id: string): Promise<void>;

    // Units
    getUnitsByBuildingId(buildingId: string): Promise<Unit[]>;
    getUnitById(id: string): Promise<Unit | null>;
    createUnit(unit: InsertUnit): Promise<Unit>;
    updateUnit(id: string, unit: Partial<InsertUnit>): Promise<Unit>;
    deleteUnit(id: string): Promise<void>;

    // Residents
    getResidentsByUnitId(unitId: string): Promise<Resident[]>;
    getResidentById(id: string): Promise<Resident | null>;
    createResident(resident: InsertResident): Promise<Resident>;
    updateResident(id: string, resident: Partial<InsertResident>): Promise<Resident>;
    deleteResident(id: string): Promise<void>;

    // Vehicles & Parking
    getVehiclesByResidentId(residentId: string): Promise<Vehicle[]>;
    createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
    updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle>;
    getParkingSpotsByBuildingId(buildingId: string): Promise<ParkingSpot[]>;
    createParkingSpot(spot: InsertParkingSpot): Promise<ParkingSpot>;
    updateParkingSpot(id: string, spot: Partial<InsertParkingSpot>): Promise<ParkingSpot>;
    deleteParkingSpot(id: string): Promise<void>;
    getGuestVisitsByUnitId(unitId: string): Promise<GuestVisit[]>;
    createGuestVisit(visit: InsertGuestVisit): Promise<GuestVisit>;
    updateGuestVisitStatus(id: string, status: string): Promise<GuestVisit>;
    deleteGuestVisit(id: string): Promise<void>;
    deleteVehicle(id: string): Promise<void>;

    // Payment Records
    getPaymentRecordsByPeriod(month: string, year: number): Promise<PaymentRecord[]>;
    getPaymentRecordsByResidentId(residentId: string): Promise<PaymentRecord[]>;
    getPaymentRecordById(id: string): Promise<PaymentRecord | null>;
    createPaymentRecord(payment: InsertPaymentRecord): Promise<PaymentRecord>;
    updatePaymentStatus(id: string, status: 'paid' | 'unpaid', paymentDate?: Date): Promise<PaymentRecord>;
    deletePaymentRecord(id: string): Promise<void>;

    // Expense Records
    getExpenseRecordsByPeriod(month: string, year: number): Promise<ExpenseRecord[]>;
    getExpenseRecordById(id: string): Promise<ExpenseRecord | null>;
    createExpenseRecord(expense: InsertExpenseRecord): Promise<ExpenseRecord>;
    updateExpenseRecord(id: string, expense: Partial<InsertExpenseRecord>): Promise<ExpenseRecord>;
    deleteExpenseRecord(id: string): Promise<void>;

    // Facilities & Bookings
    getAllFacilities(): Promise<Facility[]>;
    getFacilityById(id: string): Promise<Facility | null>;
    createFacility(facility: InsertFacility): Promise<Facility>;
    updateFacility(id: string, facility: Partial<InsertFacility>): Promise<Facility>;
    deleteFacility(id: string): Promise<void>;
    getBookingsByFacilityId(facilityId: string): Promise<Booking[]>;
    getBookingsByResidentId(residentId: string): Promise<Booking[]>;
    createBooking(booking: InsertBooking): Promise<Booking>;
    updateBookingStatus(id: string, status: string, rejectionReason?: string): Promise<Booking>;
    deleteBooking(id: string): Promise<void>;

    // Cargo Management
    getCargoItemsByUnitId(unitId: string): Promise<CargoItem[]>;
    createCargoItem(cargo: InsertCargoItem): Promise<CargoItem>;
    updateCargoStatus(id: string, status: string, deliveredDate?: Date): Promise<CargoItem>;
    deleteCargoItem(id: string): Promise<void>;
    getExpectedCargoByResidentId(residentId: string): Promise<ExpectedCargo[]>;
    createExpectedCargo(cargo: InsertExpectedCargo): Promise<ExpectedCargo>;
    getCourierVisitsByUnitId(unitId: string): Promise<CourierVisit[]>;
    createCourierVisit(visit: InsertCourierVisit): Promise<CourierVisit>;
    deleteExpectedCargo(id: string): Promise<void>;
    deleteCourierVisit(id: string): Promise<void>;

    // Maintenance
    getMaintenanceRequestsByUnitId(unitId: string): Promise<MaintenanceRequest[]>;
    createMaintenanceRequest(req: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
    updateMaintenanceStatus(id: string, status: string, completedDate?: Date): Promise<MaintenanceRequest>;
    deleteMaintenanceRequest(id: string): Promise<void>;

    // Announcements
    getAnnouncements(): Promise<Announcement[]>;
    createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
    updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement>;
    deleteAnnouncement(id: string): Promise<void>;

    // Janitor
    getAllJanitors(): Promise<Janitor[]>;
    getJanitorRequestsByUnitId(unitId: string): Promise<JanitorRequest[]>;
    getJanitorsByBuildingId(buildingId: string): Promise<Janitor[]>;
    createJanitor(janitor: InsertJanitor): Promise<Janitor>;
    updateJanitor(id: string, janitor: Partial<InsertJanitor>): Promise<Janitor>;
    createJanitorRequest(req: InsertJanitorRequest): Promise<JanitorRequest>;
    updateJanitorRequestStatus(id: string, status: string, completedAt?: Date): Promise<JanitorRequest>;
    deleteJanitorRequest(id: string): Promise<void>;
    assignJanitorToBuilding(janitorId: string, buildingId: string): Promise<void>;
    unassignJanitorFromBuilding(janitorId: string, buildingId: string): Promise<void>;
    deleteJanitor(id: string): Promise<void>;

    // Community & Polls
    getCommunityRequests(): Promise<CommunityRequest[]>;
    createCommunityRequest(req: InsertCommunityRequest): Promise<CommunityRequest>;
    updateCommunityRequestStatus(id: string, status: string): Promise<CommunityRequest>;
    deleteCommunityRequest(id: string): Promise<void>;
    getPolls(): Promise<Poll[]>;
    createPoll(poll: InsertPoll): Promise<Poll>;
    updatePollStatus(id: string, status: string): Promise<Poll>;
    deletePoll(id: string): Promise<void>;
    getPollVotes(pollId: string): Promise<PollVote[]>;
    createPollVote(vote: InsertPollVote): Promise<PollVote>;
    hasResidentVotedInPoll(residentId: string, pollId: string): Promise<boolean>;

    // Transactions
    getTransactionsByPeriod(startDate: Date, endDate: Date): Promise<Transaction[]>;
    createTransaction(tx: InsertTransaction): Promise<Transaction>;
    updateTransaction(id: string, tx: Partial<InsertTransaction>): Promise<Transaction>;
    deleteTransaction(id: string): Promise<void>;

    // Stats
    getDashboardStats(): Promise<any>;
}
