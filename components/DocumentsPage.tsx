import React, { useMemo } from 'react';
import type { DocumentItem } from '../types';
import { WidgetCard } from './WidgetCard';
import { DocsIcon, ChevronRightIcon } from './Icons';

export const DocumentsPage: React.FC<{ documents: DocumentItem[] }> = ({ documents }) => {
  const { ownedDocuments, sharedDocuments } = useMemo(() => {
    const owned = documents.filter(doc => doc.owner === 'Alex Chen');
    const shared = documents.filter(doc => doc.owner !== 'Alex Chen');
    return { ownedDocuments: owned, sharedDocuments: shared };
  }, [documents]);

  const DocumentList: React.FC<{ items: DocumentItem[], iconColor: string }> = ({ items, iconColor }) => (
      <ul className="divide-y divide-gray-200">
        {items.map((doc) => (
          <li key={doc.id} className="py-3 flex items-center justify-between hover:bg-gray-50 rounded-md -mx-4 px-4 transition-colors cursor-pointer">
            <div className="flex items-center min-w-0">
              <DocsIcon className={`h-6 w-6 ${iconColor} shrink-0`} />
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                <p className="text-sm text-gray-500 truncate">Edited by {doc.owner} &middot; {doc.lastEdited}</p>
              </div>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-2 shrink-0"/>
          </li>
        ))}
      </ul>
  );

  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
      <p className="text-gray-500 mb-8">All Google Docs created by you or shared with you.</p>

      <div className="space-y-6">
        <WidgetCard title="Created by Me" icon={<DocsIcon className="h-6 w-6 text-blue-500" />} showViewAll={false}>
          {ownedDocuments.length > 0 ? (
            <DocumentList items={ownedDocuments} iconColor="text-blue-500" />
          ) : (
             <p className="text-gray-500 text-center py-8">You haven't created any documents yet.</p>
          )}
        </WidgetCard>

        <WidgetCard title="Shared with Me" icon={<DocsIcon className="h-6 w-6 text-gray-500" />} showViewAll={false}>
          {sharedDocuments.length > 0 ? (
            <DocumentList items={sharedDocuments} iconColor="text-blue-500" />
          ) : (
             <p className="text-gray-500 text-center py-8">No documents have been shared with you.</p>
          )}
        </WidgetCard>
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