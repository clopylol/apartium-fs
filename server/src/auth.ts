import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import type { IStorage } from './storage.js';
import type { User } from 'apartium-shared';

export function setupAuth(storage: IStorage) {
    // Local Strategy (email + password)
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const user = await storage.getUserByEmail(email);

                    if (!user) {
                        return done(null, false, { message: 'Kullanıcı bulunamadı' });
                    }

                    if (!user.isActive) {
                        return done(null, false, { message: 'Hesap aktif değil' });
                    }

                    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

                    if (!isValidPassword) {
                        return done(null, false, { message: 'Şifre hatalı' });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Serialize user for session
    passport.serializeUser((user, done) => {
        done(null, (user as User).id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await storage.getUserById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    return passport;
}

// Helper function: password hashing
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Middleware: Require authentication
export function requireAuth(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Oturum açmanız gerekiyor' });
}

// Middleware: Require specific role
export function requireRole(...roles: string[]) {
    return (req: any, res: any, next: any) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Oturum açmanız gerekiyor' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
        }

        next();
    };
}
