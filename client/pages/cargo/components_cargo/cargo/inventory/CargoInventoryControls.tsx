import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { ChipGroup } from "@/components/shared/inputs/chip-group";

interface CargoInventoryControlsProps {
  statusFilter: "all" | "received" | "delivered" | "returned";
  onStatusFilterChange: (filter: "all" | "received" | "delivered" | "returned") => void;
}

export const CargoInventoryControls: FC<CargoInventoryControlsProps> = ({
  statusFilter,
  onStatusFilterChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:flex">
      <ChipGroup
        items={[
          { id: "all", label: t("cargo.filters.all") },
          { id: "received", label: t("cargo.filters.pending") },
          { id: "delivered", label: t("cargo.filters.delivered") },
        ]}
        activeId={statusFilter}
        onChange={(id) => onStatusFilterChange(id as "all" | "received" | "delivered" | "returned")}
      />
    </div>
  );
};

