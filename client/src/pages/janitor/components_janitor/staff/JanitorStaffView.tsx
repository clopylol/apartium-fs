import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus, LayoutGrid, List } from "lucide-react";
import type { Janitor } from "@/types/janitor.types";
import type { Building } from "@/types/residents.types";
import { JanitorCard } from "./grid";
import { JanitorTable } from "./list";
import { JanitorCardSkeleton } from "../skeletons";
import { Pagination } from "@/components/shared/pagination";
import { ITEMS_PER_PAGE } from "@/constants/janitor";
import { Button, ButtonGroup } from "@/components/shared/button";
import { Dropdown } from "@/components/shared/inputs";
import { Filter } from "lucide-react";

interface JanitorStaffViewProps {
  janitors: Janitor[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onAdd: () => void;
  onEdit: (janitor: Janitor) => void;
  onDelete: (id: string, name: string) => void;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  buildings: Building[];
  activeBlockId: string | null;
  onBlockChange: (id: string | null) => void;
}

export const JanitorStaffView: FC<JanitorStaffViewProps> = ({
  janitors,
  isLoading,
  viewMode,
  onViewModeChange,
  onAdd,
  onEdit,
  onDelete,
  totalItems,
  currentPage,
  onPageChange,
  buildings,
  activeBlockId,
  onBlockChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-ds-primary-light dark:text-ds-primary-dark">
          {t("janitor.staff.title")}
        </h2>

        <div className="flex items-center gap-4">
          <Dropdown
            icon={Filter}
            options={[
              { value: "all", label: "All Blocks" },
              ...buildings.map((building) => ({
                value: building.id,
                label: building.name,
              })),
            ]}
            value={activeBlockId || "all"}
            onChange={(value) => onBlockChange(value === "all" ? null : value)}
          />

          <ButtonGroup
            items={[
              { id: "grid", label: "", icon: <LayoutGrid className="w-4 h-4" /> },
              { id: "list", label: "", icon: <List className="w-4 h-4" /> },
            ]}
            activeId={viewMode}
            onChange={(id) => onViewModeChange(id as "grid" | "list")}
          />

          <Button
            onClick={onAdd}
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20"
          >
            {t("janitor.staff.addButton")}
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <JanitorCardSkeleton />
              <JanitorCardSkeleton />
              <JanitorCardSkeleton />
            </>
          ) : (
            janitors.map((janitor) => (
              <JanitorCard
                key={janitor.id}
                janitor={janitor}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      ) : (
        <JanitorTable
          janitors={janitors}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {!isLoading && (
        <Pagination
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={onPageChange}
          infoTextKey="janitor.pagination"
        />
      )}
    </div>
  );
};


