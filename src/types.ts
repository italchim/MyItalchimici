export enum DocumentType {
    DOCS = 'Google Docs',
    SHEETS = 'Google Sheets',
}

export type View = 'dashboard' | 'holidays' | 'documents' | 'spreadsheets' | 'suggestions' | 'forum' | 'policies' | 'search' | 'team' | 'email' | 'tasks' | 'settings';

export interface UserSettings {
    name: string;
    avatarUrl: string;
}

export interface Announcement {
    id: string;
    title: string;
    summary: string;
    date: string;
}

export interface DocumentItem {
    id:string;
    title: string;
    type: DocumentType;
    lastEdited: string;
    owner: string;
}

export interface Email {
    id: string;
    sender: string;
    subject: string;
    snippet: string;
    timestamp: string;
}

export type LeaveType = 'Holiday' | 'Sick Leave';

export interface HolidayRequest {
    id: string;
    userName: string;
    startDate: string;
    endDate: string;
    type: LeaveType;
    status: 'Approved';
}

export interface Suggestion {
    id:string;
    area: 'HR' | 'IT' | 'Office Management' | 'Productivity';
    suggestion: string;
    motivation: string;
    submittedBy: string;
    date: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    department: 'Engineering' | 'Product' | 'Design' | 'Marketing' | 'HR';
    email: string;
    phone: string;
}

export interface ForumPost {
    id: string;
    authorName: string;
    authorAvatarUrl: string;
    content: string;
    timestamp: string; // e.g., "2 hours ago"
}

export interface ForumThread {
    id: string;
    title: string;
    authorName: string;
    authorAvatarUrl: string;
    createdAt: string; // e.g., "Yesterday"
    postCount: number;
    lastReply: {
        authorName: string;
        timestamp: string; // e.g., "15 minutes ago"
    };
    posts: ForumPost[];
}

export interface PolicyDocument {
    id: string;
    title: string;
    type: 'PDF' | 'DOCX';
    summary: string; // This will be used as the context for the AI
    lastUpdated: string; // e.g., "Month Day, YYYY"
}

export type TaskStatus = 'Pending' | 'Completed';

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string; // YYYY-MM-DD
    status: TaskStatus;
    createdBy: string;
    assignedTo: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    startTime: string; // e.g., "09:00"
    endTime: string; // e.g., "10:00"
    type: 'Meeting' | 'Focus Time' | 'Event';
    location?: string; // e.g., "Online" or "Conference Room 4B"
}

export interface DashboardData {
    announcements: Announcement[];
    documents: DocumentItem[];
    emails: Email[];
    holidayRequests: HolidayRequest[];
    suggestions: Suggestion[];
    forumThreads: ForumThread[];
    policyDocuments: PolicyDocument[];
    tasks: Task[];
    calendarEvents: CalendarEvent[];
}

export interface SearchResult {
    announcements: Announcement[];
    documents: DocumentItem[];
    emails: Email[];
    forumThreads: ForumThread[];
    tasks: Task[];
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}
