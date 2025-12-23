import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { UserCog, Briefcase, AlertCircle } from "lucide-react";

import { StatCard } from "@/components/stat-card";
import { StatCardSkeleton } from "../skeletons";

interface JanitorStatsProps {
  isLoading: boolean;
  totalStaff: number;
  onDuty: number;
  activeRequests: number;
}

export const JanitorStats: FC<JanitorStatsProps> = ({
  isLoading,
  totalStaff,
  onDuty,
  activeRequests,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </>
    );
  }

  return (
    <>
      <StatCard
        title={t("janitor.stats.totalStaff")}
        value={totalStaff.toString()}
        trend={t("janitor.stats.trends.active")}
        trendUp={true}
        trendText={t("janitor.stats.trends.staffCount")}
        variant="blue"
        icon={UserCog}
      />
      <StatCard
        title={t("janitor.stats.onDuty")}
        value={onDuty.toString()}
        trend={t("janitor.stats.trends.working")}
        trendUp={true}
        trendText={t("janitor.stats.trends.onDutyNow")}
        variant="green"
        icon={Briefcase}
      />
      <StatCard
        title={t("janitor.stats.activeRequests")}
        value={activeRequests.toString()}
        trend={t("janitor.stats.trends.request")}
        trendUp={false}
        trendText={t("janitor.stats.trends.residentCall")}
        variant="red"
        icon={AlertCircle}
      />
    </>
  );
};


