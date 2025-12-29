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

    // GET /api/dashboard/recent-data
    router.get('/dashboard/recent-data', requireAuth, async (req, res) => {
        try {
            const [payments, maintenance, bookings] = await Promise.all([
                storage.getRecentPayments(5),
                storage.getRecentMaintenanceRequests(4),
                storage.getTodayBookings()
            ]);
            
            res.json({ payments, maintenance, bookings });
        } catch (error) {
            res.status(500).json({ error: 'Dashboard verileri yüklenirken hata oluştu' });
        }
    });

    // GET /api/dashboard/monthly-income?year=2025
    router.get('/dashboard/monthly-income', requireAuth, async (req, res) => {
        try {
            const year = parseInt(req.query.year as string) || new Date().getFullYear();
            const data = await storage.getMonthlyIncome(year);
            res.json({ data });
        } catch (error) {
            res.status(500).json({ error: 'Aylık gelir verileri yüklenirken hata oluştu' });
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
            // Check if it's a duplicate unit error
            if (error.message && error.message.includes('zaten mevcut')) {
                return res.status(409).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Daire oluşturulamadı' });
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

    // GET /api/buildings/:id/full-data (Residents Page için tüm nested data)
    router.get('/buildings/:id/full-data', requireAuth, async (req, res) => {
        try {
            const data = await storage.getBuildingFullData(req.params.id);
            res.json(data);
        } catch (error: any) {
            console.error('Building full data error:', error);
            res.status(500).json({ error: error.message || 'Building data yüklenirken hata oluştu' });
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
    // GET /api/residents/building-data/:buildingId (Residents Page için)
    router.get('/residents/building-data/:buildingId', requireAuth, async (req, res) => {
        try {
            const data = await storage.getBuildingFullData(req.params.buildingId);
            res.json(data);
        } catch (error: any) {
            console.error('Building full data error:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({ 
                error: error.message || 'Building data yüklenirken hata oluştu',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    });

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
            // Partial validation - sadece gönderilen field'ları validate et
            const validatedData = insertVehicleSchema.partial().parse(req.body);
            const vehicle = await storage.updateVehicle(req.params.id, validatedData);
            res.json({ vehicle });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
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

    router.patch('/guest-visits/:id', requireAuth, async (req, res) => {
        try {
            const validatedData = insertGuestVisitSchema.partial().parse(req.body);
            const visit = await storage.updateGuestVisit(req.params.id, validatedData);
            res.json({ visit });
        } catch (error: any) {
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Ziyaret kaydı güncellenemedi' });
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
            const { month, year, page = '1', limit = '20', search, status, siteId, buildingId } = req.query;
            
            console.log('Payment fetch request:', { month, year, page, limit, search, status, siteId, buildingId });
            
            // Validation
            if (!month || !year) {
                return res.status(400).json({ error: 'month ve year parametreleri gerekli' });
            }

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);

            // Validate pagination
            if (isNaN(pageNum) || pageNum < 1) {
                return res.status(400).json({ error: 'Geçersiz sayfa numarası' });
            }
            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
                return res.status(400).json({ error: 'Geçersiz limit değeri (1-100)' });
            }

            // Validate search (minimum 3 characters)
            if (search && typeof search === 'string' && search.trim().length > 0 && search.trim().length < 3) {
                return res.status(400).json({ error: 'Arama terimi en az 3 karakter olmalıdır' });
            }

            // Validate status
            if (status && !['paid', 'unpaid'].includes(status as string)) {
                return res.status(400).json({ error: 'Geçersiz status değeri' });
            }

            // Validate siteId and buildingId - buildingId takes precedence
            if (buildingId && siteId) {
                return res.status(400).json({ error: 'buildingId ve siteId birlikte kullanılamaz. buildingId seçildiğinde siteId kullanılmamalıdır' });
            }

            const filters: { search?: string; status?: 'paid' | 'unpaid'; siteId?: string; buildingId?: string } = {};
            if (search && typeof search === 'string' && search.trim().length >= 3) {
                filters.search = search.trim();
            }
            if (status) {
                filters.status = status as 'paid' | 'unpaid';
            }
            if (buildingId && typeof buildingId === 'string') {
                filters.buildingId = buildingId;
            } else if (siteId && typeof siteId === 'string') {
                filters.siteId = siteId;
            }

            const result = await storage.getPaymentRecordsPaginated(
                month as string,
                parseInt(year as string),
                pageNum,
                limitNum,
                filters
            );

            console.log('Payment fetch result:', { 
                paymentCount: result.payments.length, 
                total: result.total,
                stats: result.stats 
            });

            res.json(result);
        } catch (error: any) {
            console.error('Payment fetch error:', error);
            res.status(500).json({ 
                error: 'Ödemeler yüklenirken hata oluştu',
                message: error.message 
            });
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
            const { status, paymentDate } = req.body;
            
            // Validation
            if (!['paid', 'unpaid'].includes(status)) {
                return res.status(400).json({ error: 'Geçersiz status değeri' });
            }

            // UUID validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({ error: 'Geçersiz ödeme ID' });
            }

            const payment = await storage.updatePaymentStatus(
                id,
                status,
                paymentDate ? new Date(paymentDate) : undefined
            );

            if (!payment) {
                return res.status(404).json({ error: 'Ödeme kaydı bulunamadı' });
            }

            res.json({ payment });
        } catch (error) {
            console.error('Payment status update error:', error);
            res.status(500).json({ error: 'Ödeme durumu güncellenemedi' });
        }
    });

    // PATCH /api/payments/bulk-amount - Update amount for all payments in a period
    router.patch('/payments/bulk-amount', requireAuth, async (req, res) => {
        try {
            const { month, year, amount } = req.body;

            // Validation
            if (!month || !year || !amount) {
                return res.status(400).json({ error: 'month, year ve amount parametreleri gerekli' });
            }

            const yearNum = parseInt(year);
            const amountNum = parseFloat(amount);

            if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
                return res.status(400).json({ error: 'Geçersiz yıl değeri' });
            }

            if (isNaN(amountNum) || amountNum <= 0) {
                return res.status(400).json({ error: 'Geçersiz tutar değeri' });
            }

            const updatedCount = await storage.updatePaymentAmountByPeriod(
                month,
                yearNum,
                amount.toString()
            );

            res.json({ message: 'Aidat tutarları güncellendi', updatedCount });
        } catch (error) {
            console.error('Bulk amount update error:', error);
            res.status(500).json({ error: 'Aidat tutarları güncellenemedi' });
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
            const { month, year, page = '1', limit = '20', search, category, siteId, buildingId } = req.query;

            console.log('Expense fetch request:', { month, year, page, limit, search, category, siteId, buildingId });

            // Validation
            if (!month || !year) {
                return res.status(400).json({ error: 'month ve year parametreleri gerekli' });
            }

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);

            // Validate pagination
            if (isNaN(pageNum) || pageNum < 1) {
                return res.status(400).json({ error: 'Geçersiz sayfa numarası' });
            }
            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
                return res.status(400).json({ error: 'Geçersiz limit değeri (1-100)' });
            }

            // Validate search (minimum 3 characters)
            if (search && typeof search === 'string' && search.trim().length > 0 && search.trim().length < 3) {
                return res.status(400).json({ error: 'Arama terimi en az 3 karakter olmalıdır' });
            }

            // Validate category
            const validCategories = ['utilities', 'maintenance', 'personnel', 'general'];
            if (category && !validCategories.includes(category as string)) {
                return res.status(400).json({ error: 'Geçersiz kategori değeri' });
            }

            // Validate siteId and buildingId - buildingId takes precedence
            if (buildingId && siteId) {
                return res.status(400).json({ error: 'buildingId ve siteId birlikte kullanılamaz. buildingId seçildiğinde siteId kullanılmamalıdır' });
            }

            // Note: Expenses don't have direct siteId/buildingId relationship, but we accept the parameters for API consistency
            const filters: { search?: string; category?: string; siteId?: string; buildingId?: string } = {};
            if (search && typeof search === 'string' && search.trim().length >= 3) {
                filters.search = search.trim();
            }
            if (category) {
                filters.category = category as string;
            }
            if (buildingId && typeof buildingId === 'string') {
                filters.buildingId = buildingId;
            } else if (siteId && typeof siteId === 'string') {
                filters.siteId = siteId;
            }

            const result = await storage.getExpenseRecordsPaginated(
                month as string,
                parseInt(year as string),
                pageNum,
                limitNum,
                filters
            );

            console.log('Expense fetch result:', { 
                expenseCount: result.expenses.length, 
                total: result.total,
                stats: result.stats 
            });

            res.json(result);
        } catch (error: any) {
            console.error('Expense fetch error:', error);
            res.status(500).json({ 
                error: 'Giderler yüklenirken hata oluştu',
                message: error.message 
            });
        }
    });

    router.post('/expenses', requireAuth, async (req, res) => {
        try {
            console.log('Expense create request body:', req.body);
            
            // Zod validation
            const validatedData = insertExpenseRecordSchema.parse(req.body);
            
            console.log('Validated expense data:', validatedData);
            
            // Additional validation
            if (validatedData.amount && parseFloat(validatedData.amount as any) <= 0) {
                return res.status(400).json({ error: 'Tutar pozitif bir sayı olmalıdır' });
            }

            const expense = await storage.createExpenseRecord(validatedData);
            res.status(201).json({ expense });
        } catch (error: any) {
            console.error('Expense create error:', error);
            if (error.name === 'ZodError') {
                console.error('Zod validation errors:', JSON.stringify(error.errors, null, 2));
                return res.status(400).json({ 
                    error: 'Geçersiz veri', 
                    details: error.errors,
                    message: error.message 
                });
            }
            res.status(500).json({ 
                error: 'Gider oluşturulamadı',
                message: error.message 
            });
        }
    });

    router.patch('/expenses/:id', requireAuth, async (req, res) => {
        try {
            // UUID validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(req.params.id)) {
                return res.status(400).json({ error: 'Geçersiz gider ID' });
            }

            const expense = await storage.updateExpenseRecord(req.params.id, req.body);
            
            if (!expense) {
                return res.status(404).json({ error: 'Gider kaydı bulunamadı' });
            }

            res.json({ expense });
        } catch (error) {
            console.error('Expense update error:', error);
            res.status(500).json({ error: 'Gider kaydı güncellenemedi' });
        }
    });

    router.delete('/expenses/:id', requireAuth, async (req, res) => {
        try {
            // UUID validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(req.params.id)) {
                return res.status(400).json({ error: 'Geçersiz gider ID' });
            }

            await storage.deleteExpenseRecord(req.params.id);
            res.json({ message: 'Gider silindi' });
        } catch (error) {
            console.error('Expense delete error:', error);
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

    // GET /api/announcements/stats
    router.get('/announcements/stats', requireAuth, async (req, res) => {
        try {
            const userId = (req.user as any)?.id;
            const stats = await storage.getAnnouncementStats(userId);
            res.json(stats);
        } catch (error) {
            console.error('Announcement stats error:', error);
            res.status(500).json({ error: 'İstatistikler yüklenirken hata oluştu' });
        }
    });

    // GET /api/announcements?page=1&limit=10
    router.get('/announcements', requireAuth, async (req, res) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const userId = (req.user as any)?.id; // Get authenticated user ID
            
            if (!userId) {
                return res.status(401).json({ error: 'Kullanıcı bilgisi bulunamadı' });
            }
            
            // Filter announcements by user's authorized sites
            const result = await storage.getAnnouncementsPaginated(page, limit, userId);
            res.json(result);
        } catch (error: any) {
            console.error('Announcements fetch error:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({ 
                error: 'Duyurular yüklenirken hata oluştu',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    // GET /api/announcements/:id
    router.get('/announcements/:id', requireAuth, async (req, res) => {
        try {
            const announcement = await storage.getAnnouncementById(req.params.id);
            if (!announcement) {
                return res.status(404).json({ error: 'Duyuru bulunamadı' });
            }
            res.json({ announcement });
        } catch (error) {
            res.status(500).json({ error: 'Duyuru yüklenirken hata oluştu' });
        }
    });

    // POST /api/announcements
    router.post('/announcements', requireAuth, async (req, res) => {
        try {
            // Get authorId from authenticated user
            const authorId = (req.user as any)?.id;
            if (!authorId) {
                return res.status(401).json({ error: 'Kullanıcı bilgisi bulunamadı' });
            }

            // Get user to check role
            const user = await storage.getUserById(authorId);
            if (!user) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }

            // Validate that either buildingId OR siteId is provided (not both, not neither)
            const hasBuildingId = req.body.buildingId && req.body.buildingId !== "" && req.body.buildingId !== null;
            const hasSiteId = req.body.siteId && req.body.siteId !== "" && req.body.siteId !== null;

            if (!hasBuildingId && !hasSiteId) {
                return res.status(400).json({ error: 'Bina veya Site seçilmelidir' });
            }

            if (hasBuildingId && hasSiteId) {
                return res.status(400).json({ error: 'Hem bina hem site seçilemez. Ya bina ya da site seçilmelidir' });
            }

            // If buildingId is provided, verify user has access to that building's site
            if (hasBuildingId) {
                const building = await storage.getBuildingById(req.body.buildingId);
                if (!building) {
                    return res.status(400).json({ error: 'Geçersiz bina ID' });
                }

                // Admin can create announcements for any building
                if (user.role !== 'admin') {
                    // Check if user is assigned to the building's site
                    const userSiteAssignments = await storage.getUserSiteAssignments(authorId);
                    const hasAccess = userSiteAssignments.some(
                        assignment => assignment.siteId === building.siteId
                    );

                    if (!hasAccess) {
                        return res.status(403).json({ 
                            error: 'Bu bina için yetkiniz bulunmamaktadır' 
                        });
                    }
                }
            }

            // If siteId is provided, verify user has access to that site
            if (hasSiteId) {
                const site = await storage.getSiteById(req.body.siteId);
                if (!site) {
                    return res.status(400).json({ error: 'Geçersiz site ID' });
                }

                // Admin can create announcements for any site
                if (user.role !== 'admin') {
                    // Check if user is assigned to the site
                    const userSiteAssignments = await storage.getUserSiteAssignments(authorId);
                    const hasAccess = userSiteAssignments.some(
                        assignment => assignment.siteId === req.body.siteId
                    );

                    if (!hasAccess) {
                        return res.status(403).json({ 
                            error: 'Bu site için yetkiniz bulunmamaktadır' 
                        });
                    }
                }
            }
            
            // Convert publishDate string to Date if provided
            const publishDate = req.body.publishDate ? new Date(req.body.publishDate) : null;
            
            // Handle buildingId and siteId: empty string or undefined should be null
            const buildingId = hasBuildingId ? req.body.buildingId : null;
            const siteId = hasSiteId ? req.body.siteId : null;
            
            // Debug: Log the values before validation
            console.log('[POST /announcements] Before validation - buildingId:', buildingId, 'siteId:', siteId);
            console.log('[POST /announcements] req.body:', JSON.stringify(req.body, null, 2));
            
            // Prepare data for validation
            // Convert null values to undefined for validation (schema expects undefined for optional fields)
            const dataToValidate = {
                ...req.body,
                authorId,
                publishDate,
                buildingId: buildingId || undefined, // Use undefined instead of null for validation
                siteId: siteId || undefined, // Use undefined instead of null for validation
            };
            
            console.log('[POST /announcements] dataToValidate:', JSON.stringify(dataToValidate, null, 2));
            
            // Parse with schema
            const validatedData = insertAnnouncementSchema.parse(dataToValidate);
            
            console.log('[POST /announcements] validatedData:', JSON.stringify(validatedData, null, 2));
            
            // Ensure buildingId and siteId are explicitly null (not undefined) for database insert
            // IMPORTANT: Use the original buildingId and siteId values from req.body, not from validatedData
            // because validatedData might have undefined for optional fields
            const finalData = {
                ...validatedData,
                buildingId: buildingId ?? null, // Use nullish coalescing to preserve null
                siteId: siteId ?? null, // Use nullish coalescing to preserve null
            };
            
            // Debug log
            console.log('[POST /announcements] finalData:', JSON.stringify(finalData, null, 2));
            
            const announcement = await storage.createAnnouncement(finalData);
            res.status(201).json({ announcement });
        } catch (error: any) {
            console.error('Announcement creation error:', error);
            console.error('Error stack:', error.stack);
            if (error.name === 'ZodError') {
                console.error('Zod validation errors:', JSON.stringify(error.errors, null, 2));
                console.error('Data that failed validation:', JSON.stringify(dataToValidate, null, 2));
                return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            }
            res.status(500).json({ 
                error: 'Duyuru oluşturulamadı', 
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    });

    // PATCH /api/announcements/:id
    router.patch('/announcements/:id', requireAuth, async (req, res) => {
        try {
            // Get user to check role
            const authorId = (req.user as any)?.id;
            if (!authorId) {
                return res.status(401).json({ error: 'Kullanıcı bilgisi bulunamadı' });
            }

            const user = await storage.getUserById(authorId);
            if (!user) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }

            // Convert publishDate string to Date if provided
            const updateData = { ...req.body };
            if (updateData.publishDate) {
                updateData.publishDate = new Date(updateData.publishDate);
            }
            
            // Handle buildingId and siteId: empty string or undefined should be null
            const hasBuildingId = updateData.buildingId !== undefined;
            const hasSiteId = updateData.siteId !== undefined;

            if (hasBuildingId) {
                updateData.buildingId = updateData.buildingId && updateData.buildingId !== "" 
                    ? updateData.buildingId 
                    : null;
            }

            if (hasSiteId) {
                updateData.siteId = updateData.siteId && updateData.siteId !== "" 
                    ? updateData.siteId 
                    : null;
            }

            // Validate that either buildingId OR siteId is set (not both)
            const finalBuildingId = hasBuildingId ? updateData.buildingId : undefined;
            const finalSiteId = hasSiteId ? updateData.siteId : undefined;

            if (finalBuildingId !== undefined && finalSiteId !== undefined && finalBuildingId !== null && finalSiteId !== null) {
                return res.status(400).json({ error: 'Hem bina hem site seçilemez. Ya bina ya da site seçilmelidir' });
            }

            // If buildingId is being set, verify user has access
            if (finalBuildingId !== undefined && finalBuildingId !== null) {
                const building = await storage.getBuildingById(finalBuildingId);
                if (!building) {
                    return res.status(400).json({ error: 'Geçersiz bina ID' });
                }

                if (user.role !== 'admin') {
                    const userSiteAssignments = await storage.getUserSiteAssignments(authorId);
                    const hasAccess = userSiteAssignments.some(
                        assignment => assignment.siteId === building.siteId
                    );

                    if (!hasAccess) {
                        return res.status(403).json({ 
                            error: 'Bu bina için yetkiniz bulunmamaktadır' 
                        });
                    }
                }
            }

            // If siteId is being set, verify user has access
            if (finalSiteId !== undefined && finalSiteId !== null) {
                const site = await storage.getSiteById(finalSiteId);
                if (!site) {
                    return res.status(400).json({ error: 'Geçersiz site ID' });
                }

                if (user.role !== 'admin') {
                    const userSiteAssignments = await storage.getUserSiteAssignments(authorId);
                    const hasAccess = userSiteAssignments.some(
                        assignment => assignment.siteId === finalSiteId
                    );

                    if (!hasAccess) {
                        return res.status(403).json({ 
                            error: 'Bu site için yetkiniz bulunmamaktadır' 
                        });
                    }
                }
            }
            
            const announcement = await storage.updateAnnouncement(req.params.id, updateData);
            res.json({ announcement });
        } catch (error) {
            console.error('Announcement update error:', error);
            res.status(500).json({ error: 'Duyuru güncellenemedi' });
        }
    });

    // DELETE /api/announcements/:id
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

    // GET /api/community/stats
    router.get('/community/stats', requireAuth, async (req, res) => {
        try {
            const stats = await storage.getCommunityStats();
            res.json(stats);
        } catch (error) {
            console.error('Community stats error:', error);
            res.status(500).json({ error: 'İstatistikler yüklenirken hata oluştu' });
        }
    });

    // GET /api/community/requests?page=1&limit=10
    router.get('/community/requests', requireAuth, async (req, res) => {
        try {
            // Import validation utilities
            const { sanitizeSearchQuery, validateEnum, validatePagination } = await import('./utils/validation.js');
            
            // Validate pagination
            const rawPage = parseInt(req.query.page as string) || 1;
            const rawLimit = parseInt(req.query.limit as string) || 1000;
            const { page, limit } = validatePagination(rawPage, rawLimit);
            
            // Sanitize search query
            const search = sanitizeSearchQuery(req.query.search as string | undefined);
            
            // Validate enum values
            const status = validateEnum(req.query.status as string | undefined, ['pending', 'in-progress', 'resolved', 'rejected']);
            const type = validateEnum(req.query.type as string | undefined, ['wish', 'suggestion']);
            
            // Get userId from authenticated user
            const userId = (req.user as any)?.id;
            
            const result = await storage.getCommunityRequestsPaginated(page, limit, { search, status, type }, userId);
            res.json(result);
        } catch (error) {
            console.error('Community requests error:', error);
            res.status(500).json({ error: 'Talepler yüklenirken hata oluştu' });
        }
    });

    // POST /api/community/requests
    router.post('/community/requests', requireAuth, async (req, res) => {
        try {
            // Get authorId from authenticated user
            const authorId = (req.user as any)?.id;
            if (!authorId) {
                return res.status(401).json({ error: 'Kullanıcı bilgisi bulunamadı' });
            }

            // Get user info for role check
            const user = await storage.getUserById(authorId);
            if (!user) {
                return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
            }
            
            // Get resident to get unitId
            // Note: Admin/staff users are not residents, so we need to handle that case
            let unitId: string | null = null;
            const resident = await storage.getResidentById(authorId);
            
            if (resident) {
                // User is a resident, use their unitId
                unitId = resident.unitId;
            } else {
                // User is admin/staff (not a resident)
                // We'll get unitId from the selected building or site later
                // For now, leave it null - we'll set it after validating buildingId/siteId
            }

            // Validate siteId and buildingId
            const hasBuildingId = req.body.buildingId && req.body.buildingId !== "";
            const hasSiteId = req.body.siteId && req.body.siteId !== "";

            if (hasBuildingId && hasSiteId) {
                return res.status(400).json({ error: 'Talep hem bina hem de site ID\'si ile oluşturulamaz. Lütfen sadece birini seçin.' });
            }

            if (!hasBuildingId && !hasSiteId) {
                return res.status(400).json({ error: 'Talep için site ID veya bina ID\'si gereklidir.' });
            }

            // If buildingId is provided, verify user has access to that building's site
            let selectedBuildingId: string | null = null;
            if (hasBuildingId) {
                const building = await storage.getBuildingById(req.body.buildingId);
                if (!building) {
                    return res.status(400).json({ error: 'Geçersiz bina ID' });
                }

                selectedBuildingId = building.id;

                // Admin can create requests for any building
                if (user.role !== 'admin') {
                    // Check if user is assigned to the building's site
                    const userSiteAssignments = await storage.getUserSiteAssignments(authorId);
                    const hasAccess = userSiteAssignments.some(
                        assignment => assignment.siteId === building.siteId
                    );

                    if (!hasAccess) {
                        return res.status(403).json({ 
                            error: 'Bu bina için yetkiniz bulunmamaktadır' 
                        });
                    }
                }
            }

            // If siteId is provided, verify user has access to that site
            let selectedSiteId: string | null = null;
            if (hasSiteId) {
                const site = await storage.getSiteById(req.body.siteId);
                if (!site) {
                    return res.status(400).json({ error: 'Geçersiz site ID' });
                }

                selectedSiteId = site.id;

                // Admin can create requests for any site
                if (user.role !== 'admin') {
                    // Check if user is assigned to the site
                    const userSiteAssignments = await storage.getUserSiteAssignments(authorId);
                    const hasAccess = userSiteAssignments.some(
                        assignment => assignment.siteId === req.body.siteId
                    );

                    if (!hasAccess) {
                        return res.status(403).json({ 
                            error: 'Bu site için yetkiniz bulunmamaktadır' 
                        });
                    }
                }
            }
            
            // If user is not a resident (admin/staff), we need to get a unitId from the building/site
            if (!resident && !unitId) {
                if (selectedBuildingId) {
                    // Get first unit from the selected building
                    const units = await storage.getUnitsByBuildingId(selectedBuildingId);
                    if (units.length === 0) {
                        return res.status(400).json({ 
                            error: 'Seçilen binada daire bulunamadı. Lütfen başka bir bina seçin.' 
                        });
                    }
                    unitId = units[0].id;
                } else if (selectedSiteId) {
                    // Get first building from the site, then first unit from that building
                    const buildings = await storage.getBuildingsBySiteId(selectedSiteId);
                    if (buildings.length === 0) {
                        return res.status(400).json({ 
                            error: 'Seçilen sitede bina bulunamadı.' 
                        });
                    }
                    const units = await storage.getUnitsByBuildingId(buildings[0].id);
                    if (units.length === 0) {
                        return res.status(400).json({ 
                            error: 'Seçilen sitede daire bulunamadı.' 
                        });
                    }
                    unitId = units[0].id;
                }
            }
            
            // Final check: unitId must be set
            if (!unitId) {
                return res.status(400).json({ 
                    error: 'Daire bilgisi belirlenemedi. Lütfen tekrar deneyin.' 
                });
            }
            
            const buildingId = hasBuildingId ? req.body.buildingId : null;
            const siteId = hasSiteId ? req.body.siteId : null;

            const validatedData = insertCommunityRequestSchema.parse({
                ...req.body,
                authorId,
                unitId,
                buildingId: buildingId || undefined,
                siteId: siteId || undefined,
            });

            const finalData = {
                ...validatedData,
                buildingId: buildingId ?? null,
                siteId: siteId ?? null,
            };

            const request = await storage.createCommunityRequest(finalData);
            res.status(201).json({ request });
        } catch (error: any) {
            console.error('Community request creation error:', error);
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Talep oluşturulamadı' });
        }
    });

    // PATCH /api/community/requests/:id/type
    router.patch('/community/requests/:id/type', requireAuth, async (req, res) => {
        try {
            const { type } = req.body;
            const request = await storage.updateCommunityRequestType(req.params.id, type);
            res.json({ request });
        } catch (error) {
            res.status(500).json({ error: 'Talep tipi güncellenemedi' });
        }
    });

    // PATCH /api/community/requests/:id/status
    router.patch('/community/requests/:id/status', requireAuth, async (req, res) => {
        try {
            const { status } = req.body;
            const request = await storage.updateCommunityRequestStatus(req.params.id, status);
            res.json({ request });
        } catch (error) {
            res.status(500).json({ error: 'Talep durumu güncellenemedi' });
        }
    });

    // DELETE /api/community/requests/:id
    router.delete('/community/requests/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteCommunityRequest(req.params.id);
            res.json({ message: 'Talep silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Talep silinemedi' });
        }
    });

    // GET /api/community/polls?page=1&limit=10
    router.get('/community/polls', requireAuth, async (req, res) => {
        try {
            // Import validation utilities
            const { sanitizeSearchQuery, validateEnum, validatePagination } = await import('./utils/validation.js');
            
            // Validate pagination
            const rawPage = parseInt(req.query.page as string) || 1;
            const rawLimit = parseInt(req.query.limit as string) || 1000;
            const { page, limit } = validatePagination(rawPage, rawLimit);
            
            // Sanitize search query
            const search = sanitizeSearchQuery(req.query.search as string | undefined);
            
            // Validate enum values
            const status = validateEnum(req.query.status as string | undefined, ['active', 'closed']);
            
            // Get userId from authenticated user
            const userId = (req.user as any)?.id;
            
            const result = await storage.getPollsPaginated(page, limit, { search, status }, userId);
            res.json(result);
        } catch (error) {
            console.error('Community polls error:', error);
            res.status(500).json({ error: 'Anketler yüklenirken hata oluştu' });
        }
    });

    // POST /api/community/polls
    router.post('/community/polls', requireAuth, async (req, res) => {
        try {
            // Get authorId from authenticated user
            const authorId = (req.user as any)?.id;
            if (!authorId) {
                return res.status(401).json({ error: 'Kullanıcı bilgisi bulunamadı' });
            }

            // Get user info for role check
            const user = await storage.getUserById(authorId);
            if (!user) {
                return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
            }

            // Validate siteId and buildingId
            const hasBuildingId = req.body.buildingId && req.body.buildingId !== "";
            const hasSiteId = req.body.siteId && req.body.siteId !== "";

            if (hasBuildingId && hasSiteId) {
                return res.status(400).json({ error: 'Anket hem bina hem de site ID\'si ile oluşturulamaz. Lütfen sadece birini seçin.' });
            }

            if (!hasBuildingId && !hasSiteId) {
                return res.status(400).json({ error: 'Anket için site ID veya bina ID\'si gereklidir.' });
            }

            // If buildingId is provided, verify user has access to that building's site
            if (hasBuildingId) {
                const building = await storage.getBuildingById(req.body.buildingId);
                if (!building) {
                    return res.status(400).json({ error: 'Geçersiz bina ID' });
                }

                // Admin can create polls for any building
                if (user.role !== 'admin') {
                    // Check if user is assigned to the building's site
                    const userSiteAssignments = await storage.getUserSiteAssignments(authorId);
                    const hasAccess = userSiteAssignments.some(
                        assignment => assignment.siteId === building.siteId
                    );

                    if (!hasAccess) {
                        return res.status(403).json({ 
                            error: 'Bu bina için yetkiniz bulunmamaktadır' 
                        });
                    }
                }
            }

            // If siteId is provided, verify user has access to that site
            if (hasSiteId) {
                const site = await storage.getSiteById(req.body.siteId);
                if (!site) {
                    return res.status(400).json({ error: 'Geçersiz site ID' });
                }

                // Admin can create polls for any site
                if (user.role !== 'admin') {
                    // Check if user is assigned to the site
                    const userSiteAssignments = await storage.getUserSiteAssignments(authorId);
                    const hasAccess = userSiteAssignments.some(
                        assignment => assignment.siteId === req.body.siteId
                    );

                    if (!hasAccess) {
                        return res.status(403).json({ 
                            error: 'Bu site için yetkiniz bulunmamaktadır' 
                        });
                    }
                }
            }
            
            // Convert date strings to timestamps
            const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
            const endDate = req.body.endDate ? new Date(req.body.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            
            const buildingId = hasBuildingId ? req.body.buildingId : null;
            const siteId = hasSiteId ? req.body.siteId : null;

            const validatedData = insertPollSchema.parse({
                ...req.body,
                authorId,
                startDate,
                endDate,
                buildingId: buildingId || undefined,
                siteId: siteId || undefined,
            });

            const finalData = {
                ...validatedData,
                buildingId: buildingId ?? null,
                siteId: siteId ?? null,
            };

            const poll = await storage.createPoll(finalData);
            res.status(201).json({ poll });
        } catch (error: any) {
            console.error('Poll creation error:', error);
            console.error('Poll creation error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code,
                body: req.body
            });
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Anket oluşturulamadı', details: error.message });
        }
    });

    // POST /api/community/polls
    router.post('/community/polls', requireAuth, async (req, res) => {
        try {
            // Get authorId from authenticated user
            const authorId = (req.user as any)?.id;
            if (!authorId) {
                return res.status(401).json({ error: 'Kullanıcı bilgisi bulunamadı' });
            }
            
            // Convert date strings to timestamps
            const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
            const endDate = req.body.endDate ? new Date(req.body.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            
            const validatedData = insertPollSchema.parse({
                ...req.body,
                authorId,
                startDate,
                endDate,
            });
            const poll = await storage.createPoll(validatedData);
            res.status(201).json({ poll });
        } catch (error: any) {
            console.error('Poll creation error:', error);
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Anket oluşturulamadı' });
        }
    });

    // PATCH /api/community/polls/:id/status
    router.patch('/community/polls/:id/status', requireAuth, async (req, res) => {
        try {
            const { status } = req.body;
            const poll = await storage.updatePollStatus(req.params.id, status);
            res.json({ poll });
        } catch (error) {
            res.status(500).json({ error: 'Anket durumu güncellenemedi' });
        }
    });

    // DELETE /api/community/polls/:id
    router.delete('/community/polls/:id', requireAuth, async (req, res) => {
        try {
            await storage.deletePoll(req.params.id);
            res.json({ message: 'Anket silindi' });
        } catch (error) {
            res.status(500).json({ error: 'Anket silinemedi' });
        }
    });

    // POST /api/community/polls/:id/vote
    router.post('/community/polls/:id/vote', requireAuth, async (req, res) => {
        try {
            const { residentId, choice } = req.body;
            const hasVoted = await storage.hasResidentVotedInPoll(residentId, req.params.id);
            if (hasVoted) return res.status(400).json({ error: 'Zaten oy kullandınız' });

            const validatedData = insertPollVoteSchema.parse({ 
                pollId: req.params.id,
                residentId,
                choice,
            });
            const vote = await storage.createPollVote(validatedData);
            res.status(201).json({ vote });
        } catch (error: any) {
            console.error('Vote creation error:', error);
            if (error.name === 'ZodError') return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            res.status(500).json({ error: 'Oy kullanılamadı' });
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

    // ==================== SITES ROUTES ====================

    // GET /api/sites - Kullanıcının erişebileceği siteler
    router.get('/sites', requireAuth, async (req, res) => {
        try {
            const userId = (req.user as any)?.id;
            
            if (!userId) {
                return res.status(401).json({ error: 'Kullanıcı bilgisi bulunamadı' });
            }

            const user = await storage.getUserById(userId);
            
            if (!user) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }

            // Admin tüm siteleri görebilir
            if (user.role === 'admin') {
                const sites = await storage.getAllSites();
                return res.json({ sites });
            }

            // Diğer kullanıcılar sadece atandıkları siteleri görebilir
            const sites = await storage.getSitesByUserId(userId);
            res.json({ sites });
        } catch (error) {
            console.error('Sites fetch error:', error);
            res.status(500).json({ error: 'Siteler yüklenirken hata oluştu' });
        }
    });

    // GET /api/sites/:id - Belirli bir site detayı
    router.get('/sites/:id', requireAuth, async (req, res) => {
        try {
            const site = await storage.getSiteById(req.params.id);
            if (!site) {
                return res.status(404).json({ error: 'Site bulunamadı' });
            }
            res.json({ site });
        } catch (error) {
            console.error('Site fetch error:', error);
            res.status(500).json({ error: 'Site yüklenirken hata oluştu' });
        }
    });

    // GET /api/sites/:id/buildings - Site'ın blokları
    router.get('/sites/:id/buildings', requireAuth, async (req, res) => {
        try {
            const buildings = await storage.getBuildingsBySiteId(req.params.id);
            res.json({ buildings });
        } catch (error) {
            console.error('Site buildings fetch error:', error);
            res.status(500).json({ error: 'Site blokları yüklenirken hata oluştu' });
        }
    });

    // POST /api/sites - Yeni site oluştur (Admin only)
    router.post('/sites', requireAuth, async (req, res) => {
        try {
            const site = await storage.createSite(req.body);
            res.status(201).json({ site });
        } catch (error) {
            console.error('Site create error:', error);
            res.status(500).json({ error: 'Site oluşturulurken hata oluştu' });
        }
    });

    // PUT /api/sites/:id - Site güncelle (Admin only)
    router.put('/sites/:id', requireAuth, async (req, res) => {
        try {
            const site = await storage.updateSite(req.params.id, req.body);
            res.json({ site });
        } catch (error) {
            console.error('Site update error:', error);
            res.status(500).json({ error: 'Site güncellenirken hata oluştu' });
        }
    });

    // DELETE /api/sites/:id - Site sil (Admin only)
    router.delete('/sites/:id', requireAuth, async (req, res) => {
        try {
            await storage.deleteSite(req.params.id);
            res.json({ success: true });
        } catch (error) {
            console.error('Site delete error:', error);
            res.status(500).json({ error: 'Site silinirken hata oluştu' });
        }
    });

    // POST /api/sites/:siteId/assign/:userId - Kullanıcıyı site'a ata (Admin only)
    router.post('/sites/:siteId/assign/:userId', requireAuth, async (req, res) => {
        try {
            const assignment = await storage.assignUserToSite(req.params.userId, req.params.siteId);
            res.status(201).json({ assignment });
        } catch (error) {
            console.error('User site assignment error:', error);
            res.status(500).json({ error: 'Kullanıcı site\'a atanırken hata oluştu' });
        }
    });

    // DELETE /api/sites/:siteId/unassign/:userId - Kullanıcının site atamasını kaldır (Admin only)
    router.delete('/sites/:siteId/unassign/:userId', requireAuth, async (req, res) => {
        try {
            await storage.unassignUserFromSite(req.params.userId, req.params.siteId);
            res.json({ success: true });
        } catch (error) {
            console.error('User site unassignment error:', error);
            res.status(500).json({ error: 'Kullanıcı site ataması kaldırılırken hata oluştu' });
        }
    });

    // ==================== BUILDINGS ROUTES ====================

    router.get('/buildings', async (req, res) => {
        try {
            const buildings = await storage.getAllBuildings();
            res.json({ buildings });
        } catch (error) {
            res.status(500).json({ error: 'Bloklar yüklenirken hata oluştu' });
        }
    });

    // ==================== VEHICLE BRANDS & MODELS ====================

    // GET /api/vehicle-brands - Get all vehicle brands
    router.get('/vehicle-brands', requireAuth, async (req, res) => {
        try {
            const brands = await storage.getAllVehicleBrands();
            res.json({ brands });
        } catch (error: any) {
            console.error('Vehicle brands error:', error);
            res.status(500).json({ error: error.message || 'Araç markaları yüklenirken hata oluştu' });
        }
    });

    // GET /api/vehicle-brands/:brandId/models - Get models by brand ID
    router.get('/vehicle-brands/:brandId/models', requireAuth, async (req, res) => {
        try {
            const models = await storage.getVehicleModelsByBrandId(req.params.brandId);
            res.json({ models });
        } catch (error: any) {
            console.error('Vehicle models error:', error);
            res.status(500).json({ error: error.message || 'Araç modelleri yüklenirken hata oluştu' });
        }
    });

    // ==================== RESIDENTS FULL DATA (JOIN) ====================

    // GET /api/residents/building-data/:buildingId
    router.get('/residents/building-data/:buildingId', requireAuth, async (req, res) => {
        try {
            const data = await storage.getBuildingFullData(req.params.buildingId);
            res.json(data);
        } catch (error: any) {
            console.error('Building full data error:', error);
            res.status(500).json({ error: error.message || 'Building data yüklenirken hata oluştu' });
        }
    });

    // GET /api/guest-visits?page=1&limit=10&status=active&search=34ABC&dateFrom=2024-01-01&dateTo=2024-12-31&sortBy=plate&sortOrder=asc
    router.get('/guest-visits', requireAuth, async (req, res) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string | undefined;
            const search = req.query.search as string | undefined;
            const dateFrom = req.query.dateFrom as string | undefined;
            const dateTo = req.query.dateTo as string | undefined;
            const sortBy = req.query.sortBy as string | undefined;
            const sortOrder = req.query.sortOrder as 'asc' | 'desc' | undefined;
            
            const result = await storage.getGuestVisitsPaginated(page, limit, { 
                status, 
                search, 
                dateFrom, 
                dateTo,
                sortBy,
                sortOrder
            });
            res.json(result);
        } catch (error: any) {
            console.error('Guest visits error:', error);
            res.status(500).json({ error: 'Guest visits yüklenirken hata oluştu' });
        }
    });

    return router;
}
