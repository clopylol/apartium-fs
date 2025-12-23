import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import type { IStorage } from './storage.js';
import type { User, Resident } from 'apartium-shared';

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
                    // Try Admin/Staff/Manager first
                    let user: any = await storage.getUserByEmail(email);
                    let type = 'user';

                    // If not found, try Resident
                    if (!user) {
                        user = await storage.getResidentByEmail(email);
                        type = 'resident';
                        if (user) {
                            // Residents don't have role field in DB yet, assign it
                            user.role = 'resident';
                        }
                    }

                    if (!user) {
                        return done(null, false, { message: 'Kullanıcı bulunamadı' });
                    }

                    // Check isActive for users (residents don't have this field yet, only soft-delete)
                    if (type === 'user' && !user.isActive) {
                        return done(null, false, { message: 'Hesap aktif değil' });
                    }

                    if (!user.passwordHash) {
                        return done(null, false, { message: 'Hesabınız henüz oluşturulmamış veya şifre tanımlanmamış' });
                    }

                    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

                    if (!isValidPassword) {
                        return done(null, false, { message: 'Şifre hatalı' });
                    }

                    // Add type to user object for serialization
                    user.__authType = type;
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Serialize user for session
    passport.serializeUser((user: any, done) => {
        done(null, `${user.__authType}:${user.id}`);
    });

    // Deserialize user from session
    passport.deserializeUser(async (sessionKey: string, done) => {
        try {
            const [type, id] = sessionKey.split(':');
            let user: any;

            if (type === 'resident') {
                user = await storage.getResidentById(id);
                if (user) user.role = 'resident';
            } else {
                user = await storage.getUserById(id);
            }

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
