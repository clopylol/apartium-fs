import type { Announcement as DbAnnouncement } from 'apartium-shared';

// Extended announcement type with author info from API
export interface Announcement extends Omit<DbAnnouncement, 'authorId' | 'deletedAt'> {
    authorName: string;
    authorEmail: string;
}

// Form data for creating/updating announcements
export interface AnnouncementFormData {
    title: string;
    content: string;
    priority: 'High' | 'Medium' | 'Low';
    visibility: string;
    status: 'Published' | 'Scheduled' | 'Draft';
    publishDate: string; // ISO string or YYYY-MM-DD
}

// API Response types
export interface AnnouncementsResponse {
    announcements: Announcement[];
    total: number;
}

export interface AnnouncementResponse {
    announcement: Announcement;
}

// Filter types
export type AnnouncementPriority = 'All' | 'High' | 'Medium' | 'Low';
export type AnnouncementStatus = 'All' | 'Published' | 'Scheduled' | 'Draft';
