import type { Request, Poll, ResidentMock } from '@/types/community';

export const ITEMS_PER_PAGE = 10;

export const MOCK_RESIDENTS: ResidentMock[] = [
    { id: 'r1', name: 'Ahmet Yılmaz', unit: 'A-1' },
    { id: 'r2', name: 'Mehmet Demir', unit: 'A-2' },
    { id: 'r3', name: 'Ayşe Kaya', unit: 'A-3' },
    { id: 'r4', name: 'Caner Erkin', unit: 'B-1' },
    { id: 'r5', name: 'Zeynep Su', unit: 'B-2' },
    { id: 'r6', name: 'Selin Yılmaz', unit: 'C-1' },
    { id: 'r7', name: 'Ali Veli', unit: 'C-2' },
];

export const INITIAL_REQUESTS: Request[] = [
    {
        id: 'req-1',
        type: 'suggestion',
        title: 'Bisiklet Park Yeri',
        description: 'B Blok girişine kapalı bisiklet park yeri yapılmasını öneriyorum. Çocukların bisikletleri dışarıda paslanıyor.',
        author: 'Zeynep Su',
        unit: 'B-2',
        date: '2024-10-25',
        status: 'pending'
    },
    {
        id: 'req-2',
        type: 'wish',
        title: 'Kamelya İsteği',
        description: 'Arka bahçeye ek bir kamelya konulmasını rica ediyoruz, mevcut olan yetersiz kalıyor.',
        author: 'Mehmet Demir',
        unit: 'A-2',
        date: '2024-10-24',
        status: 'in-progress'
    },
    {
        id: 'req-3',
        type: 'suggestion',
        title: 'Çardak Yenilemesi',
        description: 'Bahçedeki çardakların boyanması ve ışıklandırılması güzel olurdu.',
        author: 'Ayşe Kaya',
        unit: 'A-3',
        date: '2024-10-20',
        status: 'resolved'
    },
];

export const GENERATED_REQUESTS: Request[] = Array.from({ length: 45 }, (_, i) => ({
    id: `gen-req-${i}`,
    type: Math.random() > 0.5 ? 'wish' : 'suggestion',
    title: `Otomatik Talep Başlığı ${i + 1}`,
    description: `Site yönetimi için oluşturulmuş otomatik talep veya öneri metni. Detaylar burada yer alır #${i + 1}.`,
    author: `Sakin ${i + 1}`,
    unit: `${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 10) + 1}`,
    date: '2024-10-15',
    status: (['pending', 'in-progress', 'resolved', 'rejected'] as const)[Math.floor(Math.random() * 4)]
}));

export const INITIAL_POLLS: Poll[] = [
    {
        id: 'poll-1',
        title: 'Dış Cephe Mantolama Kararı',
        description: 'Yönetim toplantısında görüşülen A Blok dış cephe mantolama işlemi için Filli Boya firmasından alınan 450.000₺\'lik teklifin kabulünü oylarınıza sunuyoruz.',
        author: 'Yönetim',
        startDate: '2024-10-26',
        endDate: '2024-11-05',
        status: 'active',
        votes: [
            { residentId: 'r1', residentName: 'Ahmet Yılmaz', choice: 'yes', timestamp: '2024-10-26 10:00' },
            { residentId: 'r2', residentName: 'Mehmet Demir', choice: 'no', timestamp: '2024-10-26 11:30' },
            { residentId: 'r4', residentName: 'Caner Erkin', choice: 'yes', timestamp: '2024-10-26 12:45' },
        ]
    },
    {
        id: 'poll-2',
        title: 'Havuz Kapanış Saati Değişikliği',
        description: 'Havuzun kapanış saatinin 22:00\'dan 23:00\'a uzatılması önerisi.',
        author: 'Zeynep Su',
        startDate: '2024-10-20',
        endDate: '2024-10-25',
        status: 'closed',
        votes: [
            { residentId: 'r1', residentName: 'Ahmet Yılmaz', choice: 'no', timestamp: '2024-10-20' },
            { residentId: 'r2', residentName: 'Mehmet Demir', choice: 'yes', timestamp: '2024-10-20' },
            { residentId: 'r3', residentName: 'Ayşe Kaya', choice: 'yes', timestamp: '2024-10-21' },
            { residentId: 'r5', residentName: 'Zeynep Su', choice: 'yes', timestamp: '2024-10-21' },
            { residentId: 'r6', residentName: 'Selin Yılmaz', choice: 'no', timestamp: '2024-10-22' },
        ]
    }
];

export const GENERATED_POLLS: Poll[] = Array.from({ length: 35 }, (_, i) => ({
    id: `gen-poll-${i}`,
    title: `Genel Kurul Kararı Oylaması #${i + 1}`,
    description: `Site bütçesi ve gelecek dönem planlamaları hakkında alınan kararların onaylanması.`,
    author: 'Yönetim',
    startDate: '2024-09-01',
    endDate: '2024-09-10',
    status: Math.random() > 0.3 ? 'closed' : 'active',
    votes: Array.from({ length: Math.floor(Math.random() * 30) }, (_, j) => ({
        residentId: `r-${j}`,
        residentName: `Sakin ${j}`,
        choice: Math.random() > 0.5 ? 'yes' : 'no',
        timestamp: '2024-09-02'
    }))
}));
