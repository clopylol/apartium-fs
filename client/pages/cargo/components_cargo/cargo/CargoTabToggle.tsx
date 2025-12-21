import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface CargoTabToggleProps {
  activeTab: "inventory" | "expected";
  onTabChange: (tab: "inventory" | "expected") => void;
  expectedCount: number;
}

export const CargoTabToggle: FC<CargoTabToggleProps> = ({ activeTab, onTabChange, expectedCount }) => {
  const { t } = useTranslation();

  return (
    <div className="flex bg-ds-card-light dark:bg-ds-card-dark p-1 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
      <button
        onClick={() => onTabChange("inventory")}
        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          activeTab === "inventory"
            ? "bg-ds-background-light dark:bg-ds-background-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm"
            : "text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
        }`}
      >
        {t("cargo.tabs.inventory")}
      </button>
      <button
        onClick={() => onTabChange("expected")}
        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
          activeTab === "expected"
            ? "bg-ds-background-light dark:bg-ds-background-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm"
            : "text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
        }`}
      >
        {t("cargo.tabs.expected")}
        {expectedCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-ds-in-sky-600 text-white text-[10px] flex items-center justify-center">
            {expectedCount}
          </span>
        )}
      </button>
    </div>
  );
};

