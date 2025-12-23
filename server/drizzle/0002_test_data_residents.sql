-- Test Data Migration for Residents Module
-- Creates: 1 Building, 4 Units, 3 Residents, 6 Parking Spots, 3 Vehicles, 3 Guest Visits

-- Step 1: Insert Building and capture ID
WITH building_insert AS (
  INSERT INTO buildings (name, address, floor_count, created_at, updated_at)
  VALUES ('A Blok', 'Test Mahallesi, Test Sokak No:1', 2, NOW(), NOW())
  RETURNING id
),

-- Step 2: Insert Units
unit_inserts AS (
  INSERT INTO units (building_id, number, floor, status, created_at, updated_at)
  SELECT 
    building_insert.id,
    unit_data.number,
    unit_data.floor,
    unit_data.status::enum_unit_status,
    NOW(),
    NOW()
  FROM building_insert,
  (VALUES
    ('101', 1, 'occupied'),
    ('102', 1, 'occupied'),
    ('201', 2, 'occupied'),
    ('202', 2, 'empty')
  ) AS unit_data(number, floor, status)
  RETURNING id, number
),

-- Step 3: Insert Residents
resident_inserts AS (
  INSERT INTO residents (unit_id, name, type, phone, email, avatar, created_at, updated_at)
  SELECT 
    unit_inserts.id,
    resident_data.name,
    resident_data.type::enum_resident_type,
    resident_data.phone,
    resident_data.email,
    'https://ui-avatars.com/api/?name=' || replace(resident_data.name, ' ', '+') || '&background=random&color=fff',
    NOW(),
    NOW()
  FROM unit_inserts,
  (VALUES
    ('101', 'Ahmet Yılmaz', 'owner', '+90 555 111 2233', 'ahmet.yilmaz@example.com'),
    ('102', 'Ayşe Demir', 'tenant', '+90 555 444 5566', 'ayse.demir@example.com'),
    ('201', 'Mehmet Kaya', 'owner', '+90 555 777 8899', 'mehmet.kaya@example.com')
  ) AS resident_data(unit_number, name, type, phone, email)
  WHERE unit_inserts.number = resident_data.unit_number
  RETURNING id, name
),

-- Step 4: Insert Parking Spots
parking_inserts AS (
  INSERT INTO parking_spots (building_id, name, floor, status, created_at, updated_at)
  SELECT 
    building_insert.id,
    spot_data.name,
    -1,
    'available',
    NOW(),
    NOW()
  FROM building_insert,
  (VALUES
    ('A1'),
    ('A2'),
    ('A3'),
    ('A4'),
    ('A5'),
    ('A6')
  ) AS spot_data(name)
  RETURNING id, name
),

-- Step 5: Insert Vehicles
vehicle_inserts AS (
  INSERT INTO vehicles (resident_id, parking_spot_id, plate, model, created_at, updated_at)
  SELECT 
    resident_inserts.id,
    parking_inserts.id,
    vehicle_data.plate,
    vehicle_data.model,
    NOW(),
    NOW()
  FROM resident_inserts, parking_inserts,
  (VALUES
    ('Ahmet Yılmaz', 'A1', '06 ABC 111', 'Toyota Corolla'),
    ('Ayşe Demir', 'A2', '06 DEF 222', 'Honda Civic'),
    ('Mehmet Kaya', 'A3', '06 GHI 333', 'Volkswagen Passat')
  ) AS vehicle_data(resident_name, parking_spot, plate, model)
  WHERE resident_inserts.name = vehicle_data.resident_name
    AND parking_inserts.name = vehicle_data.parking_spot
  RETURNING id
),

-- Step 6: Insert Guest Visits
guest_inserts AS (
  INSERT INTO guest_visits (
    unit_id, 
    parking_spot_id, 
    plate, 
    guest_name, 
    model, 
    color, 
    status, 
    source, 
    expected_date, 
    duration_days, 
    entry_time, 
    exit_time,
    note,
    created_at, 
    updated_at
  )
  SELECT 
    unit_inserts.id,
    parking_inserts.id,
    guest_data.plate,
    guest_data.guest_name,
    guest_data.model,
    guest_data.color,
    guest_data.status::enum_guest_visit_status,
    guest_data.source::enum_guest_visit_source,
    guest_data.expected_date,
    guest_data.duration_days,
    guest_data.entry_time,
    guest_data.exit_time,
    guest_data.note,
    NOW(),
    NOW()
  FROM unit_inserts, parking_inserts,
  (VALUES
    ('101', 'A4', '06 XYZ 111', 'Ali Veli', 'Renault Clio', 'Beyaz', 'pending', 'app', CURRENT_DATE + interval '1 day', 2, NULL, NULL, 'Yarın gelecek misafir'),
    ('102', 'A5', '35 MNO 222', 'Fatma Yıldız', 'Opel Astra', 'Siyah', 'active', 'manual', CURRENT_DATE, 1, NOW() - interval '2 hours', NULL, 'Şu anda içeride'),
    ('201', NULL, '41 PQR 333', 'Can Öztürk', 'Ford Focus', 'Gri', 'completed', 'phone', CURRENT_DATE - interval '1 day', 1, NOW() - interval '1 day', NOW() - interval '4 hours', 'Dün çıkış yaptı')
  ) AS guest_data(unit_number, parking_spot, plate, guest_name, model, color, status, source, expected_date, duration_days, entry_time, exit_time, note)
  WHERE unit_inserts.number = guest_data.unit_number
    AND (guest_data.parking_spot IS NULL OR parking_inserts.name = guest_data.parking_spot)
  RETURNING id
)

-- Final select to confirm insertions
SELECT 
  (SELECT COUNT(*) FROM building_insert) as buildings_created,
  (SELECT COUNT(*) FROM unit_inserts) as units_created,
  (SELECT COUNT(*) FROM resident_inserts) as residents_created,
  (SELECT COUNT(*) FROM parking_inserts) as parking_spots_created,
  (SELECT COUNT(*) FROM vehicle_inserts) as vehicles_created,
  (SELECT COUNT(*) FROM guest_inserts) as guest_visits_created;

