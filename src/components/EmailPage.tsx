import React from 'react';
import type { Email } from '../types';
import { WidgetCard } from './WidgetCard';
import { GmailIcon } from './Icons';

export const EmailPage: React.FC<{ emails: Email[] }> = ({ emails }) => {
  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Corporate Email</h1>
      <p className="text-gray-500 mb-8">A view of your recent messages.</p>

      <WidgetCard title="Inbox" icon={<GmailIcon className="h-6 w-6 text-red-500" />} showViewAll={false}>
        {emails.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {emails.map((email) => (
              <li key={email.id} className="p-4 hover:bg-gray-50 cursor-pointer -mx-4 px-4 transition-colors">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{email.sender}</p>
                        <p className="text-sm text-gray-700 font-medium truncate">{email.subject}</p>
                    </div>
                    <p className="text-xs text-gray-500 flex-shrink-0 ml-4">{email.timestamp}</p>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">{email.snippet}</p>
              </li>
            ))}
          </ul>
        ) : (
           <p className="text-gray-500 text-center py-8">Your inbox is empty.</p>
        )}
      </WidgetCard>
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
