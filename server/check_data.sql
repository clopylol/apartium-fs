-- A Blok kontrolü
SELECT 'Buildings:' as info;
SELECT id, name, address, floor_count FROM buildings WHERE name = 'A Blok';

-- Daireler
SELECT '\nUnits:' as info;
SELECT u.number, u.floor, u.status, b.name as building
FROM units u
JOIN buildings b ON u.building_id = b.id
WHERE b.name = 'A Blok'
ORDER BY u.floor, u.number;

-- Sakinler
SELECT '\nResidents:' as info;
SELECT r.name, r.type, r.phone, u.number as unit
FROM residents r
JOIN units u ON r.unit_id = u.id
JOIN buildings b ON u.building_id = b.id
WHERE b.name = 'A Blok'
ORDER BY u.number;

-- Araçlar
SELECT '\nVehicles:' as info;
SELECT v.plate, v.model, r.name as owner, ps.name as parking_spot
FROM vehicles v
JOIN residents r ON v.resident_id = r.id
LEFT JOIN parking_spots ps ON v.parking_spot_id = ps.id
JOIN units u ON r.unit_id = u.id
JOIN buildings b ON u.building_id = b.id
WHERE b.name = 'A Blok';

-- Misafirler
SELECT '\nGuest Visits:' as info;
SELECT gv.plate, gv.guest_name, gv.status, gv.expected_date, u.number as unit
FROM guest_visits gv
JOIN units u ON gv.unit_id = u.id
JOIN buildings b ON u.building_id = b.id
WHERE b.name = 'A Blok'
ORDER BY gv.status;
