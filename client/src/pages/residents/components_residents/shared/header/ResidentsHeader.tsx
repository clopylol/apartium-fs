import { useTranslation } from "react-i18next";
import { Users, Car, CarFront } from "lucide-react";
import { SearchInput } from "@/components/shared/inputs/search-input";
import { TabToggle } from "@/components/shared/navigation/tab-toggle";

export interface ResidentsHeaderProps {
    activeTab: "residents" | "parking" | "guests";
    onTabChange: (tab: "residents" | "parking" | "guests") => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export function ResidentsHeader({
    activeTab,
    onTabChange,
    searchTerm,
    onSearchChange,
}: ResidentsHeaderProps) {
    const { t } = useTranslation();

    return (
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold font-heading text-ds-primary-light dark:text-ds-primary-dark">
                    {t("residents.header.title")}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <SearchInput
                    value={searchTerm}
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
}

