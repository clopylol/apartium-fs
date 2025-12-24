// Script to create a new user and assign to a site
import { db } from '../db/index.js';
import { hashPassword } from '../auth.js';
import * as schema from 'apartium-shared';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

async function createUserAndAssignToSite() {
    try {
        // Önce user_site_assignments tablosunu oluştur (eğer yoksa)
        console.log('🔍 user_site_assignments tablosunu kontrol ediliyor...');
        try {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS "user_site_assignments" (
                    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                    "user_id" uuid NOT NULL,
                    "site_id" uuid NOT NULL,
                    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
                    CONSTRAINT "user_site_assignments_user_id_users_id_fk" 
                        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
                    CONSTRAINT "user_site_assignments_site_id_sites_id_fk" 
                        FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE cascade ON UPDATE no action
                )
            `);
            
            // Unique constraint ekle
            await db.execute(sql`
                DO $$ 
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint 
                        WHERE conname = 'user_site_assignments_user_site_unique'
                    ) THEN
                        ALTER TABLE "user_site_assignments" 
                        ADD CONSTRAINT "user_site_assignments_user_site_unique" 
                        UNIQUE ("user_id", "site_id");
                    END IF;
                END $$;
            `);
            
            // Index'leri oluştur
            await db.execute(sql`
                CREATE INDEX IF NOT EXISTS "user_site_assignments_user_id_idx" 
                ON "user_site_assignments" ("user_id");
            `);
            
            await db.execute(sql`
                CREATE INDEX IF NOT EXISTS "user_site_assignments_site_id_idx" 
                ON "user_site_assignments" ("site_id");
            `);
            
            console.log('✅ user_site_assignments tablosu hazır');
        } catch (error: any) {
            if (error?.code !== '42P07') { // 42P07 = relation already exists
                throw error;
            }
            console.log('✅ user_site_assignments tablosu zaten mevcut');
        }

        // User bilgileri
        const email = 'berkayertugrulfb@hotmail.com';
        const name = 'Berkay Ertuğrul';
        const role = 'manager' as const;
        const password = '12345';
        const siteName = 'Kayahan Apartmanı';

        // Kullanıcı zaten var mı kontrol et
        const [existingUser] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .limit(1);

        let newUser;
        if (existingUser) {
            console.log('ℹ️  Kullanıcı zaten mevcut:', existingUser);
            newUser = existingUser;
        } else {
            // Şifreyi hash'le
            const passwordHash = await hashPassword(password);

            // Kullanıcıyı oluştur
            [newUser] = await db
                .insert(schema.users)
                .values({
                    email,
                    passwordHash,
                    name,
                    role,
                    isActive: true,
                })
                .returning();

            console.log('✅ Kullanıcı oluşturuldu:', newUser);
        }

        // Site'i bul
        const [site] = await db
            .select()
            .from(schema.sites)
            .where(eq(schema.sites.name, siteName))
            .limit(1);

        if (!site) {
            throw new Error(`Site bulunamadı: ${siteName}`);
        }

        console.log('✅ Site bulundu:', site);

        // Kullanıcı zaten site'e atanmış mı kontrol et
        const [existingAssignment] = await db
            .select()
            .from(schema.userSiteAssignments)
            .where(
                eq(schema.userSiteAssignments.userId, newUser.id)
            )
            .limit(1);

        if (existingAssignment) {
            console.log('ℹ️  Kullanıcı zaten bir site\'e atanmış:', existingAssignment);
            
            // Farklı bir site'e atanmışsa güncelle
            if (existingAssignment.siteId !== site.id) {
                await db
                    .update(schema.userSiteAssignments)
                    .set({ siteId: site.id })
                    .where(eq(schema.userSiteAssignments.id, existingAssignment.id));
                console.log('✅ Site ataması güncellendi');
            } else {
                console.log('✅ Kullanıcı zaten bu site\'e atanmış');
            }
        } else {
            // Kullanıcıyı site'e ata
            const [assignment] = await db
                .insert(schema.userSiteAssignments)
                .values({
                    userId: newUser.id,
                    siteId: site.id,
                })
                .returning();

            console.log('✅ Kullanıcı site\'e atandı:', assignment);
        }

        console.log('\n🎉 İşlem tamamlandı!');
        console.log(`Email: ${email}`);
        console.log(`Şifre: ${password}`);
        console.log(`Site: ${siteName}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error);
        process.exit(1);
    }
}

createUserAndAssignToSite();
