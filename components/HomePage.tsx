import React from 'react';
import { MOCK_CALENDAR_EVENTS, MOCK_EMAILS, MOCK_TASKS } from '../constants';
import type { User, NewsArticle } from '../types';

interface HomePageProps {
  user: User;
  news: NewsArticle[];
}

const Card: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
        {children}
    </div>
);

export const HomePage: React.FC<HomePageProps> = ({ user, news }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Bentornato, {user.name.split(' ')[0]}!</h1>
      <p className="text-slate-600 mb-8">Ecco il tuo riepilogo di oggi.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="Notizie Aziendali">
            <ul className="space-y-4">
              {news.map(item => (
                <li key={item.id} className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold text-slate-700">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{item.excerpt}</p>
                  <p className="text-xs text-slate-400 mt-2">{item.date}</p>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Riepilogo Posta in Arrivo">
            <ul className="space-y-3">
              {MOCK_EMAILS.map(email => (
                <li key={email.id} className={`p-3 rounded-lg flex items-start space-x-3 ${!email.isRead ? 'bg-slate-100' : ''}`}>
                   {!email.isRead && <div className="w-2 h-2 rounded-full bg-slate-500 mt-2 flex-shrink-0"></div>}
                   <div className={email.isRead ? 'ml-5' : ''}>
                    <p className="font-semibold text-slate-700 text-sm">{email.sender}</p>
                    <p className="text-slate-600 text-sm">{email.subject}</p>
                    <p className="text-slate-500 text-xs truncate">{email.snippet}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-8">
          <Card title="Calendario di Oggi">
            <ul className="space-y-4">
              {MOCK_CALENDAR_EVENTS.map(event => (
                <li key={event.id} className="flex items-start space-x-3">
                  <div className="w-1 h-full bg-slate-500 rounded-full"></div>
                  <div className="flex-1 -mt-1">
                    <p className="font-semibold text-sm text-slate-700">{event.title}</p>
                    <p className="text-xs text-slate-500">{event.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Le Tue Attività">
            <ul className="space-y-3">
              {MOCK_TASKS.map(task => (
                <li key={task.id} className="flex items-center">
                  <input type="checkbox" defaultChecked={task.isCompleted} className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500" />
                  <div className="ml-3">
                    <label className={`text-sm ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</label>
                    <p className={`text-xs ${task.isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>{task.dueDate}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

      </div>
    </div>
  );
};