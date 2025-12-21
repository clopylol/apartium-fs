import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/shared/button";
import { SearchInput } from "@/components/shared/inputs/search-input";

interface MaintenanceHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewRequest: () => void;
}

export const MaintenanceHeader: FC<MaintenanceHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onNewRequest,
}) => {
  const { t } = useTranslation();

  return (
    <header className="h-20 border-b border-ds-border-light dark:border-ds-border-dark flex items-center justify-between px-8 bg-ds-background-light dark:bg-ds-background-dark shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-heading text-ds-primary-light dark:text-ds-primary-dark">
          {t("maintenance.header.title")}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={onNewRequest}
          leftIcon={<Plus className="w-4 h-4" />}
          className="mr-2"
        >
          <span className="hidden md:inline">
            {t("maintenance.header.createButton")}
          </span>
        </Button>

        <div className="w-64">
          <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={t("maintenance.header.searchPlaceholder")}
          />
        </div>
      </div>
    </header>
  );
};

