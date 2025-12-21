// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';

// 3. Components
import { Button, ButtonGroup } from '@/components/shared/button';

// 4. Icons
import { Search, Plus, MessageSquare, BarChart2 } from 'lucide-react';

interface CommunityHeaderProps {
    activeTab: 'requests' | 'polls';
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onTabChange: (tab: 'requests' | 'polls') => void;
    onCreateClick: () => void;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({
    activeTab,
    searchTerm,
    onSearchChange,
    onTabChange,
    onCreateClick
}) => {
    const { t } = useTranslation();

    const tabItems = [
        {
            id: 'requests',
            label: t('community.header.tabs.requests'),
            icon: <MessageSquare className="w-4 h-4" />,
        },
        {
            id: 'polls',
            label: t('community.header.tabs.polls'),
            icon: <BarChart2 className="w-4 h-4" />,
        },
    ];

    return (
        <header className="h-20 border-b border-ds-border-dark/50 flex items-center justify-between px-8 bg-ds-background-dark shrink-0">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold font-heading text-ds-primary-dark">{t('community.header.title')}</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-dark" />
                    <input
                        type="text"
                        placeholder={activeTab === 'requests' ? t('community.header.searchRequests') : t('community.header.searchPolls')}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-ds-card-dark border border-ds-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500 w-64 placeholder-ds-muted-dark"
                    />
                </div>

                <div className="h-8 w-px bg-ds-border-dark mx-2 hidden md:block" />

                <ButtonGroup
                    items={tabItems}
                    activeId={activeTab}
                    onChange={(id) => onTabChange(id as 'requests' | 'polls')}
                />

                <Button
                    onClick={onCreateClick}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20"
                >
                    <span className="hidden md:inline">{t('community.header.createButton')}</span>
                </Button>
            </div>
        </header>
    );
};

