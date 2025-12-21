# Mobil Feature Set Dokümanı (Detaylı)

Her sayfa için: ana bloklar, akışlar, aksiyonlar, modallar, durum yönetimi, mobil uyarlama gereksinimleri ve notlar.

## Dashboard (`/`, `/dashboard`, `DashboardPage`)
- İçerik blokları: Kahraman (karşılama + tarih), hızlı aksiyonlar (Hızlı Aksiyon, Ödeme Al), 4 istatistik kartı (trend, ikon, varyant), gelir alan grafiği, yan listeler (Son Ödemeler, Bakım Talepleri), promo kart, Rezervasyonlar listesi, Kiracılar listesi.
- Veri/akış: Grafik `CHART_DATA_INCOME`; istatistik kartları statik; listeler mock veriden render; loading 2 sn simülasyon.
- Aksiyonlar: Hızlı Aksiyon butonu (placeholder), Ödeme Al CTA, grafik filtresi butonu, listeler üzerindeki satır CTA’ları (component içinde).
- Durumlar: Skeleton kart/grafik/liste, boş veri fallback (mock), loading timer.
- Mobil gereksinimleri: Tek sütun layout; istatistik kartları yatay kaydırma veya 2x2 grid; listeler için pull-to-refresh; promo kart tam genişlik banner; grafik için yatay scroll/tooltip erişimi; aksiyon butonları ≥44px; uzun selamlama metni satır kırmalı; üst paddings küçültülmeli.
- Ek: Hızlı aksiyonlar ve Ödeme Al için alt sabit action bar alternatifi; tarih/güncelleme için locale desteği korunmalı.

## Login (`/login`, `LoginPage`)
- İçerik: Başlık, Sign In butonu (basit).
- Akış: Tek CTA; form alanı yok (eklenebilir).
- Durumlar: Hata/success state tanımsız; loading yok.
- Mobil gereksinimleri: Tam ekran kart; klavye açılınca içerik yukarı kaymalı; SSO/OTP/biometrik seçenek alanı; hata mesajı alanı; “şifreyi unuttum”/“kayıt ol” link placeholder’ı; buton full-width.

## Duyurular (`/announcements`, `AnnouncementsPage`)
- İçerik blokları: İstatistik kartları (aktif, yüksek öncelik, planlı), filtreler (arama, durum, öncelik), duyuru listesi/tablo, sayfalama.
- Aksiyonlar: Yeni duyuru oluştur, düzenle, sil; filtre temizle; sayfa değiştir; inline düzenleme yok.
- Modallar: Duyuru form modalı (create/edit), silme onay modalı.
- Durumlar: Loading skeleton; boş liste; filtre sonrası boş; success/hata toast eksik.
- Mobil gereksinimleri: Filtreler bottom sheet/drawer; tablo -> kart liste; içerik kısalt + “devamını gör”; inline “yayınla/taslak” toggle; tarih seçici mobil; paginasyon yerine sonsuz kaydırma veya “daha fazla” butonu; kartta öncelik rozeti, yayın durumu, planlanan tarih; hızlı aksiyonlar (düzenle/sil) için slide action.

## Kiracılar & Otopark (`/tenants`, `ResidentsPage`)
- Sekmeler: Residents, Parking, Guests (tab toggle).
- Residents: Bina/blok seçimi, kart/list view, sayfalama; arama. Aksiyonlar: bina ekle/düzenle/sil, sakin ekle/düzenle/sil, araç yönetimi, blok ekle.
- Parking: Kat seçimi, yer ekle/düzenle/sil, yer atama (Assign Vehicle), kat yönetimi modalı; park yeri grid verisi.
- Guests: Ziyaretçi listesi, filtre, detay modalı; check-in/out onayı.
- Modallar: Add/Edit Resident; Vehicle Management; Add Block; Edit Block; Delete Confirm (bina/sakin); Parking Spot (create/edit/delete); Assign Vehicle; Add Guest; Guest Detail; Check-in/out confirm; Floor Management.
- Durumlar: Çoklu loading state; boş kat/daire için boş durum; doğrulama metinleri sınırlı.
- Mobil gereksinimleri: Sekmeler yatay kaydırmalı; büyük modallar tam ekran sheet; çok adımlı form (kimlik -> daire -> araç); park grid tek sütun; arama/filtre collapse; kartlarda hızlı aksiyon slide; toasts/onaylar görünür; sayfalama yerine “daha fazla” veya infinite scroll; misafir kartında plaka büyük tipografi, check-in/out birincil CTA.

## Kapıcı (`/janitor`, `JanitorPage`)
- Sekmeler: Staff, Requests.
- Staff: Liste/grid; sayfalama; ekle/düzenle/sil; staff form modalı; view mode toggle.
- Requests: Liste/grid; tür filtresi; durum sıralama; sayfalama; talep detay modalı; tamamla onayı.
- İstatistikler: total staff, onDuty, activeRequests.
- Modallar: StaffFormModal; RequestDetailModal; silme onayı; tamamla onayı.
- Durumlar: Loading state; boş liste için ayrı şablon yok; onay sonrası feedback toast yok.
- Mobil gereksinimleri: Kartlar tek sütun; request kartında durum rozetleri, atanan janitor ismi, saat/durum önde; tamamla CTA için swipe veya büyük buton; filtreler sheet; sayfalama yerine “daha fazla”; formlar çok adımlı; skeletonlar kısaltılmalı.

## Kargo (`/cargo`, `CargoPage`)
- Kategoriler: Cargo (inventory / expected), Courier (kuryeler).
- Filtreler: Arama, durum, kurye firması (courierFilter).
- Görünümler: Inventory tablo (teslim, iade); Expected kart grid (Quick Accept); Courier tablo (giriş/çıkış).
- Aksiyonlar: Kargo ekle/düzenle/dönüştür; beklenen kargoyu kabul; teslim/iade; kurye giriş/çıkış; kurye ekle; hızlı kabul CTA; status filter değişimi.
- Modallar: CargoFormModal; CourierFormModal (resident seçimi, manuel kurye toggle); Confirm modal (deliver/return/courier in/out).
- Durumlar: Loading; istatistik kartları; boş/hataya özel state yok (eklenmeli); confirm içerikleri dinamik.
- Mobil gereksinimleri: Tablo -> kart liste; expected kart tek sütun; aksiyonlar bottom sheet; büyük giriş/çıkış butonları; QR/etiket tarama butonu placeholder; offline kuyruğa alma (teslim/geri gönder); courier filter yatay chip; status badge renkleri korunmalı; pagination yerine infinite scroll.

## Bakım (`/maintenance`, `MaintenancePage`)
- Filtreler: Arama, durum, öncelik, kategori; view toggle (list/grid); sort toggle.
- İçerik: İstatistik kartları; list view tablo; grid view kart; sayfalama.
- Aksiyonlar: Yeni talep oluştur (NewRequestModal); durum güncelle; detay görüntüle; sort direction değiştir.
- Modallar: NewRequestModal; RequestDetailModal (durum güncelleme).
- Durumlar: Loading skeleton; boş veri; filtre sonrası “sonuç yok” banner; isEmpty ayrı senaryo.
- Mobil gereksinimleri: Filtre sheet; grid tek sütun; durum/öncelik rozetleri belirgin; form çok adımlı (kategori -> açıklama -> medya); tarih/öncelik picker native; sayfalama yerine lazy load; push bildirim tetik kancası; aksiyon butonları alt sabit çubukta opsiyonel.

## Ödemeler (`/payments`, `PaymentsPage`)
- Sekmeler: Gelir (income), Gider (expenses).
- Üst alan: Ay/Yıl seçimi; arama; tab toggle; arşiv (kilit) banner.
- Gelir akışı: İstatistikler; ödeme listesi/tablosu (seçilebilir); filtre chip’leri; bulk action bar (hatırlatma); ödeme durumu değişimi onay modalı; hatırlatma tekil/bulk; sıralama (sortOrder).
- Gider akışı: İstatistikler; gider ekleme; kategori bazlı grup listesi; silme onay modalı; expense cards.
- Modallar: DuesGeneratorModal (tahakkuk); AddExpenseModal; Payment Confirmation (pay/cancel); ExpenseConfirmationModal.
- Durumlar: Loading skeleton; gelir boş state; gider boş state; hata state ve retry butonu; arşiv uyarısı (kilit).
- Mobil gereksinimleri: Tablo -> kart liste; uzun basma ile çoklu seçim; bulk bar alt sabit; ay/yıl native picker; grup listeleri accordion; sticky CTA (dues/create expense); para formatı büyük tipografi; hatırlatma/ödeme için swipe actions; sonsuz kaydırma veya “daha fazla”.

## Rezervasyonlar (`/bookings`, `BookingsPage`)
- Bölümler: Tesis kartları listesi (aktif tab ve sayaç), rezervasyon listesi veya takvim görünümü.
- Filtreler: Arama; tesis tab; view toggle (list / calendar week start).
- Aksiyonlar: Rezervasyon oluştur (tesis, isim, tarih, başlangıç-bitiş saat); onayla; reddet (sebep modalı); finalize booking; tesis ekle/düzenle/sil.
- Modallar: BookingModal (form); BookingConfirmationModal (özet + onay); RejectionModal (sebep); FacilityModal (tesis formu).
- Durumlar: Loading; boş veri; rezervasyon sayacı; hata durumu tanımlı değil.
- Mobil gereksinimleri: Takvim haftalık şerit; time picker native; kartlarda durum etiketi; CTA’lar alt sabit; tesise göre yatay chip; rezervasyon kartlarında saat aralığı büyük; sonsuz kaydırma tercih; modallar tam ekran sheet; saat seçimi için scrollable picker.

## Finansal Raporlar (`/reports`, `ReportsPage`)
- İçerik: KPI kartları; gelir/gider alan grafiği; gider dağılımı donut; işlem tablosu/kartları.
- Filtre: Transaction filter (all/income/expense); tarih aralığı “Bu Yıl” sabit.
- Aksiyonlar: Filtre değişimi; tablo/işlem listesi görüntüleme; grafik tooltip.
- Durumlar: Skeleton kart/grafik; veri boşsa tablo boş; loading timer.
- Mobil gereksinimleri: Grafikler yatay kaydırmalı + dokunmatik tooltip; donut/alan grafiği min yükseklik; işlemler kart listesi; filtre chip’leri yatay kaydırma; tablo yerine kompakt kart; KPI kartları yatay scroll.

## Design System (`/design-system`, `DesignSystemPage`)
- İçerik: Button varyant/size/state; icon button; chip group; button group; inputs; tab toggle; info banner; status badges; pagination; skeleton örnekleri; cargo-specific kart; confirmation modal varyantları; empty states; kod örnekleri.
- Aksiyonlar: Buton/ikon demo; kod kopyalama (metin halinde); confirm modal tetikleme.
- Durumlar: Loading demo (setTimeout).
- Mobil gereksinimleri: Uzun sayfa için içerik indeksi veya accordion; örnekler tek sütun; “kodu kopyala” butonu ekleme alanı; bileşen kart yüksekliklerini küçült; mobilde full-width buton ve bottom sheet varyantı örnekleri eklenebilir; sticky mini TOC.

## Placeholder Sayfalar (`/community`, `/settings`, `/security-login`, `PlaceholderPage`)
- İçerik: Başlık + “geliştirme aşamasında”.
- Mobil gereksinimleri: Standart boş durum şablonu; geri/ana sayfa CTA; güvenlik sayfasında QR/kapı paneli giriş placeholder; yumuşak boşluk ve ikonlu boş durum.

## Genel Mobil Öneriler
- Navigasyon: Alt bar veya hamburger + hızlı erişim (Dashboard, Kargo, Ödemeler, Bakım, Rezervasyonlar); kritik sayfalara kısayol.
- Filtre/arama: Bottom sheet veya side drawer; chip’ler yatay kaydırmalı; arama alanı sticky.
- Listeler: Kart bazlı; swipe actions (tamamla/ödeme/teslim); kompakt padding; skeleton’lar kısa.
- Formlar: Çok adımlı wizard; tarih/saat/para için native picker; inline hata; başarı/başarısız toast.
- Durum yönetimi: Her sayfa için loading/empty/error net mesaj + aksiyon; retry butonu; boş durum ilham verici CTA.
- Bildirimler: Kritik aksiyonlarda modal onayı; tamamlandı/başarısız için toast/snackbar; önemli işlerde çift onay.
- Erişilebilirlik: Dokunma hedefi ≥44px; kontrast token’ları; odak halkası; dinamik font desteği; voice-over etiketleri.
- Offline/düşük bant: Kritik aksiyonları kuyrukla (kargo teslim, ödeme güncelleme, rezervasyon); “yeniden dene” butonu; hafif placeholder; senkronizasyon uyarıları.
