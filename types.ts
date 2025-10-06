export interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  isRead: boolean;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface GoogleFile {
  id: string;
  name: string;
  owner: string;
  lastModified: string;
  url: string;
}

export interface ProcedureDoc {
  id: string;
  name: string;
  category: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ForumComment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  title: string;
  author: User;
  content: string;
  timestamp: string;
  comments: ForumComment[];
}

export interface HolidayRequest {
  id: string;
  type: 'ferie' | 'permessi';
  startDate: string; // ISO string
  endDate: string;   // ISO string
  status: 'Approvata' | 'In attesa' | 'Respinta';
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readBy: string[]; // Array of user emails
}

export type Page = 'home' | 'docs' | 'sheets' | 'procedures' | 'forum' | 'holidays' | 'admin-news';