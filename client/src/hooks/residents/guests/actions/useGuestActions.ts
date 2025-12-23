import type { GuestVisit } from "@/types/residents.types";
import { useGuestMutations } from "@/hooks/residents/api";

export interface GuestActionsParams {
    setCheckInConfirm: React.Dispatch<React.SetStateAction<{ isOpen: boolean; guestId: string | null }>>;
    setCheckOutConfirm: React.Dispatch<React.SetStateAction<{ isOpen: boolean; guestId: string | null }>>;
    checkInConfirm: { isOpen: boolean; guestId: string | null };
    checkOutConfirm: { isOpen: boolean; guestId: string | null };
    setSelectedGuest: (guest: GuestVisit | null) => void;
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
        setCheckInConfirm,
        setCheckOutConfirm,
        checkInConfirm,
        checkOutConfirm,
        setSelectedGuest,
        closeGuestModal,
    } = params;

    // ✅ Use API mutations
    const { createGuest, updateGuestStatus } = useGuestMutations();

    const handleAddGuest = async (guestData: any) => {
        try {
            await createGuest.mutateAsync({
                unitId: guestData.unitId,
                plate: guestData.plate,
                guestName: guestData.guestName || null,
                model: guestData.model || null,
                color: guestData.color || null,
                expectedDate: guestData.expectedDate || new Date().toISOString().split("T")[0],
                durationDays: guestData.durationDays || 1,
                note: guestData.note || null,
                status: 'pending',
                source: 'manual',
            });
        closeGuestModal();
        } catch (error) {
            // Error handled by mutation
            console.error('Failed to create guest visit:', error);
        }
    };

    const handleCheckInClick = (guestId: string) => {
        setCheckInConfirm({ isOpen: true, guestId });
    };

    const handleCheckOutClick = (guestId: string) => {
        setCheckOutConfirm({ isOpen: true, guestId });
    };

    const confirmCheckIn = async () => {
        if (!checkInConfirm.guestId) return;

        try {
            await updateGuestStatus.mutateAsync({
                id: checkInConfirm.guestId,
                status: 'active',
                timestamp: new Date(), // ✅ Current timestamp for entryTime
            });
        setCheckInConfirm({ isOpen: false, guestId: null });
        setSelectedGuest(null);
        } catch (error) {
            // Error handled by mutation
            console.error('Failed to check in guest:', error);
        }
    };

    const confirmCheckOut = async () => {
        if (!checkOutConfirm.guestId) return;

        try {
            await updateGuestStatus.mutateAsync({
                id: checkOutConfirm.guestId,
                status: 'completed',
                timestamp: new Date(), // ✅ Current timestamp for exitTime
            });
        setCheckOutConfirm({ isOpen: false, guestId: null });
        setSelectedGuest(null);
        } catch (error) {
            // Error handled by mutation
            console.error('Failed to check out guest:', error);
        }
    };

    return {
        handleAddGuest,
        handleCheckInClick,
        handleCheckOutClick,
        confirmCheckIn,
        confirmCheckOut,
    };
}
