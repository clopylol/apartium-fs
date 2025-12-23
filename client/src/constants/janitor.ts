import type { Janitor, JanitorRequest } from "@/types/janitor.types";

export const ITEMS_PER_PAGE = 20;

export const BLOCKS = ["A Blok", "B Blok", "C Blok", "D Blok"];

export const INITIAL_JANITORS: Janitor[] = [
  {
    id: "j1",
    name: "Hüseyin Yılmaz",
    phone: "0532 123 45 67",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
    assignedBlocks: ["A Blok", "B Blok"],
    status: "on-duty",
    tasksCompleted: 145,
  },
  {
    id: "j2",
    name: "Mustafa Demir",
    phone: "0533 987 65 43",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100",
    assignedBlocks: ["C Blok"],
    status: "on-duty",
    tasksCompleted: 89,
  },
  {
    id: "j3",
    name: "İsmail Kaya",
    phone: "0555 444 33 22",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100",
    assignedBlocks: ["D Blok"],
    status: "off-duty",
    tasksCompleted: 210,
  },
];

const BASE_REQUESTS: JanitorRequest[] = [
  {
    id: "req-1",
    residentName: "Ayşe Hanım",
    phone: "0532 555 11 22",
    unit: "A-5",
    blockId: "A Blok",
    type: "trash",
    status: "pending",
    openedAt: "10:30",
    note: "Kapının önüne bıraktım.",
  },
  {
    id: "req-2",
    residentName: "Mehmet Bey",
    phone: "0533 444 22 11",
    unit: "B-12",
    blockId: "B Blok",
    type: "market",
    status: "pending",
    openedAt: "10:15",
    note: "Süt, yumurta ve gazete alınacak.",
  },
  {
    id: "req-3",
    residentName: "Selin Yılmaz",
    phone: "0544 333 44 55",
    unit: "C-3",
    blockId: "C Blok",
    type: "bread",
    status: "completed",
    openedAt: "08:00",
    completedAt: "08:45",
    assignedJanitorId: "j2",
    note: "2 ekmek lütfen.",
  },
  {
    id: "req-4",
    residentName: "Caner Erkin",
    phone: "0535 222 55 66",
    unit: "A-2",
    blockId: "A Blok",
    type: "cleaning",
    status: "pending",
    openedAt: "09:00",
    note: "Koridor paspaslanabilir mi?",
  },
  {
    id: "req-5",
    residentName: "Zeynep Su",
    phone: "0536 111 66 77",
    unit: "D-8",
    blockId: "D Blok",
    type: "trash",
    status: "completed",
    openedAt: "07:30",
    completedAt: "08:15",
    assignedJanitorId: "j3",
  },
];

const GENERATED_REQUESTS: JanitorRequest[] = Array.from({ length: 40 }, (_, i) => ({
  id: `gen-req-${i + 6}`,
  residentName: `Sakin ${i + 6}`,
  phone: `0532 000 00 ${String(i).padStart(2, "0")}`,
  unit: `${["A", "B", "C", "D"][Math.floor(Math.random() * 4)]}-${Math.floor(Math.random() * 20) + 1}`,
  blockId: `${["A", "B", "C", "D"][Math.floor(Math.random() * 4)]} Blok`,
  type: ["trash", "market", "bread", "cleaning"][Math.floor(Math.random() * 4)] as JanitorRequest["type"],
  status: Math.random() > 0.5 ? "pending" : "completed",
  openedAt: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
  completedAt: Math.random() > 0.5 ? "14:00" : undefined,
  assignedJanitorId: Math.random() > 0.5 ? "j1" : undefined,
  note: "Otomatik oluşturulan talep.",
}));

export const INITIAL_REQUESTS = [...BASE_REQUESTS, ...GENERATED_REQUESTS];


