import type { Building, GuestVisit } from "@/types/residents.types";

export interface GuestActionsParams {
    buildings: Building[];
    guestList: GuestVisit[];
    setGuestList: React.Dispatch<React.SetStateAction<GuestVisit[]>>;
    setCheckInConfirm: React.Dispatch<React.SetStateAction<{ isOpen: boolean; guestId: string | null }>>;
    setCheckOutConfirm: React.Dispatch<React.SetStateAction<{ isOpen: boolean; guestId: string | null }>>;
    checkInConfirm: { isOpen: boolean; guestId: string | null };
    checkOutConfirm: { isOpen: boolean; guestId: string | null };
    setSelectedGuest: (guest: GuestVisit | null) => void;
    openGuestModal: () => void;
    closeGuestModal: () => void;
}

export interface GuestActionsReturn {
    handleAddGuest: (guestData: any) => void;
    handleCheckInClick: (guestId: string) => void;
    handleCheckOutClick: (guestId: string) => void;
    confirmCheckIn: () => void;
    confirmCheckOut: () => void;
}

export function useGuestActions(params: GuestActionsParams): GuestActionsReturn {
    const {
        buildings,
        guestList,
        setGuestList,
        setCheckInConfirm,
        setCheckOutConfirm,
        checkInConfirm,
        checkOutConfirm,
        setSelectedGuest,
        closeGuestModal,
    } = params;

    const handleAddGuest = (guestData: any) => {
        const selectedUnit = buildings
            .find((b) => b.id === guestData.blockId)
            ?.units.find((u) => u.id === guestData.unitId);

        if (!selectedUnit) return;

        const newGuest: GuestVisit = {
            id: `guest-${Date.now()}`,
            ...guestData,
            blockName: buildings.find((b) => b.id === guestData.blockId)?.name || "",
            unitNumber: selectedUnit.number,
            hostName: selectedUnit.residents[0]?.name || "Ev Sahibi",
            status: "active",
            source: "manual",
            expectedDate: new Date().toISOString().split("T")[0],
            entryTime: new Date().toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setGuestList([newGuest, ...guestList]);
        closeGuestModal();
    };

    const handleCheckInClick = (guestId: string) => {
        setCheckInConfirm({ isOpen: true, guestId });
    };

    const handleCheckOutClick = (guestId: string) => {
        setCheckOutConfirm({ isOpen: true, guestId });
    };

    const confirmCheckIn = () => {
        if (!checkInConfirm.guestId) return;
        const guestId = checkInConfirm.guestId;

        setGuestList((prev) =>
            prev.map((g) => {
                if (g.id === guestId) {
                    return {
                        ...g,
                        status: "active",
                        entryTime: new Date().toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    };
                }
                return g;
            })
        );
        setCheckInConfirm({ isOpen: false, guestId: null });
        setSelectedGuest(null);
    };

    const confirmCheckOut = () => {
        if (!checkOutConfirm.guestId) return;
        const guestId = checkOutConfirm.guestId;

        setGuestList((prev) =>
            prev.map((g) => {
                if (g.id === guestId) {
                    return {
                        ...g,
                        status: "completed",
                        exitTime: new Date().toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    };
                }
                return g;
            })
        );
        setCheckOutConfirm({ isOpen: false, guestId: null });
        setSelectedGuest(null);
    };

    return {
        handleAddGuest,
        handleCheckInClick,
        handleCheckOutClick,
        confirmCheckIn,
        confirmCheckOut,
    };
}
