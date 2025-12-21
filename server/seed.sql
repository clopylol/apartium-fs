-- Apartium Test Verisi (Seed Data)
-- Mevcut verileri temizle
TRUNCATE TABLE 
    poll_votes, polls, community_requests, janitor_requests, janitor_block_assignments, janitors,
    announcements, maintenance_requests, courier_visits, expected_cargo, cargo_items,
    bookings, facilities, guest_visits, vehicles, parking_spots, payment_records, 
    expense_records, residents, units, buildings, transactions
CASCADE;

-- 1. BUILDINGS
INSERT INTO buildings (name, address, floor_count) VALUES
('Gunes Apartmani', 'Ataturk Mahallesi, Gunes Sokak No: 42, Kadikoy/Istanbul', 5);

-- 2. UNITS
INSERT INTO units (building_id, number, floor, status) 
SELECT b.id, v.number, v.floor, v.status::enum_unit_status FROM buildings b CROSS JOIN (VALUES
  ('1', 1, 'occupied'),
  ('2', 1, 'occupied'),
  ('3', 2, 'occupied'),
  ('4', 2, 'occupied'),
  ('5', 3, 'occupied'),
  ('6', 3, 'empty'),
  ('7', 4, 'occupied'),
  ('8', 4, 'occupied'),
  ('9', 5, 'occupied'),
  ('10', 5, 'occupied')
) AS v(number, floor, status)
WHERE b.name = 'Gunes Apartmani';

-- 3. RESIDENTS
INSERT INTO residents (unit_id, name, type, phone, email, avatar)
SELECT u.id, v.name, v.type::enum_resident_type, v.phone, v.email, v.avatar 
FROM units u
JOIN (VALUES
  ('1', 'Ahmet Yilmaz', 'owner', '0532 111 2233', 'ahmet.yilmaz@gmail.com', 'https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=4F46E5&color=fff'),
  ('1', 'Selin Yilmaz', 'owner', '0531 000 1122', 'selin.yilmaz@gmail.com', 'https://ui-avatars.com/api/?name=Selin+Yilmaz&background=DB2777&color=fff'),
  ('2', 'Ayse Demir', 'owner', '0533 222 3344', 'ayse.demir@gmail.com', 'https://ui-avatars.com/api/?name=Ayse+Demir&background=EC4899&color=fff'),
  ('3', 'Mehmet Kaya', 'tenant', '0534 333 4455', 'mehmet.kaya@gmail.com', 'https://ui-avatars.com/api/?name=Mehmet+Kaya&background=10B981&color=fff'),
  ('4', 'Fatma Oz', 'owner', '0535 444 5566', 'fatma.oz@gmail.com', 'https://ui-avatars.com/api/?name=Fatma+Oz&background=F59E0B&color=fff'),
  ('5', 'Ali Celik', 'tenant', '0536 555 6677', 'ali.celik@gmail.com', 'https://ui-avatars.com/api/?name=Ali+Celik&background=EF4444&color=fff'),
  ('7', 'Zeynep Arslan', 'owner', '0537 666 7788', 'zeynep.arslan@gmail.com', 'https://ui-avatars.com/api/?name=Zeynep+Arslan&background=8B5CF6&color=fff'),
  ('8', 'Can Yildiz', 'owner', '0538 777 8899', 'can.yildiz@gmail.com', 'https://ui-avatars.com/api/?name=Can+Yildiz&background=06B6D4&color=fff'),
  ('9', 'Elif Sahin', 'tenant', '0539 888 9900', 'elif.sahin@gmail.com', 'https://ui-avatars.com/api/?name=Elif+Sahin&background=84CC16&color=fff'),
  ('10', 'Burak Aydin', 'owner', '0530 999 0011', 'burak.aydin@gmail.com', 'https://ui-avatars.com/api/?name=Burak+Aydin&background=F97316&color=fff')
) AS v(unit_number, name, type, phone, email, avatar) ON u.number = v.unit_number;

-- 4. PARKING SPOTS
INSERT INTO parking_spots (building_id, name, floor, status)
SELECT b.id, v.name, v.floor, v.status FROM buildings b CROSS JOIN (VALUES
  ('A1', -1, 'occupied'),
  ('A2', -1, 'occupied'),
  ('A3', -1, 'occupied'),
  ('A4', -1, 'occupied'),
  ('A5', -1, 'occupied'),
  ('B1', -1, 'available'),
  ('B2', -1, 'available'),
  ('B3', -1, 'available'),
  ('B4', -1, 'available'),
  ('B5', -1, 'available')
) AS v(name, floor, status)
WHERE b.name = 'Gunes Apartmani';

-- 5. VEHICLES
INSERT INTO vehicles (resident_id, parking_spot_id, plate, model)
SELECT r.id, p.id, v.plate, v.model
FROM residents r
JOIN (VALUES
  ('Ahmet Yilmaz', 'A1', '34 ABC 123', 'BMW 3.20i'),
  ('Ayse Demir', 'A2', '34 XYZ 456', 'Mercedes C200'),
  ('Fatma Oz', 'A3', '34 DEF 789', 'Audi A4'),
  ('Zeynep Arslan', 'A4', '34 GHI 012', 'Volkswagen Passat'),
  ('Can Yildiz', 'A5', '34 JKL 345', 'Honda Civic'),
  ('Burak Aydin', NULL, '34 MNO 678', 'Toyota Corolla')
) AS v(r_name, p_name, plate, model) ON r.name = v.r_name
LEFT JOIN parking_spots p ON p.name = v.p_name;

-- 6. PAYMENT RECORDS
INSERT INTO payment_records (resident_id, unit_id, amount, type, status, payment_date, period_month, period_year)
SELECT r.id, r.unit_id, v.amount, v.type::enum_payment_type, v.status::enum_payment_status, v.p_date::timestamp, 'Ocak', 2025
FROM residents r
JOIN (VALUES
  ('Ahmet Yilmaz', 1500.00, 'aidat', 'paid', '2025-01-05'),
  ('Ayse Demir', 1500.00, 'aidat', 'paid', '2025-01-07'),
  ('Mehmet Kaya', 1500.00, 'aidat', 'unpaid', NULL),
  ('Fatma Oz', 1500.00, 'aidat', 'paid', '2025-01-10'),
  ('Ali Celik', 1500.00, 'aidat', 'unpaid', NULL),
  ('Zeynep Arslan', 1800.00, 'aidat', 'paid', '2025-01-03'),
  ('Can Yildiz', 1500.00, 'aidat', 'paid', '2025-01-12'),
  ('Elif Sahin', 1500.00, 'aidat', 'unpaid', NULL),
  ('Burak Aydin', 2000.00, 'aidat', 'paid', '2025-01-02'),
  ('Ahmet Yilmaz', 500.00, 'demirbas', 'paid', '2025-01-15')
) AS v(r_name, amount, type, status, p_date) ON r.name = v.r_name;

-- 7. EXPENSE RECORDS
INSERT INTO expense_records (title, category, amount, expense_date, status, description, period_month, period_year) VALUES
('Elektrik Faturasi', 'utilities', 3500.00, '2025-01-10', 'paid', 'Apartman ortak alan elektrik gideri', 'Ocak', 2025),
('Su Faturasi', 'utilities', 2200.00, '2025-01-10', 'paid', 'Apartman su tuketimi', 'Ocak', 2025),
('Dogalgaz Faturasi', 'utilities', 4800.00, '2025-01-12', 'pending', 'Merkezi isitma dogalgaz gideri', 'Ocak', 2025),
('Asansor Bakimi', 'maintenance', 1500.00, '2025-01-15', 'paid', '3 aylik periyodik bakim', 'Ocak', 2025),
('Temizlik Personeli Maasi', 'personnel', 12000.00, '2025-01-01', 'paid', 'Kapici ve temizlik gorevlisi maaslar', 'Ocak', 2025),
('Bahce Bakimi', 'maintenance', 800.00, '2025-01-20', 'pending', 'Cim bicme ve agac budama', 'Ocak', 2025),
('Yangin Tupu Dolumu', 'general', 600.00, '2025-01-18', 'paid', 'Tum katlardaki yangin tuplerinin dolumu', 'Ocak', 2025);

-- 8. FACILITIES
INSERT INTO facilities (name, image_url, status, hours, capacity, requires_booking, price_per_hour) VALUES
('Kapali Yuzme Havuzu', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7', 'open', '09:00 - 21:00', 20, true, 0),
('Spor Salonu', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', 'open', '06:00 - 23:00', 15, false, 0),
('Cocuk Oyun Parki', 'https://images.unsplash.com/photo-1587845750326-191b59a8e592', 'open', '08:00 - 20:00', 30, false, 0),
('Toplanti Salonu', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72', 'open', '09:00 - 22:00', 50, true, 100);

-- 9. BOOKINGS
INSERT INTO bookings (facility_id, resident_id, unit_id, booking_date, start_time, end_time, status, note)
SELECT f.id, r.id, r.unit_id, v.b_date::date, v.s_time::time, v.e_time::time, v.stat::enum_booking_status, v.note
FROM residents r
JOIN facilities f ON 1=1
JOIN (VALUES
  ('Ahmet Yilmaz', 'Kapali Yuzme Havuzu', '2025-01-25', '10:00', '11:00', 'confirmed', 'Cocuk yuzme dersi'),
  ('Fatma Oz', 'Toplanti Salonu', '2025-01-28', '18:00', '22:00', 'confirmed', 'Dogum gunu partisi'),
  ('Zeynep Arslan', 'Kapali Yuzme Havuzu', '2025-01-26', '15:00', '16:00', 'pending', NULL),
  ('Can Yildiz', 'Toplanti Salonu', '2025-01-30', '14:00', '17:00', 'confirmed', 'Aile toplantisi'),
  ('Burak Aydin', 'Kapali Yuzme Havuzu', '2025-02-01', '09:00', '10:00', 'cancelled', 'Iptal edildi')
) AS v(r_name, f_name, b_date, s_time, e_time, stat, note) ON r.name = v.r_name AND f.name = v.f_name;

-- 10. CARGO ITEMS
INSERT INTO cargo_items (recipient_id, unit_id, tracking_no, carrier, arrival_date, arrival_time, status, cargo_type)
SELECT r.id, r.unit_id, v.tracking, v.carrier, v.arr_date::date, v.arr_time::time, v.stat::enum_cargo_status, v.c_type::enum_cargo_type
FROM residents r
JOIN (VALUES
  ('Ahmet Yilmaz', 'TK123456789', 'MNG Kargo', '2025-01-15', '14:30', 'delivered', 'Medium'),
  ('Ayse Demir', 'YK987654321', 'Yurtici Kargo', '2025-01-16', '10:15', 'delivered', 'Small'),
  ('Mehmet Kaya', 'AX456789123', 'Aras Kargo', '2025-01-18', '16:45', 'received', 'Large'),
  ('Ali Celik', NULL, 'PTT Kargo', '2025-01-19', '11:20', 'received', 'Medium'),
  ('Can Yildiz', 'SN741852963', 'Surat Kargo', '2025-01-20', '09:30', 'received', 'Small'),
  ('Burak Aydin', 'HP159753486', 'HepsiJet', '2025-01-21', '15:00', 'received', 'Medium')
) AS v(r_name, tracking, carrier, arr_date, arr_time, stat, c_type) ON r.name = v.r_name;

-- 11. MAINTENANCE REQUESTS
INSERT INTO maintenance_requests (resident_id, unit_id, title, category, priority, status, request_date)
SELECT r.id, r.unit_id, v.title, v.cat::enum_maintenance_category, v.pri::enum_maintenance_priority, v.stat::enum_maintenance_status, v.req_date::timestamp
FROM residents r
JOIN (VALUES
  ('Ahmet Yilmaz', 'Musluk Sizintisi', 'Tesisat', 'Medium', 'Completed', '2025-01-10'),
  ('Mehmet Kaya', 'Priz Calismiyor', 'Elektrik', 'High', 'In Progress', '2025-01-18'),
  ('Ali Celik', 'Kalorifer Isinmiyor', 'Isıtma/Soğutma', 'Urgent', 'New', '2025-01-20'),
  ('Zeynep Arslan', 'Kapi Kolu Kirik', 'Genel', 'Low', 'New', '2025-01-17'),
  ('Elif Sahin', 'Klima Bakimi', 'Isıtma/Soğutma', 'Medium', 'Completed', '2025-01-12'),
  ('Burak Aydin', 'Elektrik Kacagi', 'Elektrik', 'Urgent', 'In Progress', '2025-01-19')
) AS v(r_name, title, cat, pri, stat, req_date) ON r.name = v.r_name;

-- 12. ANNOUNCEMENTS
INSERT INTO announcements (author_id, title, content, priority, visibility, status, publish_date)
SELECT u.id, v.title, v.content, v.pri::enum_announcement_priority, v.vis, v.stat::enum_announcement_status, v.pub_date::timestamp
FROM users u
JOIN (VALUES
  ('admin@apartium.com', 'Aidat Odemeleri Hatirlatmasi', 'Ocak ayi aidat odemeleri hatirlatmasi.', 'High', 'All Residents', 'Published', '2025-01-01'),
  ('admin@apartium.com', 'Asansor Bakimi', 'Periyodik asansor bakimi yapılacaktır.', 'Medium', 'All Residents', 'Published', '2025-01-10')
) AS v(email, title, content, pri, vis, stat, pub_date) ON u.email = v.email;

-- 13. JANITORS
INSERT INTO janitors (name, phone, avatar, status, tasks_completed) VALUES
('Hasan Celik', '0545 123 4567', 'https://ui-avatars.com/api/?name=Hasan+Celik&background=3B82F6&color=fff', 'on-duty', 145),
('Ayse Kara', '0546 234 5678', 'https://ui-avatars.com/api/?name=Ayse+Kara&background=EC4899&color=fff', 'off-duty', 98);

-- 14. JANITOR BLOCK ASSIGNMENTS
INSERT INTO janitor_block_assignments (janitor_id, building_id)
SELECT j.id, b.id FROM janitors j, buildings b WHERE b.name = 'Gunes Apartmani';

-- 15. JANITOR REQUESTS
INSERT INTO janitor_requests (resident_id, unit_id, building_id, assigned_janitor_id, type, status, note)
SELECT r.id, r.unit_id, b.id, j.id, v.type::enum_janitor_request_type, v.stat::enum_janitor_request_status, v.note
FROM residents r
JOIN buildings b ON b.name = 'Gunes Apartmani'
JOIN janitors j ON 1=1
JOIN (VALUES
  ('Ahmet Yilmaz', 'Hasan Celik', 'trash', 'completed', 'Mobilya atigi'),
  ('Mehmet Kaya', 'Hasan Celik', 'market', 'pending', 'Alisveris'),
  ('Ali Celik', 'Ayse Kara', 'bread', 'completed', 'Ekmek')
) AS v(r_name, j_name, type, stat, note) ON r.name = v.r_name AND j.name = v.j_name;

-- 16. COMMUNITY REQUESTS
INSERT INTO community_requests (author_id, unit_id, type, title, description, status)
SELECT r.id, r.unit_id, v.type::enum_community_request_type, v.title, v.descr, v.stat::enum_community_request_status
FROM residents r
JOIN (VALUES
  ('Ahmet Yilmaz', 'suggestion', 'Bisiklet Parki', 'Bisiklet alani onerisi', 'in-progress'),
  ('Fatma Oz', 'wish', 'Oyun Alani', 'Oyun alani genisletme', 'pending')
) AS v(r_name, type, title, descr, stat) ON r.name = v.r_name;

-- 17. POLLS
INSERT INTO polls (author_id, title, description, start_date, end_date, status)
SELECT r.id, v.title, v.descr, v.s_date::timestamp, v.e_date::timestamp, v.stat::enum_poll_status
FROM residents r
JOIN (VALUES
  ('Ahmet Yilmaz', 'Spor Alimi', 'Yeni spor aletleri alinsin mi?', '2025-01-15', '2025-01-30', 'active'),
  ('Fatma Oz', 'Toplanti Gunu', 'Pazar olsun mu?', '2025-01-10', '2025-01-25', 'active')
) AS v(r_name, title, descr, s_date, e_date, stat) ON r.name = v.r_name;

-- 18. TRANSACTIONS
INSERT INTO transactions (description, category, sub_category, transaction_date, amount, status) VALUES
('Aidat Tahsilatlari', 'Gelir', 'Aidat', '2025-01-31', 13300.00, 'completed'),
('Elektrik Odeme', 'Gider', 'Faturalar', '2025-01-10', 3500.00, 'completed');

-- 19. GUEST VISITS
INSERT INTO guest_visits (unit_id, parking_spot_id, plate, guest_name, model, color, status, source, expected_date, duration_days, note)
SELECT u.id, p.id, v.plate, v.name, v.model, v.color, v.stat::enum_guest_visit_status, v.src::enum_guest_visit_source, v.e_date::date, v.dur, v.note
FROM units u
JOIN (VALUES
  ('1', '06 XYZ 123', 'Mert Bakir', 'Renault', 'Beyaz', 'active', 'app', '2025-01-22', 2, 'Ziyaret')
) AS v(u_num, plate, name, model, color, stat, src, e_date, dur, note) ON u.number = v.u_num
LEFT JOIN parking_spots p ON p.name = 'B1';

-- SONUC
SELECT 'Seed tamamlandı' as status;
