import { db } from './db/index.js';
import * as schema from 'apartium-shared';

async function seedCommunity() {
    console.log('🌱 Seeding community data...');

    try {
        // Get first 3 residents and units for test data
        const residents = await db.select().from(schema.residents).limit(3);
        const units = await db.select().from(schema.units).limit(3);

        if (residents.length === 0 || units.length === 0) {
            console.error('❌ No residents or units found. Please seed basic data first.');
            process.exit(1);
        }

        console.log(`✅ Found ${residents.length} residents and ${units.length} units`);

        // Create community requests (15 items for pagination test)
        console.log('📝 Creating community requests...');
        const requests = await db.insert(schema.communityRequests).values([
            {
                authorId: residents[0].id,
                unitId: units[0].id,
                type: 'wish',
                title: 'Çocuk Oyun Alanı Yenileme',
                description: 'Sitenin çocuk oyun alanındaki ekipmanlar eskidi ve yenilenmesi gerekiyor.',
                status: 'pending',
            },
            {
                authorId: residents[1].id,
                unitId: units[1].id,
                type: 'wish',
                title: 'Otopark Aydınlatması',
                description: 'Kapalı otoparkın aydınlatması yetersiz.',
                status: 'pending',
            },
            {
                authorId: residents[2].id,
                unitId: units[2].id,
                type: 'suggestion',
                title: 'Bisiklet Park Alanı',
                description: 'Site girişine bisiklet park alanı yapılması önerisi.',
                status: 'in-progress',
            },
            {
                authorId: residents[0].id,
                unitId: units[0].id,
                type: 'wish',
                title: 'Asansör Bakımı',
                description: 'A blok asansörü sık sık arızalanıyor.',
                status: 'resolved',
            },
            {
                authorId: residents[1].id,
                unitId: units[1].id,
                type: 'suggestion',
                title: 'Havuz Isıtma Sistemi',
                description: 'Havuzun ısıtma sistemi ile kış aylarında da kullanılabilir hale getirilmesi.',
                status: 'rejected',
            },
            // Additional requests for pagination
            {
                authorId: residents[0].id,
                unitId: units[0].id,
                type: 'wish',
                title: 'Spor Salonu Ekipman Yenileme',
                description: 'Spor salonundaki koşu bandı ve ağırlık setlerinin yenilenmesi.',
                status: 'pending',
            },
            {
                authorId: residents[1].id,
                unitId: units[1].id,
                type: 'wish',
                title: 'Bahçe Peyzaj Düzenlemesi',
                description: 'Site bahçesine yeni çiçekler ve ağaçlar dikilmesi.',
                status: 'pending',
            },
            {
                authorId: residents[2].id,
                unitId: units[2].id,
                type: 'suggestion',
                title: 'Elektrikli Araç Şarj İstasyonu',
                description: 'Otoparka elektrikli araç şarj istasyonu kurulması.',
                status: 'in-progress',
            },
            {
                authorId: residents[0].id,
                unitId: units[0].id,
                type: 'wish',
                title: 'Çöp Toplama Saatlerinin Düzenlenmesi',
                description: 'Çöp toplama saatlerinin akşam saatlerine alınması.',
                status: 'pending',
            },
            {
                authorId: residents[1].id,
                unitId: units[1].id,
                type: 'suggestion',
                title: 'Güvenlik Kamera Sayısının Artırılması',
                description: 'Ortak alanlara ek güvenlik kameraları konulması.',
                status: 'pending',
            },
            {
                authorId: residents[2].id,
                unitId: units[2].id,
                type: 'wish',
                title: 'Çatı İzolasyonu',
                description: 'Üst kat dairelerinde sıcaklık sorunu için çatı izolasyonu.',
                status: 'resolved',
            },
            {
                authorId: residents[0].id,
                unitId: units[0].id,
                type: 'suggestion',
                title: 'Sosyal Tesis Kullanım Saatleri',
                description: 'Sosyal tesisin hafta sonu kullanım saatlerinin uzatılması.',
                status: 'in-progress',
            },
            {
                authorId: residents[1].id,
                unitId: units[1].id,
                type: 'wish',
                title: 'Kapı Görevlisi Sayısının Artırılması',
                description: 'Gece vardiyasında ek güvenlik personeli istihdam edilmesi.',
                status: 'pending',
            },
            {
                authorId: residents[2].id,
                unitId: units[2].id,
                type: 'suggestion',
                title: 'Paket Servisi Dolabı',
                description: 'Giriş katına akıllı paket servisi dolabı kurulması.',
                status: 'rejected',
            },
            {
                authorId: residents[0].id,
                unitId: units[0].id,
                type: 'wish',
                title: 'Yangın Merdiveni Bakımı',
                description: 'Yangın merdivenlerinin boyası ve temizliği yapılmalı.',
                status: 'resolved',
            },
        ]).returning();

        console.log(`✅ Created ${requests.length} community requests (pagination test ready)`);

        // Create polls (12 items for pagination test)
        console.log('📊 Creating polls...');
        const now = new Date();
        const polls = await db.insert(schema.polls).values([
            {
                authorId: residents[0].id,
                title: 'Yaz Aylarında Havuz Saatleri',
                description: 'Yaz aylarında havuz kullanım saatlerinin 22:00\'e kadar uzatılması hakkında ne düşünüyorsunuz?',
                startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                authorId: residents[1].id,
                title: 'Ortak Alan Kullanım Ücreti',
                description: 'Spor salonu ve sosyal tesis kullanımı için aylık 50 TL ücret alınması önerisi.',
                startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                authorId: residents[2].id,
                title: 'Site Girişine Güvenlik Kamerası',
                description: 'Site giriş ve çıkışlarına ek güvenlik kamerası konulması.',
                startDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000),
                status: 'closed',
            },
            // Additional polls
            {
                authorId: residents[0].id,
                title: 'Elektrikli Araç Şarj İstasyonu',
                description: 'Otoparka elektrikli araç şarj istasyonu kurulması için ek ücret ödemeyi kabul eder misiniz?',
                startDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                authorId: residents[1].id,
                title: 'Bahçe Peyzaj Yenileme',
                description: 'Site bahçesinin profesyonel peyzaj firması ile yenilenmesi.',
                startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                authorId: residents[2].id,
                title: 'Çocuk Oyun Alanı Genişletme',
                description: 'Mevcut çocuk oyun alanının genişletilmesi ve yeni ekipmanlar eklenmesi.',
                startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                authorId: residents[0].id,
                title: 'Bisiklet Park Alanı',
                description: 'Her bloğa ayrı bisiklet park alanı yapılması.',
                startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
                status: 'closed',
            },
            {
                authorId: residents[1].id,
                title: 'Spor Salonu Yenileme',
                description: 'Spor salonuna yeni ekipmanlar alınması ve duvarların boyanması.',
                startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                authorId: residents[2].id,
                title: 'Paket Servisi Dolabı',
                description: 'Akıllı paket servisi dolabı kurulumu için ek ücret.',
                startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
                status: 'closed',
            },
            {
                authorId: residents[0].id,
                title: 'Güvenlik Personeli Artırımı',
                description: 'Gece vardiyasında ek güvenlik personeli istihdam edilmesi.',
                startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                authorId: residents[1].id,
                title: 'Sosyal Tesis Sauna Eklenmesi',
                description: 'Sosyal tesise sauna ve buhar odası eklenmesi.',
                startDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                authorId: residents[2].id,
                title: 'Çatı İzolasyonu Yenileme',
                description: 'Tüm blokların çatı izolasyonunun yenilenmesi.',
                startDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
                status: 'closed',
            },
        ]).returning();

        console.log(`✅ Created ${polls.length} polls (pagination test ready)`);

        // Create poll votes
        console.log('🗳️  Creating poll votes...');
        const votes = [];

        // Votes for first poll (5 votes)
        for (let i = 0; i < Math.min(5, residents.length); i++) {
            votes.push({
                pollId: polls[0].id,
                residentId: residents[i % residents.length].id,
                choice: Math.random() > 0.4 ? 'yes' as const : 'no' as const,
            });
        }

        // Votes for second poll (3 votes)
        for (let i = 0; i < Math.min(3, residents.length); i++) {
            votes.push({
                pollId: polls[1].id,
                residentId: residents[i % residents.length].id,
                choice: Math.random() > 0.6 ? 'yes' as const : 'no' as const,
            });
        }

        // Votes for closed poll (all residents)
        for (let i = 0; i < residents.length; i++) {
            votes.push({
                pollId: polls[2].id,
                residentId: residents[i].id,
                choice: Math.random() > 0.3 ? 'yes' as const : 'no' as const,
            });
        }

        if (votes.length > 0) {
            await db.insert(schema.pollVotes).values(votes);
            console.log(`✅ Created ${votes.length} poll votes`);
        }

        console.log('✨ Community data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding community data:', error);
        process.exit(1);
    }
}

seedCommunity();

