// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';

// 3. Components
import { Button } from '@/components/shared/button';

interface PollVoteButtonsProps {
    pollId: string;
    onVote: (pollId: string, choice: 'yes' | 'no') => void;
}

export const PollVoteButtons: React.FC<PollVoteButtonsProps> = ({ pollId, onVote }) => {
    const { t } = useTranslation();

    return (
        <div className="flex gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
            <Button
                onClick={() => onVote(pollId, 'yes')}
                size="sm"
                fullWidth
                className="bg-ds-in-success-900/20 hover:bg-ds-in-success-900/40 border border-ds-in-success-900/50 text-ds-in-success-400 shadow-none"
            >
                {t('common.buttons.yes').toUpperCase()}
            </Button>
            <Button
                onClick={() => onVote(pollId, 'no')}
                size="sm"
                fullWidth
                className="bg-ds-in-destructive-900/20 hover:bg-ds-in-destructive-900/40 border border-ds-in-destructive-900/50 text-ds-in-destructive-400 shadow-none"
            >
                {t('common.buttons.no').toUpperCase()}
            </Button>
        </div>
    );
};

