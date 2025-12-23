// 1. External & React
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// 4. Icons
import { BarChart2 } from 'lucide-react';

// 7. Types
import type { Request, Poll } from '@/types/community';

// 8. Constants
import {
    ITEMS_PER_PAGE,
    MOCK_RESIDENTS,
    INITIAL_REQUESTS,
    GENERATED_REQUESTS,
    INITIAL_POLLS,
    GENERATED_POLLS
} from '@/constants/community';

// 3. Components
import {
    CommunityHeader,
    CommunityStats,
    RequestsTable,
    PollCard,
    PollCardSkeleton,
    PollDetailModal,
    CreateModal,
} from './components_community';
import { ConfirmationModal } from '@/components/shared/modals';


export const CommunityPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'requests' | 'polls'>('requests');
    const [isLoading, setIsLoading] = useState(true);

    // Initialize with 80% chance of data, 20% chance of empty state
    const [requests, setRequests] = useState<Request[]>(() => {
        return Math.random() > 0.2 ? [...INITIAL_REQUESTS, ...GENERATED_REQUESTS] : [];
    });
    const [polls, setPolls] = useState<Poll[]>(() => {
        return Math.random() > 0.2 ? [...INITIAL_POLLS, ...GENERATED_POLLS] : [];
    });

    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [requestPage, setRequestPage] = useState(1);
    const [pollPage, setPollPage] = useState(1);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPollDetailModal, setShowPollDetailModal] = useState(false);
    const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
    const [createType, setCreateType] = useState<'request' | 'poll'>('request');

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => void;
        type: 'approve' | 'danger';
    }>({ isOpen: false, title: '', message: '', action: () => { }, type: 'approve' });

    // Forms
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        type: 'wish',
        startDate: '',
        endDate: ''
    });
    const [notificationSelection, setNotificationSelection] = useState<string[]>([]);

    // Simulate Loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Reset Pagination on Filter Change
    useEffect(() => {
        setRequestPage(1);
        setPollPage(1);
    }, [searchTerm, activeTab]);

    // Filter Logic
    const filteredRequests = useMemo(() => requests.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [requests, searchTerm]);

    const paginatedRequests = useMemo(() => {
        const startIndex = (requestPage - 1) * ITEMS_PER_PAGE;
        return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRequests, requestPage]);

    const filteredPolls = useMemo(() => polls.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    ), [polls, searchTerm]);

    const paginatedPolls = useMemo(() => {
        const startIndex = (pollPage - 1) * ITEMS_PER_PAGE;
        return filteredPolls.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPolls, pollPage]);

    // --- Handlers ---

    const handleCreateSubmit = () => {
        if (!newItem.title) return;

        if (createType === 'request') {
            // Direct create for requests
                    const req: Request = {
                        id: `req-${Date.now()}`,
                        type: newItem.type as 'wish' | 'suggestion',
                        title: newItem.title,
                        description: newItem.description,
                        author: t('community.messages.author'),
                        unit: t('community.messages.unit'),
                        date: new Date().toISOString().split('T')[0],
                        status: 'pending'
                    };
            setRequests([req, ...requests]);
            setShowCreateModal(false);
            setNewItem({ title: '', description: '', type: 'wish', startDate: '', endDate: '' });
        } else {
            // For Polls, ask for confirmation
            setConfirmModal({
                isOpen: true,
                title: t('community.modals.startPoll.title'),
                message: t('community.modals.startPoll.message', { title: newItem.title }),
                type: 'approve',
                action: () => {
                    const poll: Poll = {
                        id: `poll-${Date.now()}`,
                        title: newItem.title,
                        description: newItem.description,
                        author: t('community.messages.author'),
                        startDate: newItem.startDate || new Date().toISOString().split('T')[0],
                        endDate: newItem.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        status: 'active',
                        votes: []
                    };
                    setPolls([poll, ...polls]);
                    setActiveTab('polls');
                    setShowCreateModal(false);
                    setNewItem({ title: '', description: '', type: 'wish', startDate: '', endDate: '' });
                }
            });
        }
    };

    const handleDeleteRequestRequest = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: t('community.modals.deleteRecord.title'),
            message: t('community.modals.deleteRecord.message'),
            type: 'danger',
            action: () => setRequests(requests.filter(r => r.id !== id))
        });
    };

    const handleConvertToSuggestion = (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, type: 'suggestion' } : r));
    };

    const handleDeletePollRequest = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: t('community.modals.deletePoll.title'),
            message: t('community.modals.deletePoll.message'),
            type: 'danger',
            action: () => {
                setPolls(polls.filter(p => p.id !== id));
                setShowPollDetailModal(false);
            }
        });
    };

    const handleClosePollRequest = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: t('community.modals.closePoll.title'),
            message: t('community.modals.closePoll.message'),
            type: 'approve',
            action: () => {
                setPolls(polls.map(p => p.id === id ? { ...p, status: 'closed' } : p));
                if (selectedPoll?.id === id) {
                    setSelectedPoll(prev => prev ? ({ ...prev, status: 'closed' }) : null);
                }
            }
        });
    };

    const handleVote = (pollId: string, choice: 'yes' | 'no') => {
        // Simulating "Current User" voting.
        const currentUser = { id: 'r7', name: 'Ali Veli' };

        setPolls(prev => prev.map(p => {
            if (p.id !== pollId) return p;
            if (p.votes.some(v => v.residentId === currentUser.id)) {
                alert(t('community.messages.alreadyVoted'));
                return p;
            }
            return {
                ...p,
                votes: [...p.votes, {
                    residentId: currentUser.id,
                    residentName: currentUser.name,
                    choice,
                    timestamp: new Date().toISOString()
                }]
            };
        }));
    };

    const convertSuggestionToPoll = (req: Request) => {
        setCreateType('poll');
        // Default 1 week duration
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        setNewItem({
            title: req.title,
            description: req.description,
            type: 'poll',
            startDate: today,
            endDate: nextWeek
        });
        setShowCreateModal(true);
    };

    // Notification Logic
    const getNonVoters = (poll: Poll) => {
        const votedIds = poll.votes.map(v => v.residentId);
        return MOCK_RESIDENTS.filter(r => !votedIds.includes(r.id));
    };

    const handleSelectNonVoter = (id: string) => {
        if (notificationSelection.includes(id)) {
            setNotificationSelection(prev => prev.filter(i => i !== id));
        } else {
            setNotificationSelection(prev => [...prev, id]);
        }
    };

    const handleSelectAllNonVoters = () => {
        if (!selectedPoll) return;
        const nonVoters = getNonVoters(selectedPoll);
        if (notificationSelection.length === nonVoters.length) {
            setNotificationSelection([]);
        } else {
            setNotificationSelection(nonVoters.map(r => r.id));
        }
    };

    const sendNotificationRequest = () => {
        if (notificationSelection.length === 0) return;
        setConfirmModal({
            isOpen: true,
            title: t('community.modals.sendReminder.title'),
            message: t('community.modals.sendReminder.message', { count: notificationSelection.length }),
            type: 'approve',
            action: () => {
                // Mock send
                setNotificationSelection([]);
            }
        });
    };

    return (
        <div className="flex flex-col h-full bg-ds-background-dark overflow-hidden relative">

            {/* Header */}
            <CommunityHeader
                activeTab={activeTab}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onTabChange={setActiveTab}
                onCreateClick={() => {
                    setShowCreateModal(true);
                    setCreateType('request');
                    setNewItem({ title: '', description: '', type: 'wish', startDate: '', endDate: '' });
                }}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Stats Area (Contextual) */}
                    <CommunityStats
                        activeTab={activeTab}
                        requests={requests}
                        polls={polls}
                        isLoading={isLoading}
                    />

                    {/* === REQUESTS TAB === */}
                    {activeTab === 'requests' && (
                        <RequestsTable
                            requests={requests}
                            paginatedRequests={paginatedRequests}
                            filteredCount={filteredRequests.length}
                            currentPage={requestPage}
                            itemsPerPage={ITEMS_PER_PAGE}
                            isLoading={isLoading}
                            onPageChange={setRequestPage}
                            onConvertToSuggestion={handleConvertToSuggestion}
                            onConvertToPoll={convertSuggestionToPoll}
                            onDelete={handleDeleteRequestRequest}
                        />
                    )}

                    {/* === POLLS TAB === */}
                    {activeTab === 'polls' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                {isLoading ? (
                                    <>
                                        <PollCardSkeleton />
                                        <PollCardSkeleton />
                                        <PollCardSkeleton />
                                        <PollCardSkeleton />
                                    </>
                                ) : paginatedPolls.length > 0 ? (
                                    paginatedPolls.map(poll => (
                                        <PollCard
                                            key={poll.id}
                                            poll={poll}
                                            onVote={handleVote}
                                            onClick={(p) => {
                                                setSelectedPoll(p);
                                                setShowPollDetailModal(true);
                                                setNotificationSelection([]);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-2 py-20 text-center text-ds-muted-dark border-2 border-dashed border-ds-border-dark rounded-2xl bg-ds-card-dark/20">
                                        <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>{t('community.messages.noPollsFound')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Create Modal */}
            <CreateModal
                isOpen={showCreateModal}
                createType={createType}
                newItem={newItem}
                onClose={() => setShowCreateModal(false)}
                onTypeChange={setCreateType}
                onItemChange={(field, value) => setNewItem({ ...newItem, [field]: value })}
                onSubmit={handleCreateSubmit}
            />

            {/* Poll Detail & Notification Modal */}
            <PollDetailModal
                isOpen={showPollDetailModal}
                poll={selectedPoll}
                nonVoters={selectedPoll ? getNonVoters(selectedPoll) : []}
                notificationSelection={notificationSelection}
                onClose={() => setShowPollDetailModal(false)}
                onClosePoll={handleClosePollRequest}
                onDeletePoll={handleDeletePollRequest}
                onSelectNonVoter={handleSelectNonVoter}
                onSelectAllNonVoters={handleSelectAllNonVoters}
                onSendNotification={sendNotificationRequest}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.type === 'danger' ? 'danger' : 'info'}
                onConfirm={() => {
                    confirmModal.action();
                    setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />

        </div>
    );
};
