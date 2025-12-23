import { Plus, Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Building } from "@/types/residents.types";

interface BuildingTabsProps {
    buildings: Building[];
    activeBlockId: string;
    onBlockChange: (blockId: string) => void;
    onAddBuilding: () => void;
    onEditBuilding: () => void;
    onDeleteBuilding: () => void;
}

export function BuildingTabs({
    buildings,
    activeBlockId,
    onBlockChange,
    onAddBuilding,
    onEditBuilding,
    onDeleteBuilding,
}: BuildingTabsProps) {
    const { t } = useTranslation();
    const activeBlock = buildings.find((b) => b.id === activeBlockId);

    return (
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <div className="flex bg-ds-card-light dark:bg-ds-card-dark p-1.5 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
                {buildings.map((block) => (
                    <button
                        key={block.id}
                        onClick={() => onBlockChange(block.id)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeBlockId === block.id
                                ? "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm"
                                : "text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-secondary-light dark:hover:text-ds-secondary-dark hover:bg-ds-muted-light/50 dark:hover:bg-ds-muted-dark/50"
                            }`}
                    >
                        {block.name}
                    </button>
                ))}
                <button
                    onClick={onAddBuilding}
                    className="px-3 py-2 rounded-lg text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark hover:bg-ds-muted-light/50 dark:hover:bg-ds-muted-dark/50 transition-all border-l border-ds-border-light dark:border-ds-border-dark ml-1"
                    title={t("residents.actions.addBuilding")}
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {activeBlock && (
                <div className="flex gap-1 ml-2">
                    <button
                        onClick={onEditBuilding}
                        className="p-2 text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-in-teal-light dark:hover:text-ds-in-teal-dark hover:bg-ds-card-light dark:hover:bg-ds-card-dark rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDeleteBuilding}
                        className="p-2 text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-destructive-light dark:hover:text-ds-destructive-dark hover:bg-ds-card-light dark:hover:bg-ds-card-dark rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
