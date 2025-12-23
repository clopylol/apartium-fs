// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PaymentRecord, MaintenanceRequest, Booking } from 'apartium-shared';

// 4. Icons
import { DollarSign, Wrench, Calendar, UserPlus, ArrowRight, Clock } from 'lucide-react';

// 8. Constants
import { NEW_TENANTS } from '@/constants';


interface ListCardWrapperProps {
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    actionText?: string;
}

const ListCardWrapper: React.FC<ListCardWrapperProps> = ({ title, icon: Icon, children, actionText }) => {
    const { t } = useTranslation();
    const defaultActionText = actionText || t('common.buttons.viewAll');
    
    return (
    <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl flex flex-col h-[380px] overflow-hidden shadow-lg hover:border-ds-border-light/20 transition-colors">
        <div className="p-6 border-b border-ds-border-dark flex justify-between items-center bg-ds-background-dark/30">
            <div className="flex items-center gap-3">
                {Icon && <div className="p-2 bg-ds-in-sky-500/10 rounded-lg"><Icon className="w-5 h-5 text-ds-in-sky-400" /></div>}
                <h3 className="font-bold text-lg text-ds-primary-dark">{title}</h3>
            </div>
            <button className="text-xs font-medium text-ds-muted-dark hover:text-ds-primary-dark transition-colors flex items-center gap-1 group">
                {defaultActionText}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {children}
        </div>
    </div>
    );
};

interface RecentPaymentsListProps {
    payments: PaymentRecord[];
}

export const RecentPaymentsList: React.FC<RecentPaymentsListProps> = ({ payments }) => {
    const { t } = useTranslation();
    
    if (payments.length === 0) {
        return (
            <ListCardWrapper title={t('dashboard.lists.recentPayments')} icon={DollarSign}>
                <div className="flex items-center justify-center h-full text-ds-muted-dark text-sm">
                    {t('dashboard.lists.noPayments', 'Henüz ödeme kaydı yok')}
                </div>
            </ListCardWrapper>
        );
    }
    
    return (
        <ListCardWrapper title={t('dashboard.lists.recentPayments')} icon={DollarSign}>
        <div className="space-y-1">
            {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 hover:bg-ds-background-dark/40 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-ds-border-dark/50">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${payment.status === 'paid' ? 'bg-ds-in-success-500/10 border-ds-in-success-500/20 text-ds-in-success-500' : 'bg-ds-in-destructive-500/10 border-ds-in-destructive-500/20 text-ds-in-destructive-500'}`}>
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-ds-primary-dark group-hover:text-white transition-colors">
                                {payment.residentId}
                            </div>
                            <div className="text-xs text-ds-muted-dark">{payment.unitId}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-ds-primary-dark">₺{Number(payment.amount).toLocaleString()}</div>
                        <div className="text-xs text-ds-muted-dark font-medium mt-0.5 flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" /> {new Date(payment.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </ListCardWrapper>
    );
};

interface MaintenanceListProps {
    maintenance: MaintenanceRequest[];
}

export const MaintenanceList: React.FC<MaintenanceListProps> = ({ maintenance }) => {
    const { t } = useTranslation();
    
    if (maintenance.length === 0) {
        return (
            <ListCardWrapper title={t('dashboard.lists.maintenanceRequests')} icon={Wrench}>
                <div className="flex items-center justify-center h-full text-ds-muted-dark text-sm">
                    {t('dashboard.lists.noMaintenance', 'Henüz bakım talebi yok')}
                </div>
            </ListCardWrapper>
        );
    }
    
    return (
        <ListCardWrapper title={t('dashboard.lists.maintenanceRequests')} icon={Wrench}>
            <div className="space-y-1">
                {maintenance.map((request) => (
                    <div key={request.id} className="flex items-start justify-between p-3 hover:bg-ds-background-dark/40 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-ds-border-dark/50">
                        <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${request.status === 'New' ? 'bg-ds-in-orange-500/10 border-ds-in-orange-500/20 text-ds-in-orange-500' :
                                request.status === 'In Progress' ? 'bg-ds-in-sky-500/10 border-ds-in-sky-500/20 text-ds-in-sky-500' :
                                    'bg-ds-in-success-500/10 border-ds-in-success-500/20 text-ds-in-success-500'
                                }`}>
                                <Wrench className="w-5 h-5" />
                            </div>
                            <div className="max-w-[180px]">
                                <div className="text-sm font-bold text-ds-primary-dark group-hover:text-white transition-colors truncate">
                                    {request.title}
                                </div>
                            <div className="text-xs text-ds-muted-dark mt-1 line-clamp-2 leading-relaxed">
                                {request.description}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-[10px] text-ds-muted-dark font-medium">{request.residentId} • {request.unitId}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-ds-muted-dark font-medium whitespace-nowrap">{new Date(request.createdAt).toLocaleDateString('tr-TR')}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${request.status === 'New' ? 'bg-ds-in-orange-500/10 text-ds-in-orange-400 border-ds-in-orange-500/20' :
                            request.status === 'In Progress' ? 'bg-ds-in-sky-500/10 text-ds-in-sky-400 border-ds-in-sky-500/20' :
                                'bg-ds-in-success-500/10 text-ds-in-success-400 border-ds-in-success-500/20'
                            }`}>
                            {request.status === 'New' ? t('common.status.new') : request.status === 'In Progress' ? t('common.status.inProgress') : t('common.status.completed')}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </ListCardWrapper>
    );
};

interface BookingsListProps {
    bookings: Booking[];
}

export const BookingsList: React.FC<BookingsListProps> = ({ bookings }) => {
    const { t } = useTranslation();
    
    if (bookings.length === 0) {
        return (
            <ListCardWrapper title={t('dashboard.lists.bookings')} icon={Calendar}>
                <div className="flex items-center justify-center h-full text-ds-muted-dark text-sm">
                    {t('dashboard.lists.noBookings', 'Bugün rezervasyon yok')}
                </div>
            </ListCardWrapper>
        );
    }
    
    return (
        <ListCardWrapper title={t('dashboard.lists.bookings')} icon={Calendar}>
            <div className="space-y-1">
                {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-ds-background-dark/40 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-ds-border-dark/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-ds-in-violet-500/10 border-2 border-ds-in-violet-500/20 flex items-center justify-center text-ds-in-violet-500">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-ds-primary-dark group-hover:text-white transition-colors">
                                    {booking.facilityId}
                                </div>
                                <div className="text-xs text-ds-muted-dark mt-0.5">
                                    {booking.residentId}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                        <div className="px-2 py-1 bg-ds-background-dark rounded-md text-xs font-medium text-ds-muted-dark border border-ds-border-dark">
                            {booking.startTime} - {booking.endTime}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </ListCardWrapper>
    );
};

export const TenantsList = () => {
    const { t } = useTranslation();
    
    return (
        <ListCardWrapper title={t('dashboard.lists.notifications')} icon={UserPlus}>
        <div className="space-y-1">
            {NEW_TENANTS.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 hover:bg-ds-background-dark/40 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-ds-border-dark/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-ds-in-indigo-500/10 border-2 border-ds-in-indigo-500/20 flex items-center justify-center text-ds-in-indigo-400">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-ds-primary-dark">
                                {alert.title}
                            </div>
                            <div className="text-xs text-ds-muted-dark mt-0.5">
                                {alert.description}
                            </div>
                        </div>
                    </div>
                    <div className="text-[10px] text-ds-muted-dark font-medium bg-ds-background-dark/50 px-2 py-1 rounded">
                        {alert.time}
                    </div>
                </div>
            ))}
        </div>
    </ListCardWrapper>
    );
};
