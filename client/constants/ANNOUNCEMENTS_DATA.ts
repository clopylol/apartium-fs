import type { Announcement } from "@/types/Announcement.types";

export const ITEMS_PER_PAGE = 10;

export const BASE_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 'a1',
        title: 'Yıllık Yangın Güvenliği Denetimi',
        content: 'Tüm bloklarda yıllık yangın güvenliği denetimi yapılacaktır. Lütfen belirtilen saatlerde evde bulununuz.',
        priority: 'High',
        visibility: 'All Residents',
        status: 'Published',
        publishDate: '2024-10-26'
    },
    {
        id: 'a2',
        title: 'Havuz Bakım Çalışması',
        content: 'Açık yüzme havuzu klorlama ve filtre değişimi nedeniyle 2 gün kapalı kalacaktır.',
        priority: 'Medium',
        visibility: 'Building A',
        status: 'Scheduled',
        publishDate: '2024-10-28'
    },
    {
        id: 'a3',
        title: 'Yeni Geri Dönüşüm Programı',
        content: 'Sitemizde sıfır atık projesi kapsamında yeni geri dönüşüm kutuları yerleştirilmiştir.',
        priority: 'Low',
        visibility: 'All Residents',
        status: 'Published',
        publishDate: '2024-10-25'
    },
    {
        id: 'a4',
        title: 'Bayram Tatili Yönetim Ofisi Saatleri',
        content: 'Bayram tatili süresince yönetim ofisi kapalı olacaktır. Acil durumlar için güvenlik ile iletişime geçiniz.',
        priority: 'Medium',
        visibility: 'All Residents',
        status: 'Draft',
        publishDate: '2024-11-15'
    },
    {
        id: 'a5',
        title: 'Kargo Odası Güncellemesi',
        content: 'Kargo odası raf sistemi yenilenmiştir. Lütfen paketlerinizi alırken numara sırasına dikkat ediniz.',
        priority: 'Low',
        visibility: 'All Residents',
        status: 'Published',
        publishDate: '2024-10-22'
    }
];

export const GENERATED_ANNOUNCEMENTS: Announcement[] = Array.from({ length: 35 }, (_, i) => ({
    id: `gen-ann-${i}`,
    title: `Site Yönetimi Duyurusu #${i + 1}`,
    content: 'Bu, sistem tarafından oluşturulan örnek bir duyuru metnidir. Site sakinlerini bilgilendirmek amaçlıdır.',
    priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as Announcement['priority'],
    visibility: ['All Residents', 'Building A', 'Building B'][Math.floor(Math.random() * 3)] as Announcement['visibility'],
    status: ['Published', 'Scheduled', 'Draft'][Math.floor(Math.random() * 3)] as Announcement['status'],
    publishDate: '2024-10-10'
}));

export const INITIAL_ANNOUNCEMENTS = [...BASE_ANNOUNCEMENTS, ...GENERATED_ANNOUNCEMENTS];
