import type { CargoItem, ExpectedCargo, CourierVisit, MockResident } from "@/types/cargo.types";

export const ITEMS_PER_PAGE = 20;

export const MOCK_RESIDENTS: MockResident[] = [
  { id: "r1", name: "Ahmet Yılmaz", unit: "A-1" },
  { id: "r2", name: "Mehmet Demir", unit: "A-2" },
  { id: "r3", name: "Ayşe Kaya", unit: "A-3" },
  { id: "r4", name: "Caner Erkin", unit: "B-1" },
  { id: "r5", name: "Zeynep Su", unit: "B-2" },
  { id: "r6", name: "Selin Yılmaz", unit: "C-1" },
];

export const INITIAL_CARGO: CargoItem[] = [
  {
    id: "crg-1",
    trackingNo: "12345678901",
    carrier: "Yurtiçi Kargo",
    recipientName: "Ahmet Yılmaz",
    unit: "A-1",
    arrivalDate: "2024-10-25",
    arrivalTime: "10:30",
    status: "received",
    type: "Medium",
  },
  {
    id: "crg-2",
    trackingNo: "TR-99887766",
    carrier: "Aras Kargo",
    recipientName: "Zeynep Su",
    unit: "B-2",
    arrivalDate: "2024-10-25",
    arrivalTime: "11:45",
    status: "delivered",
    deliveredDate: "2024-10-25 18:30",
    type: "Small",
  },
  {
    id: "crg-3",
    trackingNo: "MNG-554433",
    carrier: "MNG Kargo",
    recipientName: "Caner Erkin",
    unit: "B-1",
    arrivalDate: "2024-10-24",
    arrivalTime: "09:15",
    status: "returned",
    type: "Large",
  },
  {
    id: "crg-4",
    trackingNo: "TY-11223344",
    carrier: "Trendyol Express",
    recipientName: "Selin Yılmaz",
    unit: "C-1",
    arrivalDate: "2024-10-26",
    arrivalTime: "14:20",
    status: "received",
    type: "Small",
  },
  {
    id: "crg-5",
    trackingNo: "UPS-998811",
    carrier: "UPS",
    recipientName: "Mehmet Demir",
    unit: "A-2",
    arrivalDate: "2024-10-26",
    arrivalTime: "15:00",
    status: "received",
    type: "Medium",
  },
];

export const INITIAL_EXPECTED: ExpectedCargo[] = [
  {
    id: "exp-1",
    residentName: "Ayşe Demir",
    unit: "A-3",
    trackingNo: "7788990011",
    carrier: "Trendyol Express",
    expectedDate: "2024-10-27",
    note: "Kargom gelince güvenliğe bırakılabilir.",
    createdAt: "2 saat önce",
  },
  {
    id: "exp-2",
    residentName: "Murat Can",
    unit: "B-4",
    trackingNo: "AA123456",
    carrier: "Yurtiçi Kargo",
    expectedDate: "2024-10-27",
    note: "Evde yokum, lütfen teslim alınız.",
    createdAt: "5 saat önce",
  },
];

export const INITIAL_COURIERS: CourierVisit[] = [
  {
    id: "cour-1",
    company: "Getir",
    residentName: "Ahmet Yılmaz",
    unit: "A-1",
    status: "inside",
    entryTime: "19:45",
    method: "app",
    plate: "34 AB 123",
  },
  {
    id: "cour-2",
    company: "Yemeksepeti",
    residentName: "Zeynep Su",
    unit: "B-2",
    status: "pending",
    method: "app",
    note: "Zili çalmasın, kapıya bıraksın.",
  },
  {
    id: "cour-3",
    company: "Trendyol Yemek",
    residentName: "Caner Erkin",
    unit: "B-1",
    status: "completed",
    entryTime: "18:15",
    exitTime: "18:25",
    method: "manual",
    plate: "06 ZT 99",
  },
];

export const CARRIERS = [
  "Yurtiçi Kargo",
  "Aras Kargo",
  "MNG Kargo",
  "Trendyol Express",
  "UPS",
  "DHL",
  "PTT Kargo",
  "Amazon Lojistik",
  "Diğer",
];

export const COURIER_COMPANIES = [
  "Getir",
  "Yemeksepeti",
  "Trendyol Yemek",
  "Migros Hemen",
  "Domino's",
  "Burger King",
  "Mahalle Esnafı",
  "Diğer",
];

