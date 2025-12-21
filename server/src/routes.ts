import express, { type Router } from 'express';
import type { IStorage } from './storage.js';
import { requireAuth } from './auth.js';
import { insertPaymentRecordSchema, insertExpenseRecordSchema } from 'apartium-shared';

export function createRoutes(storage: IStorage): Router {
    const router = express.Router();

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

    // GET /api/auth/me
    router.get('/auth/me', requireAuth, (req, res) => {
        const { passwordHash, ...userWithoutPassword } = req.user as any;
        res.json({ user: userWithoutPassword });
    });

    // ==================== PAYMENT ROUTES ====================

    // GET /api/payments?month=Ocak&year=2025
    router.get('/payments', requireAuth, async (req, res) => {
        try {
            const { month, year } = req.query;

            if (!month || !year) {
                return res.status(400).json({ error: 'month ve year parametreleri gerekli' });
            }

            const payments = await storage.getPaymentRecordsByPeriod(
                month as string,
                parseInt(year as string)
            );

            res.json({ payments });
        } catch (error) {
            console.error('Payments fetch error:', error);
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
            console.error('Payment creation error:', error);
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            }
            res.status(500).json({ error: 'Ödeme oluşturulamadı' });
        }
    });

    // PATCH /api/payments/:id/status
    router.patch('/payments/:id/status', requireAuth, async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['paid', 'unpaid'].includes(status)) {
                return res.status(400).json({ error: 'Geçersiz status değeri' });
            }

            const payment = await storage.updatePaymentStatus(id, status);
            res.json({ payment });
        } catch (error) {
            console.error('Payment status update error:', error);
            res.status(500).json({ error: 'Ödeme durumu güncellenemedi' });
        }
    });

    // ==================== EXPENSE ROUTES ====================

    // GET /api/expenses?month=Ocak&year=2025
    router.get('/expenses', requireAuth, async (req, res) => {
        try {
            const { month, year } = req.query;

            if (!month || !year) {
                return res.status(400).json({ error: 'month ve year parametreleri gerekli' });
            }

            const expenses = await storage.getExpenseRecordsByPeriod(
                month as string,
                parseInt(year as string)
            );

            res.json({ expenses });
        } catch (error) {
            console.error('Expenses fetch error:', error);
            res.status(500).json({ error: 'Giderler yüklenirken hata oluştu' });
        }
    });

    // POST /api/expenses
    router.post('/expenses', requireAuth, async (req, res) => {
        try {
            const validatedData = insertExpenseRecordSchema.parse(req.body);
            const expense = await storage.createExpenseRecord(validatedData);
            res.status(201).json({ expense });
        } catch (error: any) {
            console.error('Expense creation error:', error);
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Geçersiz veri', details: error.errors });
            }
            res.status(500).json({ error: 'Gider oluşturulamadı' });
        }
    });

    // DELETE /api/expenses/:id
    router.delete('/expenses/:id', requireAuth, async (req, res) => {
        try {
            const { id } = req.params;
            await storage.deleteExpenseRecord(id);
            res.json({ message: 'Gider silindi' });
        } catch (error) {
            console.error('Expense deletion error:', error);
            res.status(500).json({ error: 'Gider silinemedi' });
        }
    });

    // ==================== BUILDINGS ROUTES ====================

    // GET /api/buildings
    router.get('/buildings', requireAuth, async (req, res) => {
        try {
            const buildings = await storage.getAllBuildings();
            res.json({ buildings });
        } catch (error) {
            console.error('Buildings fetch error:', error);
            res.status(500).json({ error: 'Bloklar yüklenirken hata oluştu' });
        }
    });

    return router;
}
