// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';

interface RequestStatusBadgeProps {
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
}

export const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status }) => {
    const { t } = useTranslation();

    const getStatusConfig = () => {
        switch (status) {
            case 'pending':
                return {
                    text: t('community.status.pending'),
                    className: 'text-ds-in-warning-400 bg-ds-in-warning-500/10 border-ds-in-warning-500/20'
                };
            case 'in-progress':
                return {
                    text: t('community.status.inProgress'),
                    className: 'text-ds-in-sky-400 bg-ds-in-sky-500/10 border-ds-in-sky-500/20'
                };
            case 'resolved':
                return {
                    text: t('community.status.resolved'),
                    className: 'text-ds-in-success-400 bg-ds-in-success-500/10 border-ds-in-success-500/20'
                };
            case 'rejected':
                return {
                    text: t('community.status.rejected'),
                    className: 'text-ds-in-destructive-400 bg-ds-in-destructive-500/10 border-ds-in-destructive-500/20'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <span className={`text-xs font-bold px-2 py-1 rounded border ${config.className}`}>
            {config.text}
        </span>
    );
};

