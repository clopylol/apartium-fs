import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

export const useBookingsMutations = () => {
    const queryClient = useQueryClient();

    const createFacility = useMutation({
        mutationFn: (data: any) => api.bookings.createFacility(data),
        onSuccess: () => {
            toast.success('Tesis başarıyla oluşturuldu');
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Tesis oluşturulurken hata oluştu');
        },
    });

    const updateFacility = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => api.bookings.updateFacility(id, data),
        onSuccess: () => {
            toast.success('Tesis başarıyla güncellendi');
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Tesis güncellenirken hata oluştu');
        },
    });

    const deleteFacility = useMutation({
        mutationFn: ({ id }: { id: string; name?: string }) => api.bookings.deleteFacility(id),
        onSuccess: (_, variables) => {
            const message = variables.name
                ? `${variables.name} başarıyla silindi`
                : 'Tesis başarıyla silindi';
            toast.success(message);
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Tesis silinirken hata oluştu');
        },
    });

    const createBooking = useMutation({
        mutationFn: (data: any) => api.bookings.createBooking(data),
        onSuccess: (_, variables) => {
            toast.success('Rezervasyon talebi oluşturuldu');
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            // Note: We invalidate all bookings or specific facility bookings if we knew facilityId
            // variables.facilityId is available.
            queryClient.invalidateQueries({ queryKey: ['bookings', variables.facilityId] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Rezervasyon oluşturulurken hata oluştu');
        },
    });

    const updateBookingStatus = useMutation({
        mutationFn: ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) =>
            api.bookings.updateBookingStatus(id, status, rejectionReason),
        onSuccess: () => {
            toast.success('Rezervasyon durumu güncellendi');
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Rezervasyon durumu güncellenemedi');
        },
    });

    return {
        createFacility,
        updateFacility,
        deleteFacility,
        createBooking,
        updateBookingStatus,
    };
};
