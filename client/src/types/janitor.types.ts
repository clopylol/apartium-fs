export type Janitor = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  assignedBlocks: { id: string; name: string }[];
  status: "on-duty" | "off-duty" | "passive";
  tasksCompleted: number;
};

export type JanitorRequest = {
  id: string;
  // Legacy fields (will be deprecated)
  residentName: string;
  phone: string; // This was on root but backend sends residentPhone now or nested
  unitLegacy?: string; // Renamed from unit to avoid conflict
  blockId: string;

  // New nested relation fields
  resident: {
    id: string;
    name: string;
    phone: string;
  } | null;
  unit: {
    id: string;
    number: string;
    building: {
      id: string;
      name: string;
    } | null;
  } | null;

  type: "trash" | "market" | "cleaning" | "bread" | "other";
  status: "pending" | "completed";
  openedAt: string; // keeping openedAt, mapped from createdAt maybe? check backend mapping if needed, usually createdAt
  createdAt: string; // Backend likely returns createdAt
  completedAt?: string;
  assignedJanitorId?: string;
  assignedJanitorName?: string;
  note?: string;
};

export type JanitorRequestType = JanitorRequest["type"];
export type JanitorRequestStatus = JanitorRequest["status"];
export type JanitorStatus = Janitor["status"];


