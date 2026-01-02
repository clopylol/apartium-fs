import type { FC } from "react";
import {
  Wrench,
  AlertCircle,
  CheckCircle,
  Timer,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import type { MaintenanceRequest } from "@/types/maintenance.types";
import { StatCardSkeleton } from "../skeletons";

interface MaintenanceStatsData {
  totalCount: number;
  newCount: number;
  inProgressCount: number;
  completedCount: number;
  urgentCount: number;
}

interface MaintenanceStatsProps {
  isLoading: boolean;
  requests: MaintenanceRequest[];
  stats?: MaintenanceStatsData;
}

export const MaintenanceStats: FC<MaintenanceStatsProps> = ({
  isLoading,
  requests,
  stats,
}) => {
  if (isLoading) {
    return (
      <>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </>
    );
  }

  // Use API stats if available, otherwise calculate from requests
  const openRequests = stats
    ? stats.newCount + stats.inProgressCount
    : requests.filter((r) => r.status !== "Completed").length;

  const urgentRequests = stats
    ? stats.urgentCount
    : requests.filter(
      (r) => r.priority === "Urgent" && r.status !== "Completed"
    ).length;

  const completedRequests = stats
    ? stats.completedCount
    : requests.filter((r) => r.status === "Completed").length;

  return (
    <>
      <StatCard
        title="Açık Talepler"
        value={openRequests.toString()}
        trend="+3"
        trendUp={true}
        trendText="geçen haftaya göre"
        variant="blue"
        icon={Wrench}
      />
      <StatCard
        title="Acil Durumlar"
        value={urgentRequests.toString()}
        trend="-1"
        trendUp={true}
        trendText="bekleyen kayıt"
        variant="red"
        icon={AlertCircle}
      />
      <StatCard
        title="Tamamlanan"
        value={completedRequests.toString()}
        trend="+8"
        trendUp={true}
        trendText="bu ay"
        variant="green"
        icon={CheckCircle}
      />
      <StatCard
        title="Ort. Çözüm Süresi"
        value="24sa"
        trend="-4sa"
        trendUp={true}
        trendText="iyileşme"
        variant="purple"
        icon={Timer}
      />
    </>
  );
};
