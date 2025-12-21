import type { MaintenanceRequest } from "@/types/maintenance.types";

export const ITEMS_PER_PAGE = 10;

const BASE_REQUESTS: MaintenanceRequest[] = [
  {
    id: "#1024",
    title: "Mutfak lavabosu su kaçırıyor",
    user: "Zeynep Kaya",
    unit: "4B",
    category: "Tesisat",
    date: "2024-07-21",
    priority: "Urgent",
    status: "In Progress",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64",
  },
  {
    id: "#1023",
    title: "Pencere mandalı kırık",
    user: "Murat Demir",
    unit: "12C",
    category: "Genel",
    date: "2024-07-20",
    priority: "Medium",
    status: "Completed",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64",
  },
  {
    id: "#1022",
    title: "Klima soğutmuyor",
    user: "Ayşe Yılmaz",
    unit: "8A",
    category: "Isıtma/Soğutma",
    date: "2024-07-20",
    priority: "High",
    status: "New",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&h=64",
  },
  {
    id: "#1021",
    title: "Yatak odası prizi çalışmıyor",
    user: "Caner Erkin",
    unit: "2D",
    category: "Elektrik",
    date: "2024-07-19",
    priority: "Low",
    status: "Completed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
  },
  {
    id: "#1020",
    title: "Koridor ışığı yanıp sönüyor",
    user: "Selin Tekin",
    unit: "5B",
    category: "Elektrik",
    date: "2024-07-18",
    priority: "Low",
    status: "New",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64",
  },
  {
    id: "#1019",
    title: "Banyo gideri tıkalı",
    user: "Mehmet Öz",
    unit: "1A",
    category: "Tesisat",
    date: "2024-07-15",
    priority: "High",
    status: "New",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64",
  },
];

// Generate more mock data for pagination
const GENERATED_REQUESTS: MaintenanceRequest[] = Array.from(
  { length: 35 },
  (_, i) => {
    const priorities: MaintenanceRequest["priority"][] = [
      "Low",
      "Medium",
      "High",
      "Urgent",
    ];
    const statuses: MaintenanceRequest["status"][] = [
      "New",
      "In Progress",
      "Completed",
    ];
    const categories: MaintenanceRequest["category"][] = [
      "Tesisat",
      "Elektrik",
      "Isıtma/Soğutma",
      "Genel",
    ];

    return {
      id: `#${1000 - i}`,
      title: `Otomatik Bakım Kaydı ${i + 1}`,
      user: `Sakin ${i + 1}`,
      unit: `${Math.floor(Math.random() * 20) + 1}${
        ["A", "B", "C"][Math.floor(Math.random() * 3)]
      }`,
      category:
        categories[Math.floor(Math.random() * categories.length)] as MaintenanceRequest["category"],
      date: `2024-06-${String(Math.floor(Math.random() * 30) + 1).padStart(2, "0")}`,
      priority:
        priorities[Math.floor(Math.random() * priorities.length)] as MaintenanceRequest["priority"],
      status:
        statuses[Math.floor(Math.random() * statuses.length)] as MaintenanceRequest["status"],
      avatar: `https://ui-avatars.com/api/?name=Sakin+${i}&background=random&color=fff`,
    };
  }
);

export const INITIAL_REQUESTS: MaintenanceRequest[] = [
  ...BASE_REQUESTS,
  ...GENERATED_REQUESTS,
];

