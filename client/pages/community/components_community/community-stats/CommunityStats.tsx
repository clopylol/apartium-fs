// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';

// 4. Icons
import { AlertCircle, MessageSquare, CheckCircle, PlayCircle, User } from 'lucide-react';

// 7. Types
import type { Request, Poll } from '@/types/community';

// 3. Components
import { StatCard } from '@/components/stat-card';

interface CommunityStatsProps {
    activeTab: 'requests' | 'polls';
    requests: Request[];
    polls: Poll[];
    isLoading: boolean;
}

const StatCardSkeleton = () => (
    <div className="relative overflow-hidden rounded-2xl p-6 border border-ds-border-dark bg-ds-card-dark h-full min-h-[160px] shadow-lg">
        <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
                <div className="h-4 w-24 bg-ds-border-dark rounded animate-pulse" />
                <div className="h-8 w-32 bg-ds-border-dark rounded animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-ds-border-dark rounded-xl animate-pulse shrink-0" />
        </div>
        <div className="mt-6 flex gap-2">
            <div className="h-6 w-16 bg-ds-border-dark rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-ds-border-dark rounded animate-pulse" />
        </div>
    </div>
);

export const CommunityStats: React.FC<CommunityStatsProps> = ({ activeTab, requests, polls, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
        );
    }

    if (activeTab === 'requests') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title={t('community.stats.requests.openRequests')}
                    value={requests.filter(r => r.status !== 'resolved' && r.type === 'wish').length.toString()}
                    trend={t('community.stats.requests.waiting')}
                    trendUp={true}
                    trendText={t('community.stats.requests.requestsPending')}
                    variant="purple"
                    icon={AlertCircle}
                />
                <StatCard
                    title={t('community.stats.requests.newSuggestions')}
                    value={requests.filter(r => r.type === 'suggestion' && r.status === 'pending').length.toString()}
                    trend={t('community.stats.requests.idea')}
                    trendUp={true}
                    trendText={t('community.stats.requests.toEvaluate')}
                    variant="blue"
                    icon={MessageSquare}
                />
                <StatCard
                    title={t('community.stats.requests.completed')}
                    value={requests.filter(r => r.status === 'resolved').length.toString()}
                    trend={t('community.stats.requests.resolved')}
                    trendUp={true}
                    trendText={t('community.stats.requests.thisMonth')}
                    variant="green"
                    icon={CheckCircle}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title={t('community.stats.polls.activePolls')}
                value={polls.filter(p => p.status === 'active').length.toString()}
                trend={t('community.stats.polls.ongoing')}
                trendUp={true}
                trendText={t('community.stats.polls.participationExpected')}
                variant="green"
                icon={PlayCircle}
            />
            <StatCard
                title={t('community.stats.polls.totalParticipation')}
                value={polls.reduce((acc, p) => acc + p.votes.length, 0).toString()}
                trend={t('community.stats.polls.person')}
                trendUp={true}
                trendText={t('community.stats.polls.totalVotes')}
                variant="blue"
                icon={User}
            />
            <StatCard
                title={t('community.stats.polls.completed')}
                value={polls.filter(p => p.status === 'closed').length.toString()}
                trend={t('community.stats.polls.ended')}
                trendUp={false}
                trendText={t('community.stats.polls.concluded')}
                variant="purple"
                icon={CheckCircle}
            />
        </div>
    );
};

