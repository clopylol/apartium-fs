import type { FC } from "react";
import { Megaphone, AlertTriangle, Calendar, Eye } from "lucide-react";

import { StatCard } from "@/components/stat-card";
import { StatCardSkeleton } from "../skeletons";

interface AnnouncementStatsProps {
    isLoading: boolean;
    activeCount: number;
    highPriorityCount: number;
    scheduledCount: number;
}

export const AnnouncementStats: FC<AnnouncementStatsProps> = ({
    isLoading,
    activeCount,
    highPriorityCount,
    scheduledCount,
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

    return (
        <>
            <StatCard
                title="Aktif Duyurular"
                value={activeCount.toString()}
                trend="+2"
                trendUp={true}
                trendText="bu hafta"
                variant="blue"
                icon={Megaphone}
            />
            <StatCard
                title="Yüksek Öncelikli"
                value={highPriorityCount.toString()}
                trend="Acil"
                trendUp={true}
                trendText="dikkat gerektiren"
                variant="red"
                icon={AlertTriangle}
            />
            <StatCard
                title="Planlanmış"
                value={scheduledCount.toString()}
                trend="Gelecek"
                trendUp={true}
                trendText="yayın bekleyen"
                variant="purple"
                icon={Calendar}
            />
            <StatCard
                title="Toplam Erişim"
                value="2.4k"
                trend="%92"
                trendUp={true}
                trendText="okunma oranı"
                variant="green"
                icon={Eye}
            />
        </>
    );
};
