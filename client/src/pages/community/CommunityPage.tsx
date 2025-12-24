// 1. External & React
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Utils
import { showError } from '@/utils/toast';

// 2. Hooks
import { useCommunityRequests, useCommunityPolls, useCommunityMutations } from '@/hooks/community';
import { useDebounce } from '@/hooks/useDebounce';
import { useSites } from '@/hooks/residents/site/useSites';

// 4. Icons
import { BarChart2 } from 'lucide-react';

// 7. Types
import type { CommunityRequest, Poll, CommunityRequestFormData, PollFormData } from '@/types';

// 8. Constants
import { MOCK_RESIDENTS } from '@/constants/community';

const ITEMS_PER_PAGE = 10;
const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 500; // 500ms

// 3. Components
import {
    CommunityHeader,
    CommunityStats,
    CommunityFilters,
    RequestsTable,
    PollCard,
    PollCardSkeleton,
    PollDetailModal,
    CreateModal,
    RequestDetailModal,
} from './components_community';
import { ConfirmationModal } from '@/components/shared/modals';
import { Pagination } from '@/components/shared/pagination';


export const CommunityPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'requests' | 'polls'>('requests');

    // Pagination State
    const [requestPage, setRequestPage] = useState(1);
    const [pollPage, setPollPage] = useState(1);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState<'all' | 'wish' | 'suggestion'>('all');

    // Sorting State
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // Debounce search term - 500ms sonra API'ye gönder
    const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

    // Minimum karakter kontrolü: 3 karakterden az ise arama yapma (undefined gönder)
    const effectiveSearchTerm = debouncedSearchTerm.length >= MIN_SEARCH_LENGTH ? debouncedSearchTerm : undefined;

    // Fetch data from API with pagination and filters
    // const { stats, isLoading: isLoadingStats } = useCommunityStats(); // TODO: Use stats from API
    const { requests, total: totalRequests, isLoading: isLoadingRequests } = useCommunityRequests(
        requestPage,
        ITEMS_PER_PAGE,
        effectiveSearchTerm,
        filterStatus === 'all' ? undefined : filterStatus,
        filterType === 'all' ? undefined : filterType
    );
    const { polls, total: totalPolls, isLoading: isLoadingPolls } = useCommunityPolls(
        pollPage,
        ITEMS_PER_PAGE,
        effectiveSearchTerm,
        filterStatus === 'all' ? undefined : (filterStatus as 'active' | 'closed')
    );
    const {
        createRequest,
        updateRequestType,
        deleteRequest,
        createPoll,
        updatePollStatus,
        deletePoll,
        vote,
        createRequestError,
        createPollError,
        voteError,
    } = useCommunityMutations();

    // Fetch sites for fallback
    const { sites } = useSites();

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPollDetailModal, setShowPollDetailModal] = useState(false);
    const [showRequestDetailModal, setShowRequestDetailModal] = useState(false);
    const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<CommunityRequest | null>(null);
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
        endDate: '',
        siteId: '',
        buildingId: ''
    });
    const [notificationSelection, setNotificationSelection] = useState<string[]>([]);

    // Combined loading state
    const isLoading = isLoadingRequests || isLoadingPolls;

    // Error handling is now done in useCommunityMutations hook via toast notifications
    // No need for manual error handling here

    // Reset Pagination on Tab Change or Filter Change
    useEffect(() => {
        setRequestPage(1);
    }, [activeTab, effectiveSearchTerm, filterStatus, filterType, sortField, sortDirection]);

    useEffect(() => {
        setPollPage(1);
    }, [activeTab, effectiveSearchTerm, filterStatus]);

    // Transform DB data to legacy format for components (temporary)
    const legacyRequests = useMemo(() => requests.map(r => ({
        id: r.id,
        type: r.type,
        title: r.title,
        description: r.description,
        author: 'Admin', // TODO: Get from authorId JOIN
        unit: 'A-101', // TODO: Get from unitId JOIN
        date: new Date(r.requestDate || r.createdAt).toISOString().split('T')[0],
        status: r.status,
    })), [requests]);

    // Client-side sorting for requests
    const sortedRequests = useMemo(() => {
        if (!sortField) return legacyRequests;

        return [...legacyRequests].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case "subject":
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case "type":
                    const typeOrder = { wish: 1, suggestion: 2 };
                    aValue = typeOrder[a.type] || 0;
                    bValue = typeOrder[b.type] || 0;
                    break;
                case "sender":
                    aValue = a.author.toLowerCase();
                    bValue = b.author.toLowerCase();
                    break;
                case "date":
                    aValue = a.date ? new Date(a.date).getTime() : 0;
                    bValue = b.date ? new Date(b.date).getTime() : 0;
                    break;
                case "status":
                    const statusOrder = { pending: 1, 'in-progress': 2, resolved: 3, rejected: 4 };
                    aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
                    bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [legacyRequests, sortField, sortDirection]);

    const legacyPolls = useMemo(() => polls.map(p => ({
        id: p.id,
        authorId: p.authorId,
        title: p.title,
        description: p.description,
        author: 'Admin', // TODO: Get from authorId JOIN
        startDate: new Date(p.startDate).toISOString().split('T')[0],
        endDate: new Date(p.endDate).toISOString().split('T')[0],
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        votes: p.votes.map(v => ({
            id: v.id,
            pollId: v.pollId,
            residentId: v.residentId,
            residentName: 'Resident', // TODO: Get from residentId JOIN
            choice: v.choice,
            timestamp: v.createdAt,
            createdAt: v.createdAt,
        })),
    })), [polls]);

    // --- Handlers ---

    const handleCreateSubmit = () => {
        if (!newItem.title) return;

        if (createType === 'request') {
            // Get siteId and buildingId - ensure at least one is set
            let siteId = newItem.siteId && newItem.siteId !== '' ? newItem.siteId : null;
            let buildingId = newItem.buildingId && newItem.buildingId !== '' ? newItem.buildingId : null;

            // Fallback: If both are null/empty, use first site as default
            if (!siteId && !buildingId && sites.length > 0) {
                siteId = sites[0].id;
                console.log('[CommunityPage] handleCreateSubmit - Using fallback siteId:', siteId);
            }

            // Debug log
            console.log('[CommunityPage] handleCreateSubmit - siteId:', siteId, 'buildingId:', buildingId);
            console.log('[CommunityPage] handleCreateSubmit - newItem:', newItem);

            // Direct create for requests
            const requestData: CommunityRequestFormData = {
                title: newItem.title,
                description: newItem.description,
                type: newItem.type as 'wish' | 'suggestion',
                siteId: siteId,
                buildingId: buildingId,
            };
            createRequest(requestData);
            setShowCreateModal(false);
            setNewItem({ title: '', description: '', type: 'wish', startDate: '', endDate: '', siteId: '', buildingId: '' });
        } else {
            // For Polls, ask for confirmation
            setConfirmModal({
                isOpen: true,
                title: t('community.modals.startPoll.title'),
                message: t('community.modals.startPoll.message', { title: newItem.title }),
                type: 'approve',
                action: () => {
                    // Get siteId and buildingId - ensure at least one is set
                    let siteId = newItem.siteId && newItem.siteId !== '' ? newItem.siteId : null;
                    let buildingId = newItem.buildingId && newItem.buildingId !== '' ? newItem.buildingId : null;

                    // Fallback: If both are null/empty, use first site as default
                    if (!siteId && !buildingId && sites.length > 0) {
                        siteId = sites[0].id;
                        console.log('[CommunityPage] handleCreateSubmit (poll) - Using fallback siteId:', siteId);
                    }

                    const pollData: PollFormData = {
                        title: newItem.title,
                        description: newItem.description,
                        startDate: newItem.startDate || new Date().toISOString().split('T')[0],
                        endDate: newItem.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        siteId: siteId,
                        buildingId: buildingId,
                    };
                    createPoll(pollData);
                    setActiveTab('polls');
                    setShowCreateModal(false);
                    setNewItem({ title: '', description: '', type: 'wish', startDate: '', endDate: '', siteId: '', buildingId: '' });
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
            action: () => deleteRequest(id)
        });
    };

    const handleConvertToSuggestion = (id: string) => {
        updateRequestType({ id, type: 'suggestion' });
    };

    const handleDeletePollRequest = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: t('community.modals.deletePoll.title'),
            message: t('community.modals.deletePoll.message'),
            type: 'danger',
            action: () => {
                deletePoll(id);
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
                updatePollStatus({ id, status: 'closed' });
                if (selectedPoll?.id === id) {
                    setSelectedPoll(prev => prev ? ({ ...prev, status: 'closed' }) : null);
                }
            }
        });
    };

    const handleVote = (pollId: string, choice: 'yes' | 'no') => {
        // Mock current user - TODO: Replace with actual user from auth
        const currentUser = { id: 'c52b03e1-83c2-42ca-b21d-583a227450ec', name: 'Ali Veli' };

        // Check if already voted (client-side check)
        const poll = polls.find(p => p.id === pollId);
        if (poll?.votes.some(v => v.residentId === currentUser.id)) {
            showError(t('community.messages.alreadyVoted'));
            return;
        }

        vote({ pollId, residentId: currentUser.id, choice });
    };

    const handleViewRequestDetail = (req: Request) => {
        // Find original request to get full data (Request is legacy type, need to find CommunityRequest)
        const original = requests.find(r => r.id === req.id);
        if (original) {
            setSelectedRequest(original);
            setShowRequestDetailModal(true);
        }
    };

    // Handle sort
    const handleSort = (field: string): void => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // New field, default to asc
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const convertSuggestionToPoll = (req: CommunityRequest) => {
        setCreateType('poll');
        // Default 1 week duration
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Preserve siteId and buildingId from the original request
        setNewItem({
            title: req.title,
            description: req.description,
            type: 'poll',
            startDate: today,
            endDate: nextWeek,
            siteId: req.siteId || '',
            buildingId: req.buildingId || ''
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
                    // Set first site as default when modal opens
                    const defaultSiteId = sites.length > 0 ? sites[0].id : '';
                    setNewItem({ title: '', description: '', type: 'wish', startDate: '', endDate: '', siteId: defaultSiteId, buildingId: '' });
                }}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Stats Area (Contextual) */}
                    <CommunityStats
                        activeTab={activeTab}
                        requests={legacyRequests}
                        polls={legacyPolls}
                        isLoading={isLoading}
                    />

                    {/* Filters */}
                    <CommunityFilters
                        activeTab={activeTab}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterStatus={filterStatus}
                        onStatusChange={setFilterStatus}
                        filterType={filterType}
                        onTypeChange={setFilterType}
                    />

                    {/* === REQUESTS TAB === */}
                    {activeTab === 'requests' && (
                        <>
                            <RequestsTable
                                requests={legacyRequests}
                                paginatedRequests={sortedRequests}
                                filteredCount={totalRequests}
                                currentPage={requestPage}
                                itemsPerPage={ITEMS_PER_PAGE}
                                isLoading={isLoading}
                                onPageChange={setRequestPage}
                                onConvertToSuggestion={handleConvertToSuggestion}
                                onConvertToPoll={(req) => {
                                    // Find original request to get full data
                                    const original = requests.find(r => r.id === req.id);
                                    if (original) convertSuggestionToPoll(original);
                                }}
                                onDelete={handleDeleteRequestRequest}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                                onRowClick={handleViewRequestDetail}
                            />
                            {!isLoading && totalRequests > 0 && (
                                <Pagination
                                    totalItems={totalRequests}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    currentPage={requestPage}
                                    onPageChange={setRequestPage}
                                />
                            )}
                        </>
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
                                ) : legacyPolls.length > 0 ? (
                                    legacyPolls.map(poll => (
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
                            {!isLoading && totalPolls > 0 && (
                                <Pagination
                                    totalItems={totalPolls}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    currentPage={pollPage}
                                    onPageChange={setPollPage}
                                />
                            )}
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
                onItemChange={(field, value) => setNewItem((prev) => ({ ...prev, [field]: value }))}
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

            {/* Request Detail Modal */}
            <RequestDetailModal
                isOpen={showRequestDetailModal}
                request={selectedRequest}
                onClose={() => {
                    setShowRequestDetailModal(false);
                    setSelectedRequest(null);
                }}
                onDelete={handleDeleteRequestRequest}
                onConvertToSuggestion={handleConvertToSuggestion}
                onConvertToPoll={(req) => {
                    const original = requests.find(r => r.id === req.id);
                    if (original) convertSuggestionToPoll(original);
                }}
            />

        </div>
    );
};
