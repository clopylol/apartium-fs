// DB'den gelen type'lar
export interface CommunityRequest {
    id: string;
    authorId: string;
    unitId: string;
    siteId?: string | null;
    buildingId?: string | null;
    type: 'wish' | 'suggestion';
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
    requestDate: string;
    createdAt: string;
    updatedAt: string;
    authorName?: string;
    authorEmail?: string;
}

export interface PollVote {
    id: string;
    pollId: string;
    residentId: string;
    choice: 'yes' | 'no';
    createdAt: string;
}

export interface Poll {
    id: string;
    authorId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'closed';
    votes: PollVote[];
    createdAt: string;
    updatedAt: string;
}

export interface CommunityStats {
    pendingRequests: number;
    resolvedRequests: number;
    rejectedRequests: number;
    activePolls: number;
    closedPolls: number;
}

// Form data types
export interface CommunityRequestFormData {
    title: string;
    description: string;
    type: 'wish' | 'suggestion';
    siteId?: string | null;
    buildingId?: string | null;
}

export interface PollFormData {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    siteId?: string | null;
    buildingId?: string | null;
}

// Legacy types for backward compatibility (will be removed)
export interface Request {
    id: string;
    type: 'wish' | 'suggestion';
    title: string;
    description: string;
    author: string;
    unit: string;
    date: string;
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
}

export interface Vote {
    residentId: string;
    residentName: string;
    choice: 'yes' | 'no';
    timestamp: string;
}

export interface ResidentMock {
    id: string;
    name: string;
    unit: string;
}
