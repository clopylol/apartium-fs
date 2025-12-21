// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';

// 4. Icons
import { User, Calendar } from 'lucide-react';

// 7. Types
import type { Poll } from '@/types/community';

// 3. Components
import { PollProgressBar } from '../poll-progress-bar';
import { PollVoteButtons } from '../poll-vote-buttons';

interface PollCardProps {
    poll: Poll;
    onVote: (pollId: string, choice: 'yes' | 'no') => void;
    onClick: (poll: Poll) => void;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, onVote, onClick }) => {
    const { t } = useTranslation();
    const totalVotes = poll.votes.length;
    const yesVotes = poll.votes.filter(v => v.choice === 'yes').length;
    const noVotes = poll.votes.filter(v => v.choice === 'no').length;

    return (
        <div
            className={`relative bg-ds-card-dark border rounded-2xl p-6 transition-all group hover:shadow-xl cursor-pointer ${poll.status === 'active'
                ? 'border-ds-in-success-500/30 shadow-ds-in-success-900/10'
                : 'border-ds-border-dark opacity-80 hover:opacity-100'
                }`}
            onClick={() => onClick(poll)}
        >
            {poll.status === 'active' && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-ds-in-success-500/10 border border-ds-in-success-500/20 text-ds-in-success-400 text-[10px] font-bold uppercase tracking-wide animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-ds-in-success-500" /> {t('community.status.active')}
                </div>
            )}
            {poll.status === 'closed' && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-ds-border-dark border border-ds-border-dark text-ds-muted-dark text-[10px] font-bold uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-ds-muted-dark" /> {t('community.status.closed')}
                </div>
            )}

            <div className="mb-4 pr-16">
                <h3 className="text-lg font-bold text-ds-primary-dark mb-1 leading-tight">{poll.title}</h3>
                <p className="text-sm text-ds-muted-dark line-clamp-2">{poll.description}</p>
            </div>

            <div className="space-y-3">
                <PollProgressBar
                    totalVotes={totalVotes}
                    yesVotes={yesVotes}
                    noVotes={noVotes}
                />

                {poll.status === 'active' && (
                    <PollVoteButtons pollId={poll.id} onVote={onVote} />
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-ds-border-dark flex justify-between items-center text-xs text-ds-muted-dark">
                <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {poll.author}
                </span>
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {poll.startDate} / {poll.endDate}
                </span>
                <span className="font-bold text-ds-secondary-dark">{totalVotes} {t('community.pollCard.vote')}</span>
            </div>
        </div>
    );
};

