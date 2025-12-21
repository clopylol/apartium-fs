import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/shared/button';

interface PaymentsErrorStateProps {
    error: string;
    onRetry?: () => void;
}

export const PaymentsErrorState: FC<PaymentsErrorStateProps> = ({ error, onRetry }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-ds-destructive-light/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-ds-destructive-light/20">
                <AlertCircle className="w-10 h-10 text-ds-destructive-light" />
            </div>
            <h3 className="text-ds-secondary-light dark:text-ds-secondary-dark font-bold text-xl mb-2">
                {t('payments.errorState.title')}
            </h3>
            <p className="text-ds-muted-light mb-2 text-center max-w-md">
                {error}
            </p>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="destructive"
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                    className="mt-6"
                >
                    {t('payments.errorState.retryButton')}
                </Button>
            )}
        </div>
    );
};

