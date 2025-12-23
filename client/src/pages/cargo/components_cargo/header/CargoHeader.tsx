import type { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Search, Package, Bike } from "lucide-react";
import { TabToggle } from "@/components/shared/navigation/tab-toggle";

interface CargoHeaderProps {
  activeCategory: "cargo" | "courier";
  onCategoryChange: (category: "cargo" | "courier") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  rightContent?: ReactNode;
}

export const CargoHeader: FC<CargoHeaderProps> = ({
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  rightContent,
}) => {
  const { t } = useTranslation();

  return (
    <header className="h-20 border-b border-ds-border-light dark:border-ds-border-dark flex items-center justify-between px-8 bg-ds-background-light dark:bg-ds-background-dark shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-heading text-ds-primary-light dark:text-ds-primary-dark">
          {t("cargo.header.title")}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {rightContent && (
          <>
            {rightContent}
            <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark mx-2 hidden md:block"></div>
          </>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
          <input
            type="text"
            placeholder={
              activeCategory === "cargo"
                ? t("cargo.header.searchPlaceholders.cargo")
                : t("cargo.header.searchPlaceholders.courier")
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500 w-64 placeholder-ds-muted-light dark:placeholder-ds-muted-dark"
          />
        </div>

        <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark mx-2 hidden md:block"></div>

        {/* Main Category Switcher */}
        <TabToggle
          items={[
            {
              id: "cargo",
              label: t("cargo.header.tabs.cargo"),
              icon: <Package className="w-4 h-4" />,
            },
            {
              id: "courier",
              label: t("cargo.header.tabs.courier"),
              icon: <Bike className="w-4 h-4" />,
            },
          ]}
          activeTab={activeCategory}
          onChange={onCategoryChange}
        />
      </div>
    </header>
  );
};

