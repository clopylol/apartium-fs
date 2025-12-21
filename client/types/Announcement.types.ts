export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'High' | 'Medium' | 'Low';
    visibility: 'All Residents' | 'Building A' | 'Building B' | 'Building C';
    status: 'Published' | 'Scheduled' | 'Draft';
    publishDate: string;
}

export type AnnouncementPriority = 'All' | 'High' | 'Medium' | 'Low';
export type AnnouncementStatus = 'All' | 'Published' | 'Scheduled' | 'Draft';
