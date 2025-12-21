import express, { type Router } from 'express';
import type { IStorage } from './storage.js';
import { requireAuth } from './auth.js';
import {
    insertPaymentRecordSchema,
    insertExpenseRecordSchema,
    insertVehicleSchema,
    insertParkingSpotSchema,
    insertGuestVisitSchema,
    insertFacilitySchema,
    insertBookingSchema,
    insertCargoItemSchema,
    insertExpectedCargoSchema,
    insertCourierVisitSchema,
    insertMaintenanceRequestSchema,
    insertAnnouncementSchema,
    insertJanitorSchema,
    insertJanitorRequestSchema,
    insertCommunityRequestSchema,
    insertPollSchema,
    insertPollVoteSchema,
    insertTransactionSchema,
    insertBuildingSchema,
    insertUnitSchema,
    insertResidentSchema
} from 'apartium-shared';

export function createRoutes(storage: IStorage): Router {
    const router = express.Router();

    // ==================== DASHBOARD STATS ====================
    router.get('/stats', requireAuth, async (req, res) => {
        try {
            const stats = await storage.getDashboardStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: 'İstatistikler yüklenirken hata oluştu' });
        }
    });

    // ==================== AUTH ROUTES ====================

    // POST /api/auth/login
    router.post('/auth/login', (req, res, next) => {
        const passport = req.app.get('passport');
        passport.authenticate('local', (err: any, user: any, info: any) => {
            if (err) {
                return res.status(500).json({ error: 'Sunucu hatası' });
            }
            if (!user) {
                return res.status(401).json({ error: info?.message || 'Giriş başarısız' });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Oturum oluşturulamadı' });
                }
                const { passwordHash, ...userWithoutPassword } = user;
                return res.json({ user: userWithoutPassword });
            });
        })(req, res, next);
    });

    // POST /api/auth/logout
    router.post('/auth/logout', (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ error: 'Çıkış yapılamadı' });
            }
            res.json({ message: 'Başarıyla çıkış yapıldı' });
        });
    });

    router.get('/auth/me', requireAuth, (req, res) => {
        const { passwordHash, ...userWithoutPassword } = req.user as any;
        res.json({ user: userWithoutPassword });
    });

    router.patch('/users/:id', requireAuth, async (req, res) => {
        try {
            const user = await storage.updateUser(req.params.id, req.body);
            res.json({ user });
        } catch (error) {
            res.status(500).json({ error: 'Kullanıcı güncellenemedi' });
        }
    });

    router.delete('/users/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteUser(req.params.id);
            res.json({ message: 'Kullanıcı silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Kullanıcı silinemedi' });
        }
    });

    // ==================== CORE MANAGEMENT (BUILDINGS, UNITS, RESIDENTS) ====================

    // Buildings
    router.post('/buildings', requireAuth, async (req, res) => {
        try {
            const validatedData = insertBuildingSchema.parse(req.body);
            const building = await storage.createBuilding(validatedData);
            res.status(201).json({ building });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Blok oluşturulamadı' });
        }
    });

    router.patch('/buildings/:id', requireAuth, async (req, res) => {
        try {
            const building = await storage.updateBuilding(req.params.id, req.body);
            res.json({ building });
        } catch (error) {
            res.status(500).json({ error: 'Blok güncellenemedi' });
        }
    });

    router.delete('/buildings/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteBuilding(req.params.id);
            res.json({ message: 'Blok silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Blok silinemedi' });
        }
    });

    // Units
    router.post('/units', requireAuth, async (req, res) => {
        try {
            const validatedData = insertUnitSchema.parse(req.body);
            const unit = await storage.createUnit(validatedData);
            res.status(201).json({ unit });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Daire oluşturulamadı' });
        }
    });

    router.patch('/units/:id', requireAuth, async (req, res) => {
        try {
            const unit = await storage.updateUnit(req.params.id, req.body);
            res.json({ unit });
        } catch (error) {
            res.status(500).json({ error: 'Daire güncellenemedi' });
        }
    });

    router.delete('/units/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteUnit(req.params.id);
            res.json({ message: 'Daire silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Daire silinemedi' });
        }
    });

    // Residents
    router.post('/residents', requireAuth, async (req, res) => {
        try {
            const validatedData = insertResidentSchema.parse(req.body);
            const resident = await storage.createResident(validatedData);
            res.status(201).json({ resident });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Sakin oluşturulamadı' });
        }
    });

    router.patch('/residents/:id', requireAuth, async (req, res) => {
        try {
            const resident = await storage.updateResident(req.params.id, req.body);
            res.json({ resident });
        } catch (error) {
            res.status(500).json({ error: 'Sakin güncellenemedi' });
        }
    });

    router.delete('/residents/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteResident(req.params.id);
            res.json({ message: 'Sakin silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Sakin silinemedi' });
        }
    });

    // GET /api/buildings/:id
    router.get('/buildings/:id', requireAuth, async (req, res) => {
        try {
            const building = await storage.getBuildingById(req.params.id);
            if (!building) return res.status(404).json({ error: 'Blok bulunamadı' });
            res.json({ building });
        } catch (error) {
            res.status(500).json({ error: 'Blok yüklenirken hata oluştu' });
        }
    });

    // GET /api/units/:id
    router.get('/units/:id', requireAuth, async (req, res) => {
        try {
            const unit = await storage.getUnitById(req.params.id);
            if (!unit) return res.status(404).json({ error: 'Daire bulunamadı' });
            res.json({ unit });
        } catch (error) {
            res.status(500).json({ error: 'Daire yüklenirken hata oluştu' });
        }
    });

    // GET /api/residents/:id
    router.get('/residents/:id', requireAuth, async (req, res) => {
        try {
            const resident = await storage.getResidentById(req.params.id);
            if (!resident) return res.status(404).json({ error: 'Sakin bulunamadı' });
            res.json({ resident });
        } catch (error) {
            res.status(500).json({ error: 'Sakin yüklenirken hata oluştu' });
        }
    });

    // ==================== RESIDENTS & VEHICLES ====================

    // GET /api/residents/:id/vehicles
    router.get('/residents/:id/vehicles', requireAuth, async (req, res) => {
        try {
            const vehicles = await storage.getVehiclesByResidentId(req.params.id);
            res.json({ vehicles });
        } catch (error) {
            res.status(500).json({ error: 'Araçlar yüklenirken hata oluştu' });
        }
    });

    // POST /api/vehicles
    router.post('/vehicles', requireAuth, async (req, res) => {
        try {
            const validatedData = insertVehicleSchema.parse(req.body);
            const vehicle = await storage.createVehicle(validatedData);
            res.status(201).json({ vehicle });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Araç eklenirken hata oluştu' });
        }
    });

    // POST /api/parking-spots
    router.post('/parking-spots', requireAuth, async (req, res) => {
        try {
            const validatedData = insertParkingSpotSchema.parse(req.body);
            const spot = await storage.createParkingSpot(validatedData);
            res.status(201).json({ spot });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Park yeri eklenirken hata oluştu' });
        }
    });

    router.patch('/parking-spots/:id', requireAuth, async (req, res) => {
        try {
            const spot = await storage.updateParkingSpot(req.params.id, req.body);
            res.json({ spot });
        } catch (error) {
            res.status(500).json({ error: 'Park yeri güncellenemedi' });
        }
    });

    router.delete('/parking-spots/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteParkingSpot(req.params.id);
            res.json({ message: 'Park yeri silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Park yeri silinemedi' });
        }
    });

    // DELETE /api/vehicles/:id
    router.patch('/vehicles/:id', requireAuth, async (req, res) => {
        try {
            const vehicle = await storage.updateVehicle(req.params.id, req.body);
            res.json({ vehicle });
        } catch (error) {
            res.status(500).json({ error: 'Araç güncellenemedi' });
        }
    });

    router.delete('/vehicles/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteVehicle(req.params.id);
            res.json({ message: 'Araç silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Araç silinemedi' });
        }
    });

    // GET /api/buildings/:id/parking-spots
    router.get('/buildings/:id/parking-spots', requireAuth, async (req, res) => {
        try {
            const spots = await storage.getParkingSpotsByBuildingId(req.params.id);
            res.json({ spots });
        } catch (error) {
            res.status(500).json({ error: 'Park yerleri yüklenirken hata oluştu' });
        }
    });

    // GET /api/units/:id/guest-visits
    router.get('/units/:id/guest-visits', requireAuth, async (req, res) => {
        try {
            const visits = await storage.getGuestVisitsByUnitId(req.params.id);
            res.json({ visits });
        } catch (error) {
            res.status(500).json({ error: 'Ziyaretler yüklenirken hata oluştu' });
        }
    });

    router.post('/guest-visits', requireAuth, async (req, res) => {
        try {
            const validatedData = insertGuestVisitSchema.parse(req.body);
            const visit = await storage.createGuestVisit(validatedData);
            res.status(201).json({ visit });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Ziyaret kaydı oluşturulamadı' });
        }
    });

    router.patch('/guest-visits/:id/status', requireAuth, async (req, res) => {
        try {
            const { status } = req.body;
            const visit = await storage.updateGuestVisitStatus(req.params.id, status);
            res.json({ visit });
        } catch (error) {
            res.status(500).json({ error: 'Ziyaret durumu güncellenemedi' });
        }
    });

    router.delete('/guest-visits/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteGuestVisit(req.params.id);
            res.json({ message: 'Ziyaret kaydı silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Ziyaret kaydı silinemedi' });
        }
    });

    // GET /api/buildings/:id/units
    router.get('/buildings/:id/units', requireAuth, async (req, res) => {
        try {
            const units = await storage.getUnitsByBuildingId(req.params.id);
            res.json({ units });
        } catch (error) {
            res.status(500).json({ error: 'Daireler yüklenirken hata oluştu' });
        }
    });

    // GET /api/units/:id/residents
    router.get('/units/:id/residents', requireAuth, async (req, res) => {
        try {
            const residents = await storage.getResidentsByUnitId(req.params.id);
            res.json({ residents });
        } catch (error) {
            res.status(500).json({ error: 'Sakinler yüklenirken hata oluştu' });
        }
    });

    // ==================== PAYMENT ROUTES ====================

    // GET /api/payments?month=Ocak&year=2025
    router.get('/payments', requireAuth, async (req, res) => {
        try {
            const { month, year } = req.query;
            if (!month || !year) return res.status(400).json({ error: 'month ve year parametreleri gerekli' });
            const payments = await storage.getPaymentRecordsByPeriod(month as string, parseInt(year as string));
            res.json({ payments });
        } catch (error) {
            res.status(500).json({ error: 'Ödemeler yüklenirken hata oluştu' });
        }
    });

    // POST /api/payments
    router.post('/payments', requireAuth, async (req, res) => {
        try {
            const validatedData = insertPaymentRecordSchema.parse(req.body);
            const payment = await storage.createPaymentRecord(validatedData);
            res.status(201).json({ payment });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Ödeme oluşturulamadı' });
        }
    });

    router.patch('/payments/:id/status', requireAuth, async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!['paid', 'unpaid'].includes(status)) return res.status(400).json({ error: 'Geçersiz status değeri' });
            const payment = await storage.updatePaymentStatus(id, status);
            res.json({ payment });
        } catch (error) {
            res.status(500).json({ error: 'Ödeme durumu güncellenemedi' });
        }
    });

    router.delete('/payments/:id', requireAuth, async (req, res) => {
        try {
            await storage.deletePaymentRecord(req.params.id);
            res.json({ message: 'Ödeme kaydı silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Ödeme kaydı silinemedi' });
        }
    });

    router.get('/residents/:id/payments', requireAuth, async (req, res) => {
        try {
            const payments = await storage.getPaymentRecordsByResidentId(req.params.id);
            res.json({ payments });
        } catch (error) {
            res.status(500).json({ error: 'Sakin ödemeleri yüklenirken hata oluştu' });
        }
    });

    // ==================== EXPENSE ROUTES ====================

    router.get('/expenses', requireAuth, async (req, res) => {
        try {
            const { month, year } = req.query;
            if (!month || !year) return res.status(400).json({ error: 'month ve year parametreleri gerekli' });
            const expenses = await storage.getExpenseRecordsByPeriod(month as string, parseInt(year as string));
            res.json({ expenses });
        } catch (error) {
            res.status(500).json({ error: 'Giderler yüklenirken hata oluştu' });
        }
    });

    router.post('/expenses', requireAuth, async (req, res) => {
        try {
            const validatedData = insertExpenseRecordSchema.parse(req.body);
            const expense = await storage.createExpenseRecord(validatedData);
            res.status(201).json({ expense });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Gider oluşturulamadı' });
        }
    });

    router.patch('/expenses/:id', requireAuth, async (req, res) => {
        try {
            const expense = await storage.updateExpenseRecord(req.params.id, req.body);
            res.json({ expense });
        } catch (error) {
            res.status(500).json({ error: 'Gider kaydı güncellenemedi' });
        }
    });

    router.delete('/expenses/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteExpenseRecord(req.params.id);
            res.json({ message: 'Gider silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Gider silinemedi' });
        }
    });

    // ==================== FACILITIES & BOOKINGS ====================

    router.get('/facilities', requireAuth, async (req, res) => {
        try {
            const facilities = await storage.getAllFacilities();
            res.json({ facilities });
        } catch (error) {
            res.status(500).json({ error: 'Sosyal tesisler yüklenirken hata oluştu' });
        }
    });

    router.post('/facilities', requireAuth, async (req, res) => {
        try {
            const validatedData = insertFacilitySchema.parse(req.body);
            const facility = await storage.createFacility(validatedData);
            res.status(201).json({ facility });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Tesis oluşturulamadı' });
        }
    });

    router.patch('/facilities/:id', requireAuth, async (req, res) => {
        try {
            const facility = await storage.updateFacility(req.params.id, req.body);
            res.json({ facility });
        } catch (error) {
            res.status(500).json({ error: 'Tesis güncellenemedi' });
        }
    });

    router.delete('/facilities/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteFacility(req.params.id);
            res.json({ message: 'Tesis silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Tesis silinemedi' });
        }
    });

    router.get('/facilities/:id/bookings', requireAuth, async (req, res) => {
        try {
            const bookings = await storage.getBookingsByFacilityId(req.params.id);
            res.json({ bookings });
        } catch (error) {
            res.status(500).json({ error: 'Rezervasyonlar yüklenirken hata oluştu' });
        }
    });

    router.post('/bookings', requireAuth, async (req, res) => {
        try {
            const validatedData = insertBookingSchema.parse(req.body);
            const booking = await storage.createBooking(validatedData);
            res.status(201).json({ booking });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Rezervasyon oluşturulamadı' });
        }
    });

    router.patch('/bookings/:id/status', requireAuth, async (req, res) => {
        try {
            const { status, rejectionReason } = req.body;
            const booking = await storage.updateBookingStatus(req.params.id, status, rejectionReason);
            res.json({ booking });
        } catch (error) {
            res.status(500).json({ error: 'Rezervasyon durumu güncellenemedi' });
        }
    });

    router.delete('/bookings/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteBooking(req.params.id);
            res.json({ message: 'Rezervasyon silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Rezervasyon silinemedi' });
        }
    });

    // ==================== CARGO MANAGEMENT ====================

    router.get('/units/:id/cargo', requireAuth, async (req, res) => {
        try {
            const cargo = await storage.getCargoItemsByUnitId(req.params.id);
            res.json({ cargo });
        } catch (error) {
            res.status(500).json({ error: 'Kargolar yüklenirken hata oluştu' });
        }
    });

    router.post('/cargo', requireAuth, async (req, res) => {
        try {
            const validatedData = insertCargoItemSchema.parse(req.body);
            const cargo = await storage.createCargoItem(validatedData);
            res.status(201).json({ cargo });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Kargo kaydı oluşturulamadı' });
        }
    });

    router.patch('/cargo/:id/status', requireAuth, async (req, res) => {
        try {
            const { status, deliveredDate } = req.body;
            const cargo = await storage.updateCargoStatus(req.params.id, status, deliveredDate ? new Date(deliveredDate) : undefined);
            res.json({ cargo });
        } catch (error) {
            res.status(500).json({ error: 'Kargo durumu güncellenemedi' });
        }
    });

    router.delete('/cargo/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteCargoItem(req.params.id);
            res.json({ message: 'Kargo kaydı silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Kargo kaydı silinemedi' });
        }
    });

    router.get('/residents/:id/expected-cargo', requireAuth, async (req, res) => {
        try {
            const cargo = await storage.getExpectedCargoByResidentId(req.params.id);
            res.json({ cargo });
        } catch (error) {
            res.status(500).json({ error: 'Beklenen kargolar yüklenirken hata oluştu' });
        }
    });

    router.post('/expected-cargo', requireAuth, async (req, res) => {
        try {
            const validatedData = insertExpectedCargoSchema.parse(req.body);
            const cargo = await storage.createExpectedCargo(validatedData);
            res.status(201).json({ cargo });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Beklenen kargo kaydı oluşturulamadı' });
        }
    });

    router.delete('/expected-cargo/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteExpectedCargo(req.params.id);
            res.json({ message: 'Beklenen kargo kaydı silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Beklenen kargo kaydı silinemedi' });
        }
    });

    router.get('/units/:id/courier-visits', requireAuth, async (req, res) => {
        try {
            const visits = await storage.getCourierVisitsByUnitId(req.params.id);
            res.json({ visits });
        } catch (error) {
            res.status(500).json({ error: 'Kurye ziyaretleri yüklenirken hata oluştu' });
        }
    });

    router.post('/courier-visits', requireAuth, async (req, res) => {
        try {
            const validatedData = insertCourierVisitSchema.parse(req.body);
            const visit = await storage.createCourierVisit(validatedData);
            res.status(201).json({ visit });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Kurye ziyareti oluşturulamadı' });
        }
    });

    router.delete('/courier-visits/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteCourierVisit(req.params.id);
            res.json({ message: 'Kurye ziyareti silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Kurye ziyareti silinemedi' });
        }
    });

    // ==================== MAINTENANCE ====================

    router.get('/units/:id/maintenance', requireAuth, async (req, res) => {
        try {
            const requests = await storage.getMaintenanceRequestsByUnitId(req.params.id);
            res.json({ requests });
        } catch (error) {
            res.status(500).json({ error: 'Bakım talepleri yüklenirken hata oluştu' });
        }
    });

    router.post('/maintenance', requireAuth, async (req, res) => {
        try {
            const validatedData = insertMaintenanceRequestSchema.parse(req.body);
            const request = await storage.createMaintenanceRequest(validatedData);
            res.status(201).json({ request });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Bakım talebi oluşturulamadı' });
        }
    });

    router.patch('/maintenance/:id/status', requireAuth, async (req, res) => {
        try {
            const { status, completedDate } = req.body;
            const request = await storage.updateMaintenanceStatus(req.params.id, status, completedDate ? new Date(completedDate) : undefined);
            res.json({ request });
        } catch (error) {
            res.status(500).json({ error: 'Bakım talebi güncellenemedi' });
        }
    });

    router.delete('/maintenance/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteMaintenanceRequest(req.params.id);
            res.json({ message: 'Bakım talebi silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Bakım talebi silinemedi' });
        }
    });

    // ==================== ANNOUNCEMENTS ====================

    router.get('/announcements', requireAuth, async (req, res) => {
        try {
            const announcements = await storage.getAnnouncements();
            res.json({ announcements });
        } catch (error) {
            res.status(500).json({ error: 'Duyurular yüklenirken hata oluştu' });
        }
    });

    router.post('/announcements', requireAuth, async (req, res) => {
        try {
            const validatedData = insertAnnouncementSchema.parse(req.body);
            const announcement = await storage.createAnnouncement(validatedData);
            res.status(201).json({ announcement });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Duyuru oluşturulamadı' });
        }
    });

    router.patch('/announcements/:id', requireAuth, async (req, res) => {
        try {
            const announcement = await storage.updateAnnouncement(req.params.id, req.body);
            res.json({ announcement });
        } catch (error) {
            res.status(500).json({ error: 'Duyuru güncellenemedi' });
        }
    });

    router.delete('/announcements/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteAnnouncement(req.params.id);
            res.json({ message: 'Duyuru silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Duyuru silinemedi' });
        }
    });

    // ==================== JANITOR ====================

    router.get('/janitor-requests/unit/:id', requireAuth, async (req, res) => {
        try {
            const requests = await storage.getJanitorRequestsByUnitId(req.params.id);
            res.json({ requests });
        } catch (error) {
            res.status(500).json({ error: 'Kapıcı talepleri yüklenirken hata oluştu' });
        }
    });

    router.post('/janitor-requests', requireAuth, async (req, res) => {
        try {
            const validatedData = insertJanitorRequestSchema.parse(req.body);
            const request = await storage.createJanitorRequest(validatedData);
            res.status(201).json({ request });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Kapıcı talebi oluşturulamadı' });
        }
    });

    router.get('/janitors', requireAuth, async (req, res) => {
        try {
            const janitors = await storage.getAllJanitors();
            res.json({ janitors });
        } catch (error) {
            res.status(500).json({ error: 'Kapıcılar yüklenirken hata oluştu' });
        }
    });

    router.post('/janitors', requireAuth, async (req, res) => {
        try {
            const validatedData = insertJanitorSchema.parse(req.body);
            const janitor = await storage.createJanitor(validatedData);
            res.status(201).json({ janitor });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Kapıcı oluşturulamadı' });
        }
    });

    router.patch('/janitors/:id', requireAuth, async (req, res) => {
        try {
            const janitor = await storage.updateJanitor(req.params.id, req.body);
            res.json({ janitor });
        } catch (error) {
            res.status(500).json({ error: 'Kapıcı güncellenemedi' });
        }
    });

    router.patch('/janitor-requests/:id/status', requireAuth, async (req, res) => {
        try {
            const { status, completedAt } = req.body;
            const request = await storage.updateJanitorRequestStatus(req.params.id, status, completedAt ? new Date(completedAt) : undefined);
            res.json({ request });
        } catch (error) {
            res.status(500).json({ error: 'Talep durumu güncellenemedi' });
        }
    });

    router.delete('/janitor-requests/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteJanitorRequest(req.params.id);
            res.json({ message: 'Kapıcı talebi silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Kapıcı talebi silinemedi' });
        }
    });

    router.post('/janitors/assignments', requireAuth, async (req, res) => {
        try {
            const { janitorId, buildingId } = req.body;
            await storage.assignJanitorToBuilding(janitorId, buildingId);
            res.status(201).json({ message: 'Görevlendirme yapıldı' });
        } catch (error) {
            res.status(500).json({ error: 'Görevlendirme yapılamadı' });
        }
    });

    router.delete('/janitors/assignments', requireAuth, async (req, res) => {
        try {
            const { janitorId, buildingId } = req.body;
            await storage.unassignJanitorFromBuilding(janitorId, buildingId);
            res.json({ message: 'Görevlendirme kaldırıldı' });
        } catch (error) {
            res.status(500).json({ error: 'Görevlendirme kaldırılamadı' });
        }
    });

    router.delete('/janitors/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteJanitor(req.params.id);
            res.json({ message: 'Kapıcı silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Kapıcı silinemedi' });
        }
    });

    router.get('/buildings/:id/janitors', requireAuth, async (req, res) => {
        try {
            const janitors = await storage.getJanitorsByBuildingId(req.params.id);
            res.json({ janitors });
        } catch (error) {
            res.status(500).json({ error: 'Kapıcılar yüklenirken hata oluştu' });
        }
    });

    // ==================== COMMUNITY & POLLS ====================

    router.get('/polls', requireAuth, async (req, res) => {
        try {
            const polls = await storage.getPolls();
            res.json({ polls });
        } catch (error) {
            res.status(500).json({ error: 'Anketler yüklenirken hata oluştu' });
        }
    });

    router.post('/polls', requireAuth, async (req, res) => {
        try {
            const validatedData = insertPollSchema.parse(req.body);
            const poll = await storage.createPoll(validatedData);
            res.status(201).json({ poll });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Anket oluşturulamadı' });
        }
    });

    router.patch('/polls/:id/status', requireAuth, async (req, res) => {
        try {
            const { status } = req.body;
            const poll = await storage.updatePollStatus(req.params.id, status);
            res.json({ poll });
        } catch (error) {
            res.status(500).json({ error: 'Anket durumu güncellenemedi' });
        }
    });

    router.post('/polls/:id/vote', requireAuth, async (req, res) => {
        try {
            const { residentId } = req.body;
            const hasVoted = await storage.hasResidentVotedInPoll(residentId, req.params.id);
            if (hasVoted) return res.status(400).json({ error: 'Zaten oy kullandınız' });

            const validatedData = insertPollVoteSchema.parse({ ...req.body, pollId: req.params.id });
            const vote = await storage.createPollVote(validatedData);
            res.status(201).json({ vote });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Oy kullanılamadı' });
        }
    });

    router.delete('/polls/:id', requireAuth, async (req, res) => {
        try {
            await storage.deletePoll(req.params.id);
            res.json({ message: 'Anket silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Anket silinemedi' });
        }
    });

    router.get('/community-requests', requireAuth, async (req, res) => {
        try {
            const requests = await storage.getCommunityRequests();
            res.json({ requests });
        } catch (error) {
            res.status(500).json({ error: 'Talepler yüklenirken hata oluştu' });
        }
    });

    router.post('/community-requests', requireAuth, async (req, res) => {
        try {
            const validatedData = insertCommunityRequestSchema.parse(req.body);
            const request = await storage.createCommunityRequest(validatedData);
            res.status(201).json({ request });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Talep oluşturulamadı' });
        }
    });

    router.patch('/community-requests/:id/status', requireAuth, async (req, res) => {
        try {
            const { status } = req.body;
            const request = await storage.updateCommunityRequestStatus(req.params.id, status);
            res.json({ request });
        } catch (error) {
            res.status(500).json({ error: 'Talep durumu güncellenemedi' });
        }
    });

    router.delete('/community-requests/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteCommunityRequest(req.params.id);
            res.json({ message: 'Talep silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Talep silinemedi' });
        }
    });

    // ==================== TRANSACTIONS ====================

    router.get('/transactions', requireAuth, async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const end = endDate ? new Date(endDate as string) : new Date();
            const transactions = await storage.getTransactionsByPeriod(start, end);
            res.json({ transactions });
        } catch (error) {
            res.status(500).json({ error: 'İşlemler yüklenirken hata oluştu' });
        }
    });

    router.post('/transactions', requireAuth, async (req, res) => {
        try {
            const validatedData = insertTransactionSchema.parse(req.body);
            const transaction = await storage.createTransaction(validatedData);
            res.status(201).json({ transaction });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'İşlem kaydı oluşturulamadı' });
        }
    });

    router.patch('/transactions/:id', requireAuth, async (req, res) => {
        try {
            const tx = await storage.updateTransaction(req.params.id, req.body);
            res.json({ transaction: tx });
        } catch (error) {
            res.status(500).json({ error: 'İşlem güncellenemedi' });
        }
    });

    router.delete('/transactions/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteTransaction(req.params.id);
            res.json({ message: 'İşlem silindi' });
        } catch (error) {
            res.status(500).json({ error: 'İşlem silinemedi' });
        }
    });

    // ==================== BUILDINGS ROUTES ====================

    router.get('/buildings', requireAuth, async (req, res) => {
        try {
            const buildings = await storage.getAllBuildings();
            res.json({ buildings });
        } catch (error) {
            res.status(500).json({ error: 'Bloklar yüklenirken hata oluştu' });
        }
    });

    return router;
}
