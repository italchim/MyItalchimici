
import React from 'react';
import type { DashboardData, Announcement, DocumentItem, Email, TeamMember, View } from '../types';
import { DocumentType } from '../types';
import { WidgetCard } from './WidgetCard';
import { DocsIcon, SheetsIcon, NewsIcon, MailIcon, TeamIcon, ChevronRightIcon } from './Icons';

// Mock team data as it's not part of the Gemini response
const teamMembers: TeamMember[] = [
    { id: '1', name: 'Elena Rodriguez', role: 'Lead Engineer', avatarUrl: 'https://picsum.photos/seed/1/100' },
    { id: '2', name: 'Ben Carter', role: 'UX Designer', avatarUrl: 'https://picsum.photos/seed/2/100' },
    { id: '3', name: 'Aisha Khan', role: 'Data Scientist', avatarUrl: 'https://picsum.photos/seed/3/100' },
    { id: '4', name: 'Marcus Cole', role: 'Marketing Lead', avatarUrl: 'https://picsum.photos/seed/4/100' },
];

const AnnouncementsWidget: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => (
  <WidgetCard title="Company Announcements" icon={<NewsIcon className="h-6 w-6 text-indigo-500" />}>
    <div className="space-y-4">
      {announcements.map((item) => (
        <div key={item.id}>
          <p className="text-xs text-gray-500">{item.date}</p>
          <h4 className="font-semibold text-gray-800 hover:text-indigo-600 cursor-pointer">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.summary}</p>
        </div>
      ))}
    </div>
  </WidgetCard>
);

const DocumentsWidget: React.FC<{ documents: DocumentItem[], setActiveView: (view: View) => void }> = ({ documents, setActiveView }) => (
  <WidgetCard title="Recent Documents" icon={
    <div className="flex -space-x-1">
        <DocsIcon className="h-6 w-6 text-blue-500"/>
        <SheetsIcon className="h-6 w-6 text-green-500"/>
    </div>
  } onViewAll={() => setActiveView('documents')}>
    <ul className="divide-y divide-gray-200">
      {documents.map((doc) => (
        <li key={doc.id} className="py-3 flex items-center justify-between hover:bg-gray-50 rounded-md -mx-4 px-4 transition-colors cursor-pointer" onClick={() => setActiveView(doc.type === DocumentType.DOCS ? 'documents' : 'spreadsheets')}>
          <div className="flex items-center min-w-0">
            {doc.type === DocumentType.DOCS ? <DocsIcon className="h-6 w-6 text-blue-500 shrink-0" /> : <SheetsIcon className="h-6 w-6 text-green-500 shrink-0" />}
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
              <p className="text-sm text-gray-500 truncate">Edited by {doc.owner} &middot; {doc.lastEdited}</p>
            </div>
          </div>
          <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-2 shrink-0"/>
        </li>
      ))}
    </ul>
  </WidgetCard>
);

const EmailsWidget: React.FC<{ emails: Email[] }> = ({ emails }) => (
  <WidgetCard title="Inbox Preview" icon={<MailIcon className="h-6 w-6 text-red-500" />}>
     <ul className="divide-y divide-gray-200">
      {emails.map((email) => (
        <li key={email.id} className="py-3 hover:bg-gray-50 rounded-md -mx-4 px-4 transition-colors cursor-pointer">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-900">{email.sender}</p>
            <p className="text-xs text-gray-500">{email.timestamp}</p>
          </div>
          <p className="text-sm text-gray-700 truncate font-semibold">{email.subject}</p>
          <p className="text-sm text-gray-500 truncate">{email.snippet}</p>
        </li>
      ))}
    </ul>
  </WidgetCard>
);

const TeamWidget: React.FC<{ members: TeamMember[] }> = ({ members }) => (
    <WidgetCard title="Team Directory" icon={<TeamIcon className="h-6 w-6 text-yellow-500" />}>
        <div className="space-y-3">
            {members.map(member => (
                <div key={member.id} className="flex items-center space-x-3 cursor-pointer p-1 -m-1 hover:bg-gray-50 rounded-lg">
                    <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                </div>
            ))}
        </div>
    </WidgetCard>
);


export const Dashboard: React.FC<{ data: DashboardData; setActiveView: (view: View) => void }> = ({ data, setActiveView }) => {
  const { announcements, documents, emails } = data;
  return (
    <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, Alex</h1>
        <p className="text-gray-500 mb-8">Here's a snapshot of what's happening today.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <AnnouncementsWidget announcements={announcements} />
                <DocumentsWidget documents={documents} setActiveView={setActiveView} />
            </div>
            <div className="lg:col-span-1 space-y-6">
                <EmailsWidget emails={emails} />
                <TeamWidget members={teamMembers} />
            </div>
        </div>
    </div>
  );
};