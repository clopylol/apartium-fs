import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectPgSimple from 'connect-pg-simple';
import { DatabaseStorage } from './db-storage.js';
import { setupAuth } from './auth.js';
import { createRoutes } from './routes.js';
import { db } from './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
const PgSession = connectPgSimple(session);
app.use(
    session({
        store: new PgSession({
            conString: process.env.DATABASE_URL,
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-this',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        },
    })
);

// ==================== AUTHENTICATION ====================
const storage = new DatabaseStorage();
setupAuth(storage);

app.use(passport.initialize());
app.use(passport.session());
app.set('passport', passport);

// ==================== ROUTES ====================
app.use('/api', createRoutes(storage));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route bulunamadı' });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Sunucu hatası',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
