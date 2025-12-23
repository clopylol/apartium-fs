export interface Janitor {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  assignedBlocks: string[];
  status: "on-duty" | "off-duty" | "passive";
  tasksCompleted: number;
}

export interface JanitorRequest {
  id: string;
  residentName: string;
  phone: string;
  unit: string;
  blockId: string;
  type: "trash" | "market" | "cleaning" | "bread" | "other";
  status: "pending" | "completed";
  openedAt: string;
  completedAt?: string;
  assignedJanitorId?: string;
  note?: string;
}

export type JanitorRequestType = JanitorRequest["type"];
export type JanitorRequestStatus = JanitorRequest["status"];
export type JanitorStatus = Janitor["status"];


