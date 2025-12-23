import type { Building, GuestVisit, Unit } from "@/types/residents.types";

export const ITEMS_PER_PAGE = 12;
export const GUESTS_PER_PAGE = 10;

// Helper to generate mock units
const generateMockUnits = (blockId: string, count: number, startFloor: number): Unit[] => {
    return Array.from({ length: count }, (_, i) => {
        const isOccupied = Math.random() > 0.3;
        return {
            id: `${blockId.toLowerCase()}-gen-${i + 10}`,
            number: `${i + 10}`,
            floor: startFloor + Math.floor(i / 4),
            status: isOccupied ? "occupied" : "empty",
            residents: isOccupied
                ? [
                    {
                        id: `r-${blockId}-${i + 10}`,
                        name: `Sakin ${blockId}-${i + 10}`,
                        type: Math.random() > 0.5 ? "owner" : "tenant",
                        phone: `555-${1000 + i}`,
                        email: `sakin${i}@example.com`,
                        avatar: `https://ui-avatars.com/api/?name=Sakin+${i}&background=random&color=fff`,
                        vehicles:
                            Math.random() > 0.7
                                ? [
                                    {
                                        id: `v-${i}`,
                                        plate: `34 T ${100 + i}`,
                                        model: "Fiat Egea",
                                    },
                                ]
                                : [],
                    },
                ]
                : [],
        };
    });
};

export const INITIAL_BUILDINGS: Building[] = [
    {
        id: "A",
        name: "A Blok",
        parkingSpots: [
            ...Array.from({ length: 8 }, (_, i) => ({
                id: `p-a-0-${i}`,
                name: `A-${String(i + 1).padStart(2, "0")}`,
                floor: 0,
            })),
            ...Array.from({ length: 8 }, (_, i) => ({
                id: `p-a-m1-${i}`,
                name: `A-B${String(i + 1).padStart(2, "0")}`,
                floor: -1,
            })),
        ],
        units: [
            {
                id: "a1",
                number: "1",
                floor: 1,
                status: "occupied",
                residents: [
                    {
                        id: "r1",
                        name: "Ahmet Yılmaz",
                        type: "owner",
                        phone: "555-0001",
                        email: "ahmet@example.com",
                        avatar:
                            "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64",
                        vehicles: [
                            {
                                id: "v1",
                                plate: "34 AB 123",
                                model: "Toyota Corolla (Beyaz)",
                                parkingSpot: "A-01",
                            },
                        ],
                    },
                ],
            },
            { id: "a2", number: "2", floor: 1, status: "empty", residents: [] },
            {
                id: "a3",
                number: "3",
                floor: 2,
                status: "occupied",
                residents: [
                    {
                        id: "r2",
                        name: "Ayşe Demir",
                        type: "tenant",
                        phone: "555-0002",
                        avatar:
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64",
                        vehicles: [
                            {
                                id: "v2",
                                plate: "34 KL 456",
                                model: "Honda Civic (Siyah)",
                                parkingSpot: "A-03",
                            },
                        ],
                    },
                    {
                        id: "r3",
                        name: "Ali Demir",
                        type: "tenant",
                        phone: "555-0003",
                        avatar:
                            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64",
                        vehicles: [],
                    },
                ],
            },
            {
                id: "a4",
                number: "4",
                floor: 2,
                status: "occupied",
                residents: [
                    {
                        id: "r4",
                        name: "Selin Kaya",
                        type: "owner",
                        phone: "555-0004",
                        avatar:
                            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&h=64",
                        vehicles: [
                            {
                                id: "v3",
                                plate: "35 KS 99",
                                model: "VW Golf (Kırmızı)",
                                parkingSpot: "A-04",
                            },
                        ],
                    },
                ],
            },
            { id: "a5", number: "5", floor: 3, status: "empty", residents: [] },
            {
                id: "a6",
                number: "6",
                floor: 3,
                status: "occupied",
                residents: [
                    {
                        id: "r5",
                        name: "Mehmet Can",
                        type: "tenant",
                        phone: "555-0005",
                        avatar:
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
                        vehicles: [],
                    },
                ],
            },
            ...generateMockUnits("A", 42, 4),
        ],
    },
    {
        id: "B",
        name: "B Blok",
        parkingSpots: Array.from({ length: 8 }, (_, i) => ({
            id: `p-b-${i}`,
            name: `B-${String(i + 1).padStart(2, "0")}`,
            floor: 0,
        })),
        units: [
            {
                id: "b1",
                number: "1",
                floor: 1,
                status: "occupied",
                residents: [
                    {
                        id: "r6",
                        name: "Zeynep Su",
                        type: "owner",
                        phone: "555-0006",
                        avatar:
                            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64",
                        vehicles: [
                            {
                                id: "v4",
                                plate: "06 ZYN 06",
                                model: "BMW 320i (Gri)",
                                parkingSpot: "B-01",
                            },
                        ],
                    },
                ],
            },
            {
                id: "b2",
                number: "2",
                floor: 1,
                status: "occupied",
                residents: [
                    {
                        id: "r7",
                        name: "Caner Erkin",
                        type: "tenant",
                        phone: "555-0007",
                        avatar:
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64",
                        vehicles: [],
                    },
                ],
            },
        ],
    },
    {
        id: "C",
        name: "C Blok",
        parkingSpots: Array.from({ length: 12 }, (_, i) => ({
            id: `p-c-${i}`,
            name: `C-${String(i + 1).padStart(2, "0")}`,
            floor: 0,
        })),
        units: [
            { id: "c1", number: "1", floor: 1, status: "empty", residents: [] },
            { id: "c2", number: "2", floor: 1, status: "empty", residents: [] },
        ],
    },
];

// Generate mock guests for pagination
const GENERATED_GUESTS: GuestVisit[] = Array.from({ length: 35 }, (_, i) => {
    const plates = ["34", "06", "35", "16", "07"];
    const statuses = ["pending", "active", "completed"] as const;
    const plate = `${plates[Math.floor(Math.random() * plates.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 900) + 100}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
        id: `gen-guest-${i}`,
        plate: plate,
        guestName: `Misafir ${i + 1}`,
        hostName: `Sakin ${Math.floor(Math.random() * 20) + 1}`,
        unitNumber: `${Math.floor(Math.random() * 10) + 1}`,
        blockName: ["A Blok", "B Blok", "C Blok"][Math.floor(Math.random() * 3)],
        status: status,
        source: Math.random() > 0.5 ? "app" : "manual",
        expectedDate: new Date().toISOString().split("T")[0],
        durationDays: 1,
        model: "Binek Araç",
        color: ["Beyaz", "Siyah", "Gri", "Kırmızı"][Math.floor(Math.random() * 4)],
        entryTime: status !== "pending" ? "10:00" : undefined,
        exitTime: status === "completed" ? "14:00" : undefined,
    };
});

export const INITIAL_GUESTS: GuestVisit[] = [
    {
        id: "g1",
        plate: "34 ASD 12",
        guestName: "Ali Veli",
        hostName: "Ahmet Yılmaz",
        unitNumber: "1",
        blockName: "A Blok",
        status: "active",
        source: "manual",
        expectedDate: new Date().toISOString().split("T")[0],
        durationDays: 1,
        entryTime: "10:30",
        model: "Fiat Egea",
        color: "Beyaz",
        parkingSpot: "A-02",
    },
    {
        id: "g2",
        plate: "06 ANK 99",
        guestName: "Mehmet Öz",
        hostName: "Zeynep Su",
        unitNumber: "1",
        blockName: "B Blok",
        status: "pending",
        source: "app",
        expectedDate: new Date().toISOString().split("T")[0],
        durationDays: 3,
        model: "VW Passat",
        note: "Babamlar geliyor, otoparkı kullanabilirler.",
    },
    {
        id: "g3",
        plate: "35 IZM 35",
        guestName: "Ayşe Demir",
        hostName: "Selin Kaya",
        unitNumber: "4",
        blockName: "A Blok",
        status: "completed",
        source: "manual",
        expectedDate: "2024-10-25",
        durationDays: 1,
        entryTime: "14:00",
        exitTime: "18:30",
        model: "Ford Focus",
    },
    ...GENERATED_GUESTS,
];
