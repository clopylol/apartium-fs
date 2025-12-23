export type MaintenancePriority = "Low" | "Medium" | "High" | "Urgent";
export type MaintenanceStatus = "New" | "In Progress" | "Completed";
export type MaintenanceCategory = "Tesisat" | "Elektrik" | "Isıtma/Soğutma" | "Genel";

export interface MaintenanceRequest {
  id: string;
  title: string;
  user: string;
  unit: string;
  category: MaintenanceCategory;
  date: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  avatar: string;
}

