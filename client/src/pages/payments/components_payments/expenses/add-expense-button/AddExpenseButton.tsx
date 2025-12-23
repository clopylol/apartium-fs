import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/shared/button';

interface AddExpenseButtonProps {
    onClick: () => void;
}

export const AddExpenseButton: FC<AddExpenseButtonProps> = ({ onClick }) => {
    const { t } = useTranslation();

    return (
        <div className="flex justify-end">
            <Button
                onClick={onClick}
                leftIcon={<Plus className="w-5 h-5" />}
            >
                {t('payments.expenses.addButton')}
            </Button>
        </div>
    );
};
