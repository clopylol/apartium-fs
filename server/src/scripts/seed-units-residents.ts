/**
 * Seed script for units and residents
 * This script populates units and residents for existing buildings
 * 
 * Usage: npx tsx server/src/scripts/seed-units-residents.ts
 */

import { db } from '../db/index.js';
import * as schema from 'apartium-shared';
import { eq } from 'drizzle-orm';

interface UnitData {
  number: string;
  floor: number;
  status: 'occupied' | 'empty';
  residents?: {
    name: string;
    type: 'owner' | 'tenant';
    phone: string;
    email?: string;
  }[];
}

// Her blok için daire ve sakin verileri
const buildingUnitsData: Record<string, UnitData[]> = {
  // A Blok - Kayahan Apartmanı
  'd2fd5e1c-1840-468a-8362-3db98945bf24': [
    { number: '101', floor: 1, status: 'occupied', residents: [{ name: 'Ahmet Yılmaz', type: 'owner', phone: '05321112233', email: 'ahmet.yilmaz@example.com' }] },
    { number: '102', floor: 1, status: 'occupied', residents: [{ name: 'Ayşe Demir', type: 'tenant', phone: '05322223344', email: 'ayse.demir@example.com' }] },
    { number: '201', floor: 2, status: 'occupied', residents: [{ name: 'Mehmet Kaya', type: 'owner', phone: '05323334455', email: 'mehmet.kaya@example.com' }] },
    { number: '202', floor: 2, status: 'occupied', residents: [{ name: 'Fatma Öz', type: 'owner', phone: '05324445566', email: 'fatma.oz@example.com' }] },
    { number: '301', floor: 3, status: 'occupied', residents: [{ name: 'Ali Çelik', type: 'tenant', phone: '05325556677', email: 'ali.celik@example.com' }] },
    { number: '302', floor: 3, status: 'empty' },
    { number: '401', floor: 4, status: 'occupied', residents: [{ name: 'Zeynep Arslan', type: 'owner', phone: '05326667788', email: 'zeynep.arslan@example.com' }] },
    { number: '402', floor: 4, status: 'occupied', residents: [{ name: 'Can Yıldız', type: 'owner', phone: '05327778899', email: 'can.yildiz@example.com' }] },
  ],
  // B Blok - Kayahan Apartmanı
  '9df40fc4-fa6e-4e73-8d09-9e04eb2e55de': [
    { number: '101', floor: 1, status: 'occupied', residents: [{ name: 'Elif Şahin', type: 'tenant', phone: '05328889900', email: 'elif.sahin@example.com' }] },
    { number: '102', floor: 1, status: 'occupied', residents: [{ name: 'Burak Aydın', type: 'owner', phone: '05329990011', email: 'burak.aydin@example.com' }] },
    { number: '201', floor: 2, status: 'occupied', residents: [{ name: 'Selin Yılmaz', type: 'owner', phone: '05320001122', email: 'selin.yilmaz@example.com' }] },
    { number: '202', floor: 2, status: 'empty' },
    { number: '301', floor: 3, status: 'occupied', residents: [{ name: 'Emre Koç', type: 'tenant', phone: '05321112233', email: 'emre.koc@example.com' }] },
    { number: '302', floor: 3, status: 'occupied', residents: [{ name: 'Deniz Yıldırım', type: 'owner', phone: '05322223344', email: 'deniz.yildirim@example.com' }] },
  ],
  // C Blok - Kayahan Apartmanı
  'c7987b48-328a-4509-8e0b-74c368087715': [
    { number: '101', floor: 1, status: 'occupied', residents: [{ name: 'Gizem Özdemir', type: 'owner', phone: '05323334455', email: 'gizem.ozdemir@example.com' }] },
    { number: '102', floor: 1, status: 'empty' },
    { number: '201', floor: 2, status: 'occupied', residents: [{ name: 'Kerem Doğan', type: 'tenant', phone: '05324445566', email: 'kerem.dogan@example.com' }] },
    { number: '202', floor: 2, status: 'occupied', residents: [{ name: 'Sude Acar', type: 'owner', phone: '05325556677', email: 'sude.acar@example.com' }] },
    { number: '301', floor: 3, status: 'occupied', residents: [{ name: 'Onur Şen', type: 'owner', phone: '05326667788', email: 'onur.sen@example.com' }] },
  ],
  // D Blok - Kayahan Apartmanı
  'c73b21e9-3078-4a24-920b-85eddb067a5f': [
    { number: '101', floor: 1, status: 'occupied', residents: [{ name: 'Merve Kılıç', type: 'owner', phone: '05327778899', email: 'merve.kilic@example.com' }] },
    { number: '102', floor: 1, status: 'occupied', residents: [{ name: 'Barış Öztürk', type: 'tenant', phone: '05328889900', email: 'baris.ozturk@example.com' }] },
    { number: '201', floor: 2, status: 'empty' },
    { number: '202', floor: 2, status: 'occupied', residents: [{ name: 'Ceren Avcı', type: 'owner', phone: '05329990011', email: 'ceren.avci@example.com' }] },
    { number: '301', floor: 3, status: 'occupied', residents: [{ name: 'Tolga Yücel', type: 'owner', phone: '05320001122', email: 'tolga.yucel@example.com' }] },
    { number: '302', floor: 3, status: 'occupied', residents: [{ name: 'Aslı Güneş', type: 'tenant', phone: '05321112233', email: 'asli.gunes@example.com' }] },
  ],
  // Gunes Apartmani - Varsayılan Site
  '45b02b41-a9b5-4018-8a6c-fd9140b6281d': [
    { number: '1', floor: 1, status: 'occupied', residents: [{ name: 'Hasan Yıldız', type: 'owner', phone: '05322223344', email: 'hasan.yildiz@example.com' }] },
    { number: '2', floor: 1, status: 'occupied', residents: [{ name: 'Gülay Çetin', type: 'owner', phone: '05323334455', email: 'gulay.cetin@example.com' }] },
    { number: '3', floor: 2, status: 'occupied', residents: [{ name: 'Murat Özkan', type: 'tenant', phone: '05324445566', email: 'murat.ozkan@example.com' }] },
    { number: '4', floor: 2, status: 'occupied', residents: [{ name: 'Pınar Aydın', type: 'owner', phone: '05325556677', email: 'pinar.aydin@example.com' }] },
    { number: '5', floor: 3, status: 'occupied', residents: [{ name: 'Serkan Demir', type: 'owner', phone: '05326667788', email: 'serkan.demir@example.com' }] },
    { number: '6', floor: 3, status: 'empty' },
  ],
};

async function seedUnitsAndResidents() {
  try {
    console.log('🌱 Starting seed for units and residents...\n');

    let totalUnits = 0;
    let totalResidents = 0;

    // Her building için daire ve sakin ekle
    for (const [buildingId, unitsData] of Object.entries(buildingUnitsData)) {
      // Building'in var olup olmadığını kontrol et
      const building = await db.select().from(schema.buildings).where(eq(schema.buildings.id, buildingId)).limit(1);
      
      if (building.length === 0) {
        console.log(`⚠️  Building ${buildingId} not found, skipping...`);
        continue;
      }

      console.log(`📦 Processing building: ${building[0].name} (${buildingId})`);

      for (const unitData of unitsData) {
        // Daire ekle
        const [unit] = await db.insert(schema.units).values({
          buildingId: buildingId,
          number: unitData.number,
          floor: unitData.floor,
          status: unitData.status,
        }).returning();

        totalUnits++;
        console.log(`   ✅ Unit ${unitData.number} (Floor ${unitData.floor}) - ${unitData.status}`);

        // Sakin ekle (eğer varsa)
        if (unitData.residents && unitData.residents.length > 0) {
          for (const residentData of unitData.residents) {
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(residentData.name)}&background=random&color=fff`;
            
            await db.insert(schema.residents).values({
              unitId: unit.id,
              name: residentData.name,
              type: residentData.type,
              phone: residentData.phone,
              email: residentData.email,
              avatar: avatarUrl,
            });

            totalResidents++;
            console.log(`      👤 Resident: ${residentData.name} (${residentData.type})`);
          }
        }
      }

      console.log('');
    }

    console.log('='.repeat(60));
    console.log('✅ Seed completed successfully!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   Units created: ${totalUnits}`);
    console.log(`   Residents created: ${totalResidents}`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seed failed:', error);
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

seedUnitsAndResidents();

