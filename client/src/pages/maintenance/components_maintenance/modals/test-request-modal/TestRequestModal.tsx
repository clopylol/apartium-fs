import type { FC, ChangeEvent } from "react";
import { Wrench, Building2, Home, User, MessageSquare, ClipboardList, Flame, MapPin } from "lucide-react";
import { FormModal } from "@/components/shared/modals";
import { Dropdown } from "@/components/shared/inputs";
import { Button } from "@/components/shared/button";
import type { Building, UnitWithResidents, ResidentWithVehicles, Site } from "@/types/residents.types";
import { useBuildingData, useBuildings } from "@/hooks/residents/api/useResidentsData";
import { useSites } from "@/hooks/residents/site/useSites";
import { useCreateMaintenanceRequest } from "@/hooks/maintenance";
import { useState, useMemo } from "react";

interface TestFormData {
    siteId: string;
    buildingId: string;
    unitId: string;
    residentId: string;
    title: string;
    description: string;
    category: string;
    priority: string;
}

interface TestRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const categoryOptions = [
    { value: "Tesisat", label: "Tesisat" },
    { value: "Elektrik", label: "Elektrik" },
    { value: "Isıtma/Soğutma", label: "Isıtma/Soğutma" },
    { value: "Genel", label: "Genel" },
];

const priorityOptions = [
    { value: "Low", label: "Düşük" },
    { value: "Medium", label: "Orta" },
    { value: "High", label: "Yüksek" },
    { value: "Urgent", label: "Acil" },
];

const initialFormData: TestFormData = {
    siteId: "",
    buildingId: "",
    unitId: "",
    residentId: "",
    title: "",
    description: "",
    category: "Genel",
    priority: "Medium",
};

export const TestRequestModal: FC<TestRequestModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState<TestFormData>(initialFormData);

    // Fetch Sites
    const { sites, isLoading: isLoadingSites } = useSites();

    // Buildings data
    const { data: buildingsData, isLoading: isLoadingBuildings } = useBuildings();
    const allBuildings = Array.isArray(buildingsData)
        ? buildingsData
        : (buildingsData as any)?.buildings || [];

    // Filter buildings by selected site
    const filteredBuildings = useMemo(() => {
        if (!formData.siteId) return [];
        return allBuildings.filter((b: Building) => b.siteId === formData.siteId);
    }, [allBuildings, formData.siteId]);

    // Selected building data (units & residents)
    const { data: buildingData, isLoading: isLoadingBuilding } = useBuildingData(
        formData.buildingId || null
    );

    // Create mutation
    const createMutation = useCreateMaintenanceRequest();

    const handleSiteChange = (id: string) => {
        setFormData({ ...formData, siteId: id, buildingId: "", unitId: "", residentId: "" });
    };

    const handleBuildingChange = (id: string) => {
        setFormData({ ...formData, buildingId: id, unitId: "", residentId: "" });
    };

    const handleUnitChange = (id: string) => {
        setFormData({ ...formData, unitId: id, residentId: "" });
    };

    const handleResidentChange = (id: string) => {
        setFormData({ ...formData, residentId: id });
    };

    const units: UnitWithResidents[] = buildingData?.units || [];
    const selectedUnit = units.find((u: UnitWithResidents) => u.id === formData.unitId);
    const residents: ResidentWithVehicles[] = selectedUnit?.residents || [];

    const isFormValid =
        formData.siteId &&
        formData.buildingId &&
        formData.unitId &&
        formData.residentId &&
        formData.title.trim().length > 0 &&
        formData.category &&
        formData.priority;

    const handleSave = () => {
        if (!isFormValid) return;

        createMutation.mutate(
            {
                residentId: formData.residentId,
                unitId: formData.unitId,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                priority: formData.priority,
            },
            {
                onSuccess: () => {
                    setFormData(initialFormData);
                    onClose();
                },
                onError: (error) => {
                    console.error("Failed to create test request:", error);
                },
            }
        );
    };

    const handleClose = () => {
        setFormData(initialFormData);
        onClose();
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Test Bakım Talebi"
            titleIcon={<Wrench className="w-5 h-5" />}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Site Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <MapPin className="w-3.5 h-3.5" />
                            Site
                        </label>
                        <Dropdown
                            options={sites.map((s: Site) => ({ value: s.id, label: s.name }))}
                            value={formData.siteId}
                            onChange={handleSiteChange}
                            placeholder="Site Seçin"
                            disabled={isLoadingSites}
                        />
                    </div>

                    {/* Building Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <Building2 className="w-3.5 h-3.5" />
                            Bina
                        </label>
                        <Dropdown
                            options={filteredBuildings.map((b: Building) => ({ value: b.id, label: b.name }))}
                            value={formData.buildingId}
                            onChange={handleBuildingChange}
                            placeholder={formData.siteId ? "Bina Seçin" : "Önce Site Seçin"}
                            disabled={!formData.siteId || isLoadingBuildings}
                        />
                    </div>

                    {/* Unit Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <Home className="w-3.5 h-3.5" />
                            Daire
                        </label>
                        <Dropdown
                            options={units.map((u: UnitWithResidents) => ({ value: u.id, label: u.number }))}
                            value={formData.unitId}
                            onChange={handleUnitChange}
                            placeholder="Daire Seçin"
                            disabled={!formData.buildingId || isLoadingBuilding}
                        />
                    </div>

                    {/* Resident Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <User className="w-3.5 h-3.5" />
                            Sakin
                        </label>
                        <Dropdown
                            options={residents.map((r: ResidentWithVehicles) => ({ value: r.id, label: r.name }))}
                            value={formData.residentId}
                            onChange={handleResidentChange}
                            placeholder="Sakin Seçin"
                            disabled={!formData.unitId}
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <ClipboardList className="w-3.5 h-3.5" />
                            Kategori
                        </label>
                        <Dropdown
                            options={categoryOptions}
                            value={formData.category}
                            onChange={(val) => setFormData({ ...formData, category: val })}
                        />
                    </div>

                    {/* Priority Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <Flame className="w-3.5 h-3.5" />
                            Öncelik
                        </label>
                        <Dropdown
                            options={priorityOptions}
                            value={formData.priority}
                            onChange={(val) => setFormData({ ...formData, priority: val })}
                        />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                        <ClipboardList className="w-3.5 h-3.5" />
                        Başlık
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Örn: Mutfak lavabosu damlatıyor"
                        className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ds-in-sky-500/20 focus:border-ds-in-sky-500 transition-all text-ds-primary-light dark:text-ds-secondary-dark placeholder:text-ds-muted-light/60"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Açıklama
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detaylı açıklama yazın..."
                        rows={3}
                        className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ds-in-sky-500/20 focus:border-ds-in-sky-500 transition-all text-ds-primary-light dark:text-ds-secondary-dark placeholder:text-ds-muted-light/60"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={handleClose}>
                        İptal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!isFormValid || createMutation.isPending}
                        className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20 px-8"
                    >
                        {createMutation.isPending ? "Oluşturuluyor..." : "Test Talebi Oluştur"}
                    </Button>
                </div>
            </div>
        </FormModal>
    );
};
