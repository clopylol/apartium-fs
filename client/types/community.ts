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

export interface Poll {
    id: string;
    title: string;
    description: string;
    author: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'closed';
    votes: Vote[];
}

export interface ResidentMock {
    id: string;
    name: string;
    unit: string;
}
