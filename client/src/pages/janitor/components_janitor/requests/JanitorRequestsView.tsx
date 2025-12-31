import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Bell, SquarePlus } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state/EmptyState";
import type { JanitorRequest, Janitor } from "@/types/janitor.types";
import { RequestFilters } from "./filters";
import { RequestCard } from "./grid";
import { RequestsTable } from "./list";
import { RequestCardSkeleton } from "../skeletons";
import { Pagination } from "@/components/shared/pagination";
import { ITEMS_PER_PAGE } from "@/constants/janitor";
import { Button } from "@/components/shared/button";

interface JanitorRequestsViewProps {
  requests: JanitorRequest[];
  isLoading: boolean;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  typeFilter: "all" | "trash" | "market" | "cleaning" | "bread";
  onTypeFilterChange: (filter: "all" | "trash" | "market" | "cleaning" | "bread") => void;
  statusFilter: "pending" | "completed" | "all";
  onStatusFilterChange: (filter: "pending" | "completed" | "all") => void;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  getJanitor: (id?: string) => Janitor | undefined;
  onSelect: (request: JanitorRequest) => void;
  onCompleteRequest: (request: JanitorRequest) => void;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onAddRequest: () => void;
}

export const JanitorRequestsView: FC<JanitorRequestsViewProps> = ({
  requests,
  isLoading,
  viewMode,
  onViewModeChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  sortDirection,
  onSort,
  getJanitor,
  onSelect,
  onCompleteRequest,
  totalItems,
  currentPage,
  onPageChange,
  onAddRequest,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-ds-primary-light dark:text-ds-primary-dark">
          {t("janitor.requests.title")}
        </h2>
        <Button
          onClick={onAddRequest}
          leftIcon={<SquarePlus className="w-4 h-4" />}
          className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20"
        >
          {t("janitor.requests.addButton")}
        </Button>
      </div>

      <RequestFilters
        typeFilter={typeFilter}
        onTypeFilterChange={onTypeFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {!isLoading && requests.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={t("janitor.emptyState.requests.title")}
          description={t("janitor.emptyState.requests.description")}
        />
      ) : viewMode === "list" ? (
        <RequestsTable
          requests={requests}
          isLoading={isLoading}
          getJanitor={getJanitor}
          onSelect={onSelect}
          onCompleteRequest={onCompleteRequest}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <RequestCardSkeleton />
              <RequestCardSkeleton />
              <RequestCardSkeleton />
            </>
          ) : (
            requests.map((req) => {
              const assignedJanitor = getJanitor(req.assignedJanitorId);
              return (
                <RequestCard
                  key={req.id}
                  request={req}
                  assignedJanitor={assignedJanitor}
                  onSelect={onSelect}
                  onCompleteRequest={onCompleteRequest}
                />
              );
            })
          )}
        </div>
      )}

      {!isLoading && requests.length > 0 && (
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

