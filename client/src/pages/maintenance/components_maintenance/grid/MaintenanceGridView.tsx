import type { FC } from "react";
import type { MaintenanceRequest } from "@/types/maintenance.types";
import { MaintenanceCard } from "./MaintenanceCard";
import { MaintenanceCardSkeleton } from "../skeletons";

interface MaintenanceGridViewProps {
  requests: MaintenanceRequest[];
  isLoading: boolean;
  onSelect: (request: MaintenanceRequest) => void;
}

export const MaintenanceGridView: FC<MaintenanceGridViewProps> = ({
  requests,
  isLoading,
  onSelect,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MaintenanceCardSkeleton />
        <MaintenanceCardSkeleton />
        <MaintenanceCardSkeleton />
        <MaintenanceCardSkeleton />
        <MaintenanceCardSkeleton />
        <MaintenanceCardSkeleton />
        <MaintenanceCardSkeleton />
        <MaintenanceCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {requests.map((req) => (
        <MaintenanceCard key={req.id} request={req} onSelect={onSelect} />
      ))}
    </div>
  );
};

