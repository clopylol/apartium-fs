-- Simple Seed Data for Apartium
-- Truncate all tables
TRUNCATE TABLE poll_votes, polls, community_requests, janitor_requests, janitor_block_assignments, janitors,
    announcements, maintenance_requests, courier_visits, expected_cargo, cargo_items,
    bookings, facilities, guest_visits, vehicles, parking_spots, payment_records, 
    expense_records, residents, units, buildings, transactions CASCADE;

-- Insert building
INSERT INTO buildings (name, address, floor_count) VALUES
('Gunes Apartmani', 'Ataturk Mahallesi, Gunes Sokak No: 42, Kadikoy/Istanbul', 5) RETURNING id \gset building_

-- Insert units
INSERT INTO units (building_id, number, floor, status) VALUES
(:building_id, '1', 1, 'occupied'),
(:building_id, '2', 1, 'occupied'),
(:building_id, '3', 2, 'occupied'),
(:building_id, '4', 2, 'occupied'),
(:building_id, '5', 3, 'occupied'),
(:building_id, '6', 3, 'empty'),
(:building_id, '7', 4, 'occupied'),
(:building_id, '8', 4, 'occupied'),
(:building_id, '9', 5, 'occupied'),
(:building_id, '10', 5, 'occupied');

-- Get unit IDs
SELECT id FROM units WHERE number = '1' AND building_id = :building_id \gset unit1_
SELECT id FROM units WHERE number = '2' AND building_id = :building_id \gset unit2_
SELECT id FROM units WHERE number = '3' AND building_id = :building_id \gset unit3_
SELECT id FROM units WHERE number = '4' AND building_id = :building_id \gset unit4_
SELECT id FROM units WHERE number = '5' AND building_id = :building_id \gset unit5_
SELECT id FROM units WHERE number = '7' AND building_id = :building_id \gset unit7_
SELECT id FROM units WHERE number = '8' AND building_id = :building_id \gset unit8_
SELECT id FROM units WHERE number = '9' AND building_id = :building_id \gset unit9_
SELECT id FROM units WHERE number = '10' AND building_id = :building_id \gset unit10_

-- Insert residents
INSERT INTO residents (unit_id, name, type, phone, email, avatar) VALUES
(:unit1_id, 'Ahmet Yilmaz', 'owner', '0532 111 2233', 'ahmet.yilmaz@gmail.com', 'https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=4F46E5&color=fff'),
(:unit2_id, 'Ayse Demir', 'owner', '0533 222 3344', 'ayse.demir@gmail.com', 'https://ui-avatars.com/api/?name=Ayse+Demir&background=EC4899&color=fff'),
(:unit3_id, 'Mehmet Kaya', 'tenant', '0534 333 4455', 'mehmet.kaya@gmail.com', 'https://ui-avatars.com/api/?name=Mehmet+Kaya&background=10B981&color=fff'),
(:unit4_id, 'Fatma Oz', 'owner', '0535 444 5566', 'fatma.oz@gmail.com', 'https://ui-avatars.com/api/?name=Fatma+Oz&background=F59E0B&color=fff'),
(:unit5_id, 'Ali Celik', 'tenant', '0536 555 6677', 'ali.celik@gmail.com', 'https://ui-avatars.com/api/?name=Ali+Celik&background=EF4444&color=fff'),
(:unit7_id, 'Zeynep Arslan', 'owner', '0537 666 7788', 'zeynep.arslan@gmail.com', 'https://ui-avatars.com/api/?name=Zeynep+Arslan&background=8B5CF6&color=fff'),
(:unit8_id, 'Can Yildiz', 'owner', '0538 777 8899', 'can.yildiz@gmail.com', 'https://ui-avatars.com/api/?name=Can+Yildiz&background=06B6D4&color=fff'),
(:unit9_id, 'Elif Sahin', 'tenant', '0539 888 9900', 'elif.sahin@gmail.com', 'https://ui-avatars.com/api/?name=Elif+Sahin&background=84CC16&color=fff'),
(:unit10_id, 'Burak Aydin', 'owner', '0530 999 0011', 'burak.aydin@gmail.com', 'https://ui-avatars.com/api/?name=Burak+Aydin&background=F97316&color=fff'),
(:unit1_id, 'Selin Yilmaz', 'owner', '0531 000 1122', 'selin.yilmaz@gmail.com', 'https://ui-avatars.com/api/?name=Selin+Yilmaz&background=DB2777&color=fff');

\echo 'Sakinler eklendi'

SELECT COUNT(*) || ' sakin eklendi' FROM residents;
