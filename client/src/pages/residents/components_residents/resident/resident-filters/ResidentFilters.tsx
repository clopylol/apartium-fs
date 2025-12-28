import type { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { MultiFilter } from "@/components/shared/inputs/multi-filter";
import type { FilterConfig, ActiveFilter } from "@/components/shared/inputs/multi-filter";

interface ResidentFiltersProps {
    typeFilter: "all" | "owner" | "tenant";
    onTypeChange: (value: "all" | "owner" | "tenant") => void;
    unitStatusFilter: "all" | "occupied" | "empty";
    onUnitStatusChange: (value: "all" | "occupied" | "empty") => void;
    vehicleFilter: "all" | "with" | "without";
    onVehicleChange: (value: "all" | "with" | "without") => void;
    floorFilter: "all" | number;
    onFloorChange: (value: "all" | number) => void;
    availableFloors: number[];
    rightContent?: ReactNode;
}

const getTypeLabel = (type: "all" | "owner" | "tenant", t: (key: string) => string): string => {
    switch (type) {
        case "owner": return t("residents.filters.type.owner");
        case "tenant": return t("residents.filters.type.tenant");
        default: return t("residents.filters.type.all");
    }
};

const getUnitStatusLabel = (status: "all" | "occupied" | "empty", t: (key: string) => string): string => {
    switch (status) {
        case "occupied": return t("residents.filters.unitStatus.occupied");
        case "empty": return t("residents.filters.unitStatus.empty");
        default: return t("residents.filters.unitStatus.all");
    }
};

const getVehicleLabel = (vehicle: "all" | "with" | "without", t: (key: string) => string): string => {
    switch (vehicle) {
        case "with": return t("residents.filters.vehicle.with");
        case "without": return t("residents.filters.vehicle.without");
        default: return t("residents.filters.vehicle.all");
    }
};

const getFloorLabel = (floor: "all" | number, t: (key: string) => string): string => {
    if (floor === "all") return t("residents.filters.floor.all");
    return t("residents.filters.floor.floor", { floor });
};

export const ResidentFilters: FC<ResidentFiltersProps> = ({
    typeFilter,
    onTypeChange,
    unitStatusFilter,
    onUnitStatusChange,
    vehicleFilter,
    onVehicleChange,
    floorFilter,
    onFloorChange,
    availableFloors,
    rightContent,
}) => {
    const { t } = useTranslation();

    const filters: FilterConfig[] = [
        {
            key: "type",
            label: t("residents.filters.type.label"),
            options: [
                { value: "all", label: t("residents.filters.type.all") },
                { value: "owner", label: t("residents.filters.type.owner") },
                { value: "tenant", label: t("residents.filters.type.tenant") },
            ],
            value: typeFilter,
            onChange: (value) => onTypeChange(value as "all" | "owner" | "tenant"),
        },
        {
            key: "unitStatus",
            label: t("residents.filters.unitStatus.label"),
            options: [
                { value: "all", label: t("residents.filters.unitStatus.all") },
                { value: "occupied", label: t("residents.filters.unitStatus.occupied") },
                { value: "empty", label: t("residents.filters.unitStatus.empty") },
            ],
            value: unitStatusFilter,
            onChange: (value) => onUnitStatusChange(value as "all" | "occupied" | "empty"),
        },
        {
            key: "vehicle",
            label: t("residents.filters.vehicle.label"),
            options: [
                { value: "all", label: t("residents.filters.vehicle.all") },
                { value: "with", label: t("residents.filters.vehicle.with") },
                { value: "without", label: t("residents.filters.vehicle.without") },
            ],
            value: vehicleFilter,
            onChange: (value) => onVehicleChange(value as "all" | "with" | "without"),
        },
        {
            key: "floor",
            label: t("residents.filters.floor.label"),
            options: [
                { value: "all", label: t("residents.filters.floor.all") },
                ...availableFloors.map((floor) => ({
                    value: floor.toString(),
                    label: t("residents.filters.floor.floor", { floor }),
                })),
            ],
            value: floorFilter === "all" ? "all" : floorFilter.toString(),
            onChange: (value) => {
                if (value === "all") {
                    onFloorChange("all");
                } else {
                    onFloorChange(parseInt(value, 10));
                }
            },
        },
    ];

    const activeFilters: ActiveFilter[] = [
        ...(typeFilter !== "all"
            ? [
                {
                    key: "type",
                    label: t("residents.filters.type.label"),
                    value: getTypeLabel(typeFilter, t),
                    onRemove: () => onTypeChange("all"),
                },
            ]
            : []),
        ...(unitStatusFilter !== "all"
            ? [
                {
                    key: "unitStatus",
                    label: t("residents.filters.unitStatus.label"),
                    value: getUnitStatusLabel(unitStatusFilter, t),
                    onRemove: () => onUnitStatusChange("all"),
                },
            ]
            : []),
        ...(vehicleFilter !== "all"
            ? [
                {
                    key: "vehicle",
                    label: t("residents.filters.vehicle.label"),
                    value: getVehicleLabel(vehicleFilter, t),
                    onRemove: () => onVehicleChange("all"),
                },
            ]
            : []),
        ...(floorFilter !== "all"
            ? [
                {
                    key: "floor",
                    label: t("residents.filters.floor.label"),
                    value: getFloorLabel(floorFilter, t),
                    onRemove: () => onFloorChange("all"),
                },
            ]
            : []),
    ];

    return <MultiFilter filters={filters} activeFilters={activeFilters} rightContent={rightContent} />;
};

