import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";

import type { Announcement, AnnouncementPriority, AnnouncementFormData } from "@/types";
import { useAnnouncements, useAnnouncementMutations } from "@/hooks/announcements";
import {
    AnnouncementStats,
    AnnouncementFilters,
    AnnouncementsTable,
    AnnouncementFormModal,
} from "./components_announcements";
import { ConfirmationModal } from "@/components/shared/modals";
import { Pagination } from "@/components/shared/pagination";

const ITEMS_PER_PAGE = 10;

export const AnnouncementsPage = () => {
    // Filters (client-side)
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPriority, setFilterPriority] = useState<AnnouncementPriority>("All");

    // Pagination (server-side)
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch announcements from API
    const { announcements: allAnnouncements, total, isLoading } = useAnnouncements(currentPage, ITEMS_PER_PAGE);

    // Mutations
    const { createAnnouncement, updateAnnouncement, deleteAnnouncement, isCreating, isUpdating, isDeleting } = useAnnouncementMutations();

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

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus, filterPriority]);

    // Client-side filtering
    const filteredAnnouncements = useMemo(() => {
        return allAnnouncements.filter((ann) => {
            const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === "All" || ann.status === filterStatus;
            const matchesPriority = filterPriority === "All" || ann.priority === filterPriority;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [allAnnouncements, searchTerm, filterStatus, filterPriority]);

    // Stats calculations
    const activeCount = filteredAnnouncements.filter((a) => a.status === "Published").length;
    const scheduledCount = filteredAnnouncements.filter((a) => a.status === "Scheduled").length;
    const highPriorityCount = filteredAnnouncements.filter(
        (a) => a.priority === "High" && a.status === "Published"
    ).length;

    const handleOpenAdd = (): void => {
        setIsEditing(false);
        setCurrentAnnouncement({
            title: "",
            content: "",
            priority: "Medium",
            visibility: "All Residents",
            status: "Draft",
            publishDate: new Date().toISOString().split("T")[0],
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
        if (!currentAnnouncement.title || !currentAnnouncement.publishDate) return;

        const formData: AnnouncementFormData = {
            title: currentAnnouncement.title,
            content: currentAnnouncement.content || "",
            priority: currentAnnouncement.priority || "Medium",
            visibility: currentAnnouncement.visibility || "All Residents",
            status: currentAnnouncement.status || "Draft",
            publishDate: currentAnnouncement.publishDate,
        };

        if (isEditing && (currentAnnouncement as any).id) {
            updateAnnouncement({ 
                id: (currentAnnouncement as any).id, 
                data: formData 
            });
        } else {
            createAnnouncement(formData);
        }
        setShowModal(false);
    };

    const handleClearFilters = (): void => {
        setSearchTerm("");
        setFilterStatus("All");
        setFilterPriority("All");
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
                            isLoading={isLoading}
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
                        announcements={filteredAnnouncements}
                        isLoading={isLoading || isDeleting}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDeleteConfirm}
                        onAddNew={handleOpenAdd}
                        totalAnnouncements={total}
                        onClearFilters={handleClearFilters}
                    />

                    {!isLoading && (
                        <Pagination
                            totalItems={total}
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
                announcement={currentAnnouncement}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                onChange={setCurrentAnnouncement}
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
        </div>
    );
};
