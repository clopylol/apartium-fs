import type { FC, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FormModal } from "@/components/shared/modals";
import { Dropdown } from "@/components/shared/inputs";
import { Button } from "@/components/shared/button";
import { SquarePlus, Building2, Home, User, MessageSquare, ClipboardList } from "lucide-react";
import type { Building, UnitWithResidents, ResidentWithVehicles } from "@/types/residents.types";
import type { RequestFormData } from "@/hooks/janitor/useJanitorModals";
import { useBuildingData } from "@/hooks/residents/api/useResidentsData";

interface AddRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: RequestFormData) => void;
    formData: RequestFormData;
    onChange: (data: RequestFormData) => void;
    buildings: Building[];
}

export const AddRequestModal: FC<AddRequestModalProps> = ({
    isOpen,
    onClose,
    onSave,
    formData,
    onChange,
    buildings,
}) => {
    const { t } = useTranslation();

    // Selected building data (units & residents)
    const { data: buildingData, isLoading: isLoadingBuilding } = useBuildingData(
        formData.buildingId || null
    );

    const requestTypes = [
        { value: "trash", label: t("janitor.requests.types.trash") },
        { value: "market", label: t("janitor.requests.types.market") },
        { value: "bread", label: t("janitor.requests.types.bread") },
        { value: "cleaning", label: t("janitor.requests.types.cleaning") },
        { value: "other", label: t("janitor.requests.types.other") },
    ];

    const priorityOptions = [
        { value: "High", label: t("janitor.requests.priorities.High") },
        { value: "Medium", label: t("janitor.requests.priorities.Medium") },
        { value: "Low", label: t("janitor.requests.priorities.Low") },
    ];

    const handleBuildingChange = (id: string) => {
        onChange({ ...formData, buildingId: id, unitId: "", residentId: "" });
    };

    const handleUnitChange = (id: string) => {
        onChange({ ...formData, unitId: id, residentId: "" });
    };

    const handleResidentChange = (id: string) => {
        onChange({ ...formData, residentId: id });
    };

    const units: UnitWithResidents[] = buildingData?.units || [];
    const selectedUnit = units.find((u: UnitWithResidents) => u.id === formData.unitId);
    const residents: ResidentWithVehicles[] = selectedUnit?.residents || [];

    const isFormValid =
        formData.buildingId &&
        formData.unitId &&
        formData.residentId &&
        formData.type &&
        formData.priority &&
        formData.note.trim().length > 0;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("janitor.requests.modals.add.title")}
            titleIcon={<SquarePlus className="w-5 h-5" />}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Building Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {t("janitor.requests.modals.labels.building")}
                        </label>
                        <Dropdown
                            options={buildings.map((b) => ({ value: b.id, label: b.name }))}
                            value={formData.buildingId}
                            onChange={handleBuildingChange}
                            placeholder={t("janitor.requests.modals.placeholders.selectBuilding")}
                        />
                    </div>

                    {/* Unit Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <Home className="w-3.5 h-3.5" />
                            {t("janitor.requests.modals.labels.unit")}
                        </label>
                        <Dropdown
                            options={units.map((u: UnitWithResidents) => ({ value: u.id, label: u.number }))}
                            value={formData.unitId}
                            onChange={handleUnitChange}
                            placeholder={t("janitor.requests.modals.placeholders.selectUnit")}
                            disabled={!formData.buildingId || isLoadingBuilding}
                        />
                    </div>

                    {/* Resident Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <User className="w-3.5 h-3.5" />
                            {t("janitor.requests.modals.labels.resident")}
                        </label>
                        <Dropdown
                            options={residents.map((r: ResidentWithVehicles) => ({ value: r.id, label: r.name }))}
                            value={formData.residentId}
                            onChange={handleResidentChange}
                            placeholder={t("janitor.requests.modals.placeholders.selectResident")}
                            disabled={!formData.unitId}
                        />
                    </div>

                    {/* Request Type */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <ClipboardList className="w-3.5 h-3.5" />
                            {t("janitor.requests.modals.labels.type")}
                        </label>
                        <Dropdown
                            options={requestTypes}
                            value={formData.type}
                            onChange={(val) => onChange({ ...formData, type: val as any })}
                        />
                    </div>

                    {/* Priority Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                            <ClipboardList className="w-3.5 h-3.5" />
                            {t("janitor.requests.priority")}
                        </label>
                        <Dropdown
                            options={priorityOptions}
                            value={formData.priority}
                            onChange={(val) => onChange({ ...formData, priority: val as any })}
                            placeholder={t("janitor.requests.priority")}
                        />
                    </div>
                </div>

                {/* Note */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {t("janitor.requests.modals.labels.note")}
                    </label>
                    <textarea
                        value={formData.note}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange({ ...formData, note: e.target.value })}
                        placeholder={t("janitor.requests.modals.placeholders.note")}
                        rows={4}
                        className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ds-in-sky-500/20 focus:border-ds-in-sky-500 transition-all text-ds-primary-light dark:text-ds-secondary-dark placeholder:text-ds-muted-light/60"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                    <Button
                        onClick={() => onSave(formData)}
                        disabled={!isFormValid}
                        className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20 px-8"
                    >
                        {t("common.save")}
                    </Button>
                </div>
            </div>
        </FormModal>
    );
};
