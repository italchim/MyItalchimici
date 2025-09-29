import React from 'react';
import type { SearchResult, View } from '../types';
import { DocumentType } from '../types';
import { WidgetCard } from './WidgetCard';
import { DocsIcon, SheetsIcon, NewsIcon, MailIcon, ForumIcon, ChevronRightIcon } from './Icons';

interface SearchResultsPageProps {
    query: string;
    results: SearchResult | null;
    setActiveView: (view: View) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, results, setActiveView }) => {
    if (!results) {
        return (
             <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Search</h1>
                <p className="text-gray-500">Something went wrong with the search.</p>
            </div>
        );
    }

    const { announcements, documents, emails, forumThreads } = results;
    const totalResults = announcements.length + documents.length + emails.length + forumThreads.length;

    return (
        <div className="container mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
            <p className="text-gray-500 mb-8">
                {totalResults > 0 ? `${totalResults} results found for ` : 'No results found for '}
                <span className="font-semibold text-gray-700">"{query}"</span>
            </p>

            <div className="space-y-6">
                {announcements.length > 0 && (
                    <WidgetCard title="Announcements" icon={<NewsIcon className="h-6 w-6 text-indigo-500" />} showViewAll={false}>
                        <div className="space-y-4">
                            {announcements.map((item) => (
                                <div key={item.id} className="p-2 -m-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <p className="text-xs text-gray-500">{item.date}</p>
                                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.summary}</p>
                                </div>
                            ))}
                        </div>
                    </WidgetCard>
                )}

                {documents.length > 0 && (
                    <WidgetCard title="Documents & Spreadsheets" icon={<DocsIcon className="h-6 w-6 text-blue-500" />} showViewAll={false}>
                        <ul className="divide-y divide-gray-200">
                            {documents.map((doc) => (
                                <li key={doc.id} className="py-3 flex items-center justify-between hover:bg-gray-50 rounded-md -mx-4 px-4 transition-colors cursor-pointer" onClick={() => setActiveView(doc.type === DocumentType.DOCS ? 'documents' : 'spreadsheets')}>
                                    <div className="flex items-center min-w-0">
                                        {doc.type === DocumentType.DOCS ? <DocsIcon className="h-6 w-6 text-blue-500 shrink-0" /> : <SheetsIcon className="h-6 w-6 text-green-500 shrink-0" />}
                                        <div className="ml-3 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                                            <p className="text-sm text-gray-500 truncate">By {doc.owner} &middot; {doc.lastEdited}</p>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-2 shrink-0" />
                                </li>
                            ))}
                        </ul>
                    </WidgetCard>
                )}
                
                {emails.length > 0 && (
                     <WidgetCard title="Emails" icon={<MailIcon className="h-6 w-6 text-red-500" />} showViewAll={false}>
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
                )}

                {forumThreads.length > 0 && (
                     <WidgetCard title="Forum Discussions" icon={<ForumIcon className="h-6 w-6 text-purple-500" />} showViewAll={false}>
                        <ul className="divide-y divide-gray-200">
                         {forumThreads.map((thread) => (
                           <li key={thread.id} className="py-3 hover:bg-gray-50 rounded-md -mx-4 px-4 transition-colors cursor-pointer" onClick={() => setActiveView('forum')}>
                             <p className="text-sm font-medium text-gray-900 truncate">{thread.title}</p>
                             <p className="text-sm text-gray-500 truncate">Started by {thread.authorName}</p>
                           </li>
                         ))}
                       </ul>
                     </WidgetCard>
                )}
            </div>

            <style>{`
                @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
