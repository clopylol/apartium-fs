import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import connectPgSimple from 'connect-pg-simple';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DatabaseStorage } from './db-storage.js';
import { setupAuth } from './auth.js';
import { createRoutes } from './routes.js';
import { db } from './db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (2 levels up from server/src)
dotenv.config({ path: join(__dirname, '../../.env') });

// Environment validation
const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('💡 Please create a .env file in the project root with these variables.');
    process.exit(1);
}

if (process.env.NODE_ENV === 'production' && process.env.SESSION_SECRET === 'your-super-secret-key-change-this') {
    console.error('❌ SESSION_SECRET must be changed in production!');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== SECURITY MIDDLEWARE ====================
// Helmet - Security headers
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
}));

// Rate limiting - Brute force protection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 attempts per 15 minutes
    message: 'Çok fazla giriş denemesi, lütfen 15 dakika sonra tekrar deneyin.',
});
app.use('/api/auth/login', authLimiter);

// ==================== MIDDLEWARE ====================
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // Body size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
