import { useTranslation } from "react-i18next";
import { Users, Car, CarFront } from "lucide-react";
import { forwardRef } from "react";
import { SearchInput } from "@/components/shared/inputs/search-input";
import { TabToggle } from "@/components/shared/navigation/tab-toggle";
import { SiteSelector } from "@/components/residents/site-selector";
import type { Site } from "@/types/residents.types";

export interface ResidentsHeaderProps {
    sites: Site[];
    activeSiteId: string | null;
    onSiteChange: (siteId: string) => void;
    activeTab: "residents" | "parking" | "guests";
    onTabChange: (tab: "residents" | "parking" | "guests") => void;
    localSearchTerm: string;
    onSearchChange: (term: string) => void;
}

export const ResidentsHeader = forwardRef<HTMLInputElement, ResidentsHeaderProps>(
    function ResidentsHeader(
        {
            sites,
            activeSiteId,
            onSiteChange,
            activeTab,
            onTabChange,
            localSearchTerm,
            onSearchChange,
        },
        searchInputRef
    ) {
    const { t } = useTranslation();

    return (
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold font-heading text-ds-primary-light dark:text-ds-primary-dark">
                    {t("residents.header.title")}
                </h1>

                {/* Site Selector */}
                <SiteSelector
                    sites={sites}
                    activeSiteId={activeSiteId}
                    onSiteChange={onSiteChange}
                />
            </div>

            <div className="flex items-center gap-4">
                <SearchInput
                    ref={searchInputRef}
                    value={localSearchTerm}
                    onChange={onSearchChange}
                    placeholder={
                        activeTab === "guests"
                            ? t("residents.header.searchPlaceholders.guests")
                            : t("residents.header.searchPlaceholders.residents")
                    }
                    className="w-64 focus-within:w-80 transition-all"
                />

                <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark mx-2 hidden md:block"></div>

                {/* Main View Toggle */}
                <TabToggle
                    items={[
                        { id: "residents", label: t("residents.header.tabs.residents"), icon: <Users className="w-4 h-4" /> },
                        { id: "parking", label: t("residents.header.tabs.parking"), icon: <Car className="w-4 h-4" /> },
                        { id: "guests", label: t("residents.header.tabs.guests"), icon: <CarFront className="w-4 h-4" /> },
                    ]}
                    activeTab={activeTab}
                    onChange={onTabChange}
                />
            </div>
        </header>
    );
});

