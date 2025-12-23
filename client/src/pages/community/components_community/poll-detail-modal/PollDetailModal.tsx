// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';

// 3. Components
import { Button, IconButton } from '@/components/shared/button';

// 4. Icons
import { X, Trash2, PieChart, Bell, CheckSquare, Square, Send } from 'lucide-react';

// 7. Types
import type { Poll, ResidentMock } from '@/types/community';

interface PollDetailModalProps {
    isOpen: boolean;
    poll: Poll | null;
    nonVoters: ResidentMock[];
    notificationSelection: string[];
    onClose: () => void;
    onClosePoll: (id: string) => void;
    onDeletePoll: (id: string) => void;
    onSelectNonVoter: (id: string) => void;
    onSelectAllNonVoters: () => void;
    onSendNotification: () => void;
}

export const PollDetailModal: React.FC<PollDetailModalProps> = ({
    isOpen,
    poll,
    nonVoters,
    notificationSelection,
    onClose,
    onClosePoll,
    onDeletePoll,
    onSelectNonVoter,
    onSelectAllNonVoters,
    onSendNotification
}) => {
    const { t } = useTranslation();

    if (!isOpen || !poll) return null;

    const yesVotes = poll.votes.filter(v => v.choice === 'yes').length;
    const noVotes = poll.votes.filter(v => v.choice === 'no').length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ds-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-6 border-b border-ds-border-dark flex justify-between items-start bg-ds-card-dark shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-ds-primary-dark leading-tight flex items-center gap-2">
                            {poll.title}
                            {poll.status === 'closed' && (
                                <span className="text-xs bg-ds-border-dark text-ds-muted-dark px-2 py-0.5 rounded-full border border-ds-border-dark">
                                    {t('community.pollDetail.closed')}
                                </span>
                            )}
                        </h2>
                        <p className="text-ds-muted-dark text-sm mt-1 line-clamp-1">{poll.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {poll.status === 'active' && (
                            <Button
                                onClick={() => onClosePoll(poll.id)}
                                size="sm"
                                className="bg-ds-in-warning-600/10 text-ds-in-warning-500 hover:bg-ds-in-warning-600/20 border border-ds-in-warning-600/20 shadow-none"
                            >
                                {t('community.pollDetail.endPoll')}
                            </Button>
                        )}
                        <IconButton
                            onClick={() => onDeletePoll(poll.id)}
                            icon={<Trash2 className="w-4 h-4" />}
                            variant="destructive"
                            ariaLabel="Delete poll"
                        />
                        <IconButton
                            onClick={onClose}
                            icon={<X className="w-5 h-5" />}
                            ariaLabel="Close modal"
                            className="ml-2"
                        />
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                    {/* Left: Results & Voters */}
                    <div className="flex-1 border-r border-ds-border-dark overflow-y-auto custom-scrollbar p-6">
                        <h3 className="text-sm font-bold text-ds-primary-dark mb-4 flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-ds-in-sky-500" /> {t('community.pollDetail.results')}
                        </h3>

                        {/* Result Summary */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 bg-ds-in-success-900/10 border border-ds-in-success-900/30 p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-ds-in-success-400">{yesVotes}</div>
                                <div className="text-xs text-ds-in-success-200/60 font-bold uppercase">{t('community.pollDetail.yes')}</div>
                            </div>
                            <div className="flex-1 bg-ds-in-destructive-900/10 border border-ds-in-destructive-900/30 p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-ds-in-destructive-400">{noVotes}</div>
                                <div className="text-xs text-ds-in-destructive-200/60 font-bold uppercase">{t('community.pollDetail.no')}</div>
                            </div>
                        </div>

                        {/* Voters List */}
                        <h4 className="text-xs font-bold text-ds-muted-dark uppercase mb-3">{t('community.pollDetail.voters')}</h4>
                        <div className="space-y-2">
                            {poll.votes.length > 0 ? poll.votes.map((vote, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-ds-background-dark border border-ds-border-dark rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-ds-border-dark flex items-center justify-center text-ds-muted-dark text-xs border border-ds-border-dark">
                                            {vote.residentName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-ds-primary-dark">{vote.residentName}</div>
                                            <div className="text-[10px] text-ds-muted-dark">{vote.timestamp.split('T')[0]}</div>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${vote.choice === 'yes'
                                        ? 'bg-ds-in-success-500/10 text-ds-in-success-400'
                                        : 'bg-ds-in-destructive-500/10 text-ds-in-destructive-400'
                                        }`}>
                                        {vote.choice === 'yes' ? t('community.pollDetail.yes').toUpperCase() : t('community.pollDetail.no').toUpperCase()}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-sm text-ds-muted-dark italic">{t('community.pollDetail.noVotes')}</p>
                            )}
                        </div>
                    </div>

                    {/* Right: Non-Voters & Notifications */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-ds-background-dark/30">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-ds-primary-dark flex items-center gap-2">
                                <Bell className="w-4 h-4 text-ds-in-warning-500" /> {t('community.pollDetail.participation')}
                            </h3>
                            <div className="text-xs text-ds-muted-dark bg-ds-card-dark px-2 py-1 rounded border border-ds-border-dark">
                                {nonVoters.length} {t('community.pollDetail.waiting')}
                            </div>
                        </div>

                        <div className="bg-ds-card-dark border border-ds-border-dark rounded-xl overflow-hidden flex flex-col h-[350px]">
                            <div className="p-3 border-b border-ds-border-dark flex justify-between items-center bg-ds-background-dark/50">
                                <Button
                                    onClick={onSelectAllNonVoters}
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={notificationSelection.length === nonVoters.length ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                                    className="text-ds-in-sky-400 hover:text-ds-in-sky-300 h-auto py-1"
                                >
                                    {t('community.pollDetail.selectAll')}
                                </Button>
                                <span className="text-xs text-ds-muted-dark">{notificationSelection.length} {t('community.pollDetail.selected')}</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {nonVoters.map(resident => (
                                    <div
                                        key={resident.id}
                                        onClick={() => onSelectNonVoter(resident.id)}
                                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${notificationSelection.includes(resident.id)
                                            ? 'bg-ds-in-sky-900/20 border border-ds-in-sky-500/30'
                                            : 'hover:bg-ds-border-dark border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${notificationSelection.includes(resident.id)
                                                ? 'bg-ds-in-sky-500 border-ds-in-sky-500'
                                                : 'border-ds-muted-dark'
                                                }`}>
                                                {notificationSelection.includes(resident.id) && <CheckSquare className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-sm text-ds-secondary-dark">{resident.name}</span>
                                        </div>
                                        <span className="text-xs text-ds-muted-dark font-mono bg-ds-background-dark px-1.5 rounded">
                                            {resident.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button
                                onClick={onSendNotification}
                                disabled={notificationSelection.length === 0}
                                fullWidth
                                leftIcon={<Send className="w-4 h-4" />}
                                className="bg-ds-in-warning-600 hover:bg-ds-in-warning-500 shadow-lg shadow-ds-in-warning-900/20"
                            >
                                {t('community.pollDetail.sendReminder')} ({notificationSelection.length})
                            </Button>
                            <p className="text-[10px] text-ds-muted-dark text-center mt-2">
                                {t('community.pollDetail.notificationInfo')}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

