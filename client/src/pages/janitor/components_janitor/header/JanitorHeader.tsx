import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Search, UserCog, Bell } from "lucide-react";
import { ButtonGroup } from "@/components/shared/button";

interface JanitorHeaderProps {
  activeTab: "staff" | "requests";
  onTabChange: (tab: "staff" | "requests") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeRequestsCount: number;
}

export const JanitorHeader: FC<JanitorHeaderProps> = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  activeRequestsCount,
}) => {
  const { t } = useTranslation();

  const tabItems = [
    {
      id: "staff",
      label: t("janitor.header.tabs.staff"),
      icon: <UserCog className="w-4 h-4" />,
    },
    {
      id: "requests",
      label: t("janitor.header.tabs.requests"),
      icon: <Bell className="w-4 h-4" />,
      badge: activeRequestsCount,
    },
  ];

  return (
    <header className="h-20 border-b border-ds-border-light/50 dark:border-ds-border-dark/50 flex items-center justify-between px-8 bg-ds-background-light dark:bg-ds-background-dark shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-heading text-ds-primary-light dark:text-ds-primary-dark">
          {t("janitor.header.title")}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-secondary-light dark:text-ds-secondary-dark" />
          <input
            type="text"
            placeholder={
              activeTab === "staff"
                ? t("janitor.header.search.staff")
                : t("janitor.header.search.requests")
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-input-light dark:border-ds-input-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark w-64 placeholder-ds-secondary-light dark:placeholder-ds-secondary-dark"
          />
        </div>

        <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark mx-2 hidden md:block"></div>

        <ButtonGroup
          items={tabItems}
          activeId={activeTab}
          onChange={(id) => onTabChange(id as "staff" | "requests")}
        />
      </div>
    </header>
  );
};


