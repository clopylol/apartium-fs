import { useState, useEffect, useMemo, useRef } from "react";
import { Plus } from "lucide-react";

import type { Announcement, AnnouncementPriority, AnnouncementFormData } from "@/types";
import { useAnnouncements, useAnnouncementMutations, useAnnouncementStats } from "@/hooks/announcements";
import {
    AnnouncementStats,
    AnnouncementFilters,
    AnnouncementsTable,
    AnnouncementFormModal,
    AnnouncementDetailModal,
    BulkActionBar,
} from "./components_announcements";
import { ConfirmationModal } from "@/components/shared/modals";
import { Pagination } from "@/components/shared/pagination";

const ITEMS_PER_PAGE = 10;

export const AnnouncementsPage = () => {
    // Filters (client-side)
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPriority, setFilterPriority] = useState<AnnouncementPriority>("All");

    // Sorting (client-side)
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // Pagination (client-side)
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch ALL announcements from API (no pagination on server)
    const { announcements: allAnnouncements, total, isLoading } = useAnnouncements(1, 1000);

    // Fetch stats separately (independent of filters)
    const { stats, isLoading: isLoadingStats } = useAnnouncementStats();

    // Mutations
    const { 
        createAnnouncement, 
        updateAnnouncement, 
        deleteAnnouncement, 
        isCreating, 
        isUpdating, 
        isDeleting,
    } = useAnnouncementMutations();

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<AnnouncementFormData>>({
        title: "",
        content: "",
        priority: "Medium",
        visibility: "All Residents",
        status: "Draft",
        publishDate: new Date().toISOString().split("T")[0],
    });

    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        announcementId: string;
        title: string;
    }>({
        isOpen: false,
        announcementId: "",
        title: "",
    });

    // Bulk selection state
    const [selectedAnnouncementIds, setSelectedAnnouncementIds] = useState<string[]>([]);

    // Detail modal state
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    // Bulk delete confirmation state
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState<{
        isOpen: boolean;
        count: number;
    }>({
        isOpen: false,
        count: 0,
    });

    // Reset to page 1 when filters or sorting change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus, filterPriority, sortField, sortDirection]);

    // Client-side filtering and sorting
    const filteredAnnouncements = useMemo(() => {
        let filtered = allAnnouncements.filter((ann) => {
            const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === "All" || ann.status === filterStatus;
            const matchesPriority = filterPriority === "All" || ann.priority === filterPriority;
            return matchesSearch && matchesStatus && matchesPriority;
        });

        // Apply sorting
        if (sortField) {
            filtered = [...filtered].sort((a, b) => {
                let aValue: any;
                let bValue: any;

                switch (sortField) {
                    case "author":
                        aValue = a.authorName.toLowerCase();
                        bValue = b.authorName.toLowerCase();
                        break;
                    case "priority":
                        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
                        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
                        break;
                    case "visibility":
                        aValue = a.visibility.toLowerCase();
                        bValue = b.visibility.toLowerCase();
                        break;
                    case "publishDate":
                        aValue = a.publishDate ? new Date(a.publishDate).getTime() : 0;
                        bValue = b.publishDate ? new Date(b.publishDate).getTime() : 0;
                        break;
                    case "status":
                        const statusOrder = { Published: 3, Scheduled: 2, Draft: 1 };
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
        }

        return filtered;
    }, [allAnnouncements, searchTerm, filterStatus, filterPriority, sortField, sortDirection]);

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

    // Client-side pagination
    const paginatedAnnouncements = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAnnouncements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAnnouncements, currentPage]);

    // Stats from API (independent of filters)
    const activeCount = stats?.activeCount || 0;
    const scheduledCount = stats?.scheduledCount || 0;
    const highPriorityCount = stats?.highPriorityCount || 0;

    const handleOpenAdd = (): void => {
        setIsEditing(false);
        setCurrentAnnouncement({
            title: "",
            content: "",
            priority: "Medium",
            visibility: "",
            status: "Draft",
            publishDate: new Date().toISOString().split("T")[0],
            buildingId: undefined,
            siteId: undefined,
        });
        setShowModal(true);
    };

    const handleOpenEdit = (ann: Announcement): void => {
        setIsEditing(true);
        // Convert timestamp to YYYY-MM-DD format for form input
        const publishDateStr = ann.publishDate 
            ? new Date(ann.publishDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];
        
        setCurrentAnnouncement({
            id: ann.id, // Keep id for update
            title: ann.title,
            content: ann.content,
            priority: ann.priority,
            visibility: ann.visibility,
            status: ann.status,
            publishDate: publishDateStr,
            buildingId: (ann as any).buildingId || undefined, // Include buildingId for editing
            siteId: (ann as any).siteId || undefined, // Include siteId for editing
        } as any);
        setShowModal(true);
    };

    const handleOpenDeleteConfirm = (id: string, title: string): void => {
        setDeleteConfirm({ isOpen: true, announcementId: id, title });
    };

    const handleConfirmDelete = (): void => {
        deleteAnnouncement(deleteConfirm.announcementId);
        setDeleteConfirm({ isOpen: false, announcementId: "", title: "" });
    };

    const handleSave = (): void => {
        if (!currentAnnouncement.title || !currentAnnouncement.publishDate) {
            return;
        }

        const buildingId = (currentAnnouncement as any).buildingId;
        const siteId = (currentAnnouncement as any).siteId;
        
        // Debug: Log the values before processing
        console.log('[AnnouncementsPage] handleSave - buildingId:', buildingId, 'siteId:', siteId);
        
        const formData: AnnouncementFormData = {
            title: currentAnnouncement.title,
            content: currentAnnouncement.content || "",
            priority: currentAnnouncement.priority || "Medium",
            visibility: currentAnnouncement.visibility || "All Residents",
            status: currentAnnouncement.status || "Draft",
            publishDate: currentAnnouncement.publishDate,
            // Convert empty string or undefined to null for backend
            buildingId: buildingId && buildingId !== "" ? buildingId : null,
            siteId: siteId && siteId !== "" ? siteId : null,
        };
        
        // Debug: Log the final formData
        console.log('[AnnouncementsPage] handleSave - formData:', formData);

        if (isEditing && (currentAnnouncement as any).id) {
            updateAnnouncement({ 
                id: (currentAnnouncement as any).id, 
                data: formData 
            });
        } else {
            createAnnouncement(formData);
        }
        // Modal will close automatically via useEffect
    };

    // Track previous mutation states to detect completion
    const prevIsCreating = useRef(isCreating);
    const prevIsUpdating = useRef(isUpdating);

    // Close modal when mutation completes (only when transitioning from true to false)
    useEffect(() => {
        // Check if mutation just completed (was true, now false)
        const createJustCompleted = prevIsCreating.current && !isCreating;
        const updateJustCompleted = prevIsUpdating.current && !isUpdating;

        if ((createJustCompleted || updateJustCompleted) && showModal) {
            // Wait a bit to show success state
            const timer = setTimeout(() => {
                setShowModal(false);
            }, 300);
            return () => clearTimeout(timer);
        }

        // Update refs for next render
        prevIsCreating.current = isCreating;
        prevIsUpdating.current = isUpdating;
    }, [isCreating, isUpdating, showModal]);

    // Error handling is now done in useAnnouncementMutations hook via toast

    const handleClearFilters = (): void => {
        setSearchTerm("");
        setFilterStatus("All");
        setFilterPriority("All");
    };

    // Bulk selection handlers
    const handleToggleSelect = (id: string): void => {
        setSelectedAnnouncementIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleToggleSelectAll = (): void => {
        if (selectedAnnouncementIds.length === paginatedAnnouncements.length) {
            setSelectedAnnouncementIds([]);
        } else {
            setSelectedAnnouncementIds(paginatedAnnouncements.map((ann) => ann.id));
        }
    };

    // Bulk delete handler
    const handleBulkDelete = (): void => {
        setBulkDeleteConfirm({
            isOpen: true,
            count: selectedAnnouncementIds.length,
        });
    };

    const handleConfirmBulkDelete = (): void => {
        selectedAnnouncementIds.forEach((id) => {
            deleteAnnouncement(id);
        });
        setSelectedAnnouncementIds([]);
        setBulkDeleteConfirm({ isOpen: false, count: 0 });
    };

    // Detail modal handlers
    const handleViewDetail = (announcement: Announcement): void => {
        setSelectedAnnouncement(announcement);
        setShowDetailModal(true);
    };

    // Duplicate handler
    const handleDuplicate = (announcement: Announcement): void => {
        setIsEditing(false);
        const publishDateStr = announcement.publishDate 
            ? new Date(announcement.publishDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];
        
        setCurrentAnnouncement({
            title: `${announcement.title} (Kopya)`,
            content: announcement.content,
            priority: announcement.priority,
            visibility: announcement.visibility,
            status: "Draft", // Always set to Draft for duplicates
            publishDate: publishDateStr,
            buildingId: (announcement as any).buildingId || undefined,
            siteId: (announcement as any).siteId || undefined,
        } as any);
        setShowModal(true);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            {/* Header */}
            <header className="h-20 border-b border-ds-border-light/50 dark:border-ds-border-dark/50 flex items-center justify-between px-8 bg-ds-background-light dark:bg-ds-background-dark shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold font-heading text-ds-primary-light dark:text-ds-primary-dark tracking-tight">
                        Topluluk Duyuruları
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleOpenAdd}
                        className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-ds-in-sky-900/20"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Duyuru Oluştur
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <AnnouncementStats
                            isLoading={isLoadingStats}
                            activeCount={activeCount}
                            highPriorityCount={highPriorityCount}
                            scheduledCount={scheduledCount}
                        />
                    </div>

                    {/* Filters & Search & Priority Chips */}
                    <AnnouncementFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterStatus={filterStatus}
                        onStatusChange={setFilterStatus}
                        filterPriority={filterPriority}
                        onPriorityChange={setFilterPriority}
                    />

                    {/* List/Table */}
                    <AnnouncementsTable
                        announcements={paginatedAnnouncements}
                        isLoading={isLoading || isDeleting}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDeleteConfirm}
                        onAddNew={handleOpenAdd}
                        totalAnnouncements={total}
                        onClearFilters={handleClearFilters}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        selectedIds={selectedAnnouncementIds}
                        onToggleSelect={handleToggleSelect}
                        onToggleSelectAll={handleToggleSelectAll}
                        onRowClick={handleViewDetail}
                    />

                    {!isLoading && (
                        <Pagination
                            totalItems={filteredAnnouncements.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnnouncementFormModal
                isOpen={showModal}
                isEditing={isEditing}
                announcement={currentAnnouncement as Partial<Announcement>}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                onChange={(ann) => setCurrentAnnouncement(ann as Partial<AnnouncementFormData>)}
                isLoading={isCreating || isUpdating}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, announcementId: "", title: "" })}
                onConfirm={handleConfirmDelete}
                title="Duyuru Silme Onayı"
                message={
                    <p>
                        <span className="font-bold text-white">{deleteConfirm.title}</span> başlıklı duyuruyu
                        silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                    </p>
                }
                variant="danger"
            />

            {/* Bulk Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={bulkDeleteConfirm.isOpen}
                onClose={() => setBulkDeleteConfirm({ isOpen: false, count: 0 })}
                onConfirm={handleConfirmBulkDelete}
                title="Toplu Silme Onayı"
                message={
                    <p>
                        <span className="font-bold text-white">{bulkDeleteConfirm.count}</span> adet duyuruyu
                        silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                    </p>
                }
                variant="danger"
            />

            {/* Detail Modal */}
            <AnnouncementDetailModal
                isOpen={showDetailModal}
                announcement={selectedAnnouncement}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedAnnouncement(null);
                }}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDeleteConfirm}
                onDuplicate={handleDuplicate}
            />

            {/* Bulk Action Bar */}
            <BulkActionBar
                selectedCount={selectedAnnouncementIds.length}
                onBulkDelete={handleBulkDelete}
                onCancel={() => setSelectedAnnouncementIds([])}
            />
        </div>
    );
};
