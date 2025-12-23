import { Search, Users, Car, CarFront } from "lucide-react";
import { useTranslation } from "react-i18next";

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
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
                    <input
                        type="text"
                        placeholder={
                            activeTab === "guests"
                                ? t("residents.header.searchPlaceholders.guests")
                                : t("residents.header.searchPlaceholders.residents")
                        }
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-ds-secondary-light dark:text-ds-secondary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-teal-light dark:focus:ring-ds-in-teal-dark w-64 placeholder-ds-muted-light dark:placeholder-ds-muted-dark transition-all focus:w-80"
                    />
                </div>

                <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark mx-2 hidden md:block"></div>

                {/* Main View Toggle */}
                <div className="flex bg-ds-card-light dark:bg-ds-card-dark p-1 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
                    <button
                        onClick={() => onTabChange("residents")}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "residents"
                                ? "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm"
                                : "text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
                            }`}
                    >
                        <Users className="w-4 h-4" /> {t("residents.header.tabs.residents")}
                    </button>
                    <button
                        onClick={() => onTabChange("parking")}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "parking"
                                ? "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm"
                                : "text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
                            }`}
                    >
                        <Car className="w-4 h-4" /> {t("residents.header.tabs.parking")}
                    </button>
                    <button
                        onClick={() => onTabChange("guests")}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "guests"
                                ? "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm"
                                : "text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
                            }`}
                    >
                        <CarFront className="w-4 h-4" /> {t("residents.header.tabs.guests")}
                    </button>
                </div>
            </div>
        </header>
    );
}
