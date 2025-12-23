-- Community Test Data
-- Bu dosya community_requests, polls ve poll_votes tablolarına test verisi ekler

-- Önce mevcut test verilerini temizle (opsiyonel)
-- DELETE FROM poll_votes WHERE poll_id IN (SELECT id FROM polls WHERE title LIKE 'Test%');
-- DELETE FROM polls WHERE title LIKE 'Test%';
-- DELETE FROM community_requests WHERE title LIKE 'Test%';

-- Test için resident ve unit ID'leri (mevcut verilerden)
-- Eğer yoksa önce bir resident oluşturmalısınız

-- Community Requests (İstek/Öneri)
INSERT INTO community_requests (id, author_id, unit_id, type, title, description, status, request_date, created_at, updated_at)
VALUES 
  -- Pending Wishes
  (gen_random_uuid(), 
   (SELECT id FROM residents LIMIT 1), 
   (SELECT id FROM units LIMIT 1), 
   'wish', 
   'Çocuk Oyun Alanı Yenileme', 
   'Sitenin çocuk oyun alanındaki ekipmanlar eskidi ve yenilenmesi gerekiyor. Özellikle salıncak ve kaydırakların bakıma ihtiyacı var.',
   'pending',
   NOW(),
   NOW(),
   NOW()),
   
  (gen_random_uuid(), 
   (SELECT id FROM residents LIMIT 1 OFFSET 1), 
   (SELECT id FROM units LIMIT 1 OFFSET 1), 
   'wish', 
   'Otopark Aydınlatması', 
   'Kapalı otoparkın aydınlatması yetersiz. Özellikle akşam saatlerinde görüş zorluğu yaşanıyor.',
   'pending',
   NOW() - INTERVAL '2 days',
   NOW() - INTERVAL '2 days',
   NOW() - INTERVAL '2 days'),

  -- In-Progress Suggestions
  (gen_random_uuid(), 
   (SELECT id FROM residents LIMIT 1 OFFSET 2), 
   (SELECT id FROM units LIMIT 1 OFFSET 2), 
   'suggestion', 
   'Bisiklet Park Alanı', 
   'Site girişine bisiklet park alanı yapılması önerisi. Hem güvenli hem de düzenli bir alan olması için gerekli.',
   'in-progress',
   NOW() - INTERVAL '5 days',
   NOW() - INTERVAL '5 days',
   NOW() - INTERVAL '1 day'),

  -- Resolved Requests
  (gen_random_uuid(), 
   (SELECT id FROM residents LIMIT 1), 
   (SELECT id FROM units LIMIT 1), 
   'wish', 
   'Asansör Bakımı', 
   'A blok asansörü sık sık arızalanıyor. Düzenli bakım yapılması gerekiyor.',
   'resolved',
   NOW() - INTERVAL '10 days',
   NOW() - INTERVAL '10 days',
   NOW() - INTERVAL '1 day'),

  -- Rejected Request
  (gen_random_uuid(), 
   (SELECT id FROM residents LIMIT 1 OFFSET 1), 
   (SELECT id FROM units LIMIT 1 OFFSET 1), 
   'suggestion', 
   'Havuz Isıtma Sistemi', 
   'Havuzun ısıtma sistemi ile kış aylarında da kullanılabilir hale getirilmesi.',
   'rejected',
   NOW() - INTERVAL '15 days',
   NOW() - INTERVAL '15 days',
   NOW() - INTERVAL '3 days');

-- Polls (Anketler)
INSERT INTO polls (id, author_id, title, description, start_date, end_date, status, created_at, updated_at)
VALUES 
  -- Active Poll 1
  (gen_random_uuid(), 
   (SELECT id FROM residents LIMIT 1), 
   'Yaz Aylarında Havuz Saatleri', 
   'Yaz aylarında havuz kullanım saatlerinin 22:00''e kadar uzatılması hakkında ne düşünüyorsunuz?',
   NOW() - INTERVAL '2 days',
   NOW() + INTERVAL '5 days',
   'active',
   NOW() - INTERVAL '2 days',
   NOW() - INTERVAL '2 days'),

  -- Active Poll 2
  (gen_random_uuid(), 
   (SELECT id FROM residents LIMIT 1 OFFSET 1), 
   'Ortak Alan Kullanım Ücreti', 
   'Spor salonu ve sosyal tesis kullanımı için aylık 50 TL ücret alınması önerisi.',
   NOW() - INTERVAL '1 day',
   NOW() + INTERVAL '6 days',
   'active',
   NOW() - INTERVAL '1 day',
   NOW() - INTERVAL '1 day'),

  -- Closed Poll
  (gen_random_uuid(), 
   (SELECT id FROM residents LIMIT 1 OFFSET 2), 
   'Site Girişine Güvenlik Kamerası', 
   'Site giriş ve çıkışlarına ek güvenlik kamerası konulması.',
   NOW() - INTERVAL '20 days',
   NOW() - INTERVAL '13 days',
   'closed',
   NOW() - INTERVAL '20 days',
   NOW() - INTERVAL '13 days');

-- Poll Votes (Anket Oyları)
-- İlk anket için oylar
INSERT INTO poll_votes (id, poll_id, resident_id, choice, created_at)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM polls WHERE title = 'Yaz Aylarında Havuz Saatleri' LIMIT 1),
  r.id,
  CASE 
    WHEN random() > 0.4 THEN 'yes'::enum_vote_choice
    ELSE 'no'::enum_vote_choice
  END,
  NOW() - (random() * INTERVAL '2 days')
FROM residents r
LIMIT 5;

-- İkinci anket için oylar
INSERT INTO poll_votes (id, poll_id, resident_id, choice, created_at)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM polls WHERE title = 'Ortak Alan Kullanım Ücreti' LIMIT 1),
  r.id,
  CASE 
    WHEN random() > 0.6 THEN 'yes'::enum_vote_choice
    ELSE 'no'::enum_vote_choice
  END,
  NOW() - (random() * INTERVAL '1 day')
FROM residents r
LIMIT 3;

-- Kapalı anket için oylar
INSERT INTO poll_votes (id, poll_id, resident_id, choice, created_at)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM polls WHERE title = 'Site Girişine Güvenlik Kamerası' LIMIT 1),
  r.id,
  CASE 
    WHEN random() > 0.3 THEN 'yes'::enum_vote_choice
    ELSE 'no'::enum_vote_choice
  END,
  NOW() - INTERVAL '14 days' - (random() * INTERVAL '6 days')
FROM residents r
LIMIT 8;

-- Sonuçları kontrol et
SELECT 'Community Requests:', COUNT(*) FROM community_requests WHERE deleted_at IS NULL;
SELECT 'Polls:', COUNT(*) FROM polls WHERE deleted_at IS NULL;
SELECT 'Poll Votes:', COUNT(*) FROM poll_votes;

