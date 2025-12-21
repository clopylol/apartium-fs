import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Ban } from 'lucide-react';
import { FormModal } from '@/components/shared/modals/form-modal';
import { Button } from '@/components/shared/button';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

export const RejectionModal: FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  rejectionReason,
  onReasonChange,
  onConfirm,
}) => {
  const { t } = useTranslation();

  const footer = (
    <div className="flex gap-3">
      <Button
        onClick={onClose}
        variant="secondary"
        fullWidth
      >
        {t('bookings.modals.rejection.buttons.cancel')}
      </Button>
      <Button
        onClick={onConfirm}
        fullWidth
        className="bg-ds-in-destructive-500 hover:bg-ds-in-destructive-600 shadow-lg shadow-ds-in-destructive-500/20"
      >
        {t('bookings.modals.rejection.buttons.reject')}
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('bookings.modals.rejection.title')}
      titleIcon={
        <div className="w-12 h-12 bg-ds-in-destructive-500/10 rounded-full flex items-center justify-center">
          <Ban className="w-6 h-6 text-ds-in-destructive-500" />
        </div>
      }
      maxWidth="sm"
      footer={footer}
    >
      <div className="space-y-4">
        <p className="text-ds-muted-light dark:text-ds-muted-dark text-center text-sm">
          {t('bookings.modals.rejection.message')}
        </p>
        
        <textarea 
          className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl p-3 text-ds-primary-light dark:text-ds-primary-dark text-sm focus:outline-none focus:ring-2 focus:ring-ds-in-destructive-500/50 resize-none h-24"
          placeholder={t('bookings.modals.rejection.placeholder')}
          value={rejectionReason}
          onChange={(e) => onReasonChange(e.target.value)}
          autoFocus
        />
      </div>
    </FormModal>
  );
};

