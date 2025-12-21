import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Package, Smartphone, CheckCircle, Bike, ShoppingBag, History } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { StatCardSkeleton } from "./StatCardSkeleton";

interface CargoStatsProps {
  isLoading: boolean;
  activeCategory: "cargo" | "courier";
  cargoStats: {
    totalPending: number;
    todayIncoming: number;
    delivered: number;
  };
  expectedCount: number;
  courierStats: {
    inside: number;
    pending: number;
    todayTotal: number;
  };
}

export const CargoStats: FC<CargoStatsProps> = ({
  isLoading,
  activeCategory,
  cargoStats,
  expectedCount,
  courierStats,
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

  if (activeCategory === "cargo") {
    return (
      <>
        <StatCard
          title={t("cargo.stats.cargo.pendingDelivery.title")}
          value={cargoStats.totalPending.toString()}
          trend={t("cargo.stats.cargo.pendingDelivery.trend")}
          trendUp={true}
          trendText={t("cargo.stats.cargo.pendingDelivery.trendText")}
          variant="orange"
          icon={Package}
        />
        <StatCard
          title={t("cargo.stats.cargo.expectedNotification.title")}
          value={expectedCount.toString()}
          trend={t("cargo.stats.cargo.expectedNotification.trend")}
          trendUp={true}
          trendText={t("cargo.stats.cargo.expectedNotification.trendText")}
          variant="blue"
          icon={Smartphone}
        />
        <StatCard
          title={t("cargo.stats.cargo.delivered.title")}
          value={cargoStats.delivered.toString()}
          trend={t("cargo.stats.cargo.delivered.trend")}
          trendUp={true}
          trendText={t("cargo.stats.cargo.delivered.trendText")}
          variant="green"
          icon={CheckCircle}
        />
      </>
    );
  }

  return (
    <>
      <StatCard
        title={t("cargo.stats.courier.inside.title")}
        value={courierStats.inside.toString()}
        trend={t("cargo.stats.courier.inside.trend")}
        trendUp={true}
        trendText={t("cargo.stats.courier.inside.trendText")}
        variant="blue"
        icon={Bike}
      />
      <StatCard
        title={t("cargo.stats.courier.pendingOrder.title")}
        value={courierStats.pending.toString()}
        trend={t("cargo.stats.courier.pendingOrder.trend")}
        trendUp={true}
        trendText={t("cargo.stats.courier.pendingOrder.trendText")}
        variant="orange"
        icon={ShoppingBag}
      />
      <StatCard
        title={t("cargo.stats.courier.todayEntry.title")}
        value={courierStats.todayTotal.toString()}
        trend={t("cargo.stats.courier.todayEntry.trend")}
        trendUp={true}
        trendText={t("cargo.stats.courier.todayEntry.trendText")}
        variant="green"
        icon={History}
      />
    </>
  );
};

