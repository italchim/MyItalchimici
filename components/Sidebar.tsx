import React from 'react';
import { HomeIcon, DocsIcon, SheetsIcon, GmailIcon, TeamIcon, SettingsIcon, LogoIcon, CalendarIcon, LightbulbIcon, ForumIcon, PolicyIcon, TasksIcon } from './Icons';
import type { View } from '../types';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center w-full px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 text-left border ${
      active
        ? 'border-white text-white bg-gray-800'
        : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-black border-r border-gray-800">
      <div className="flex items-center justify-center h-16 border-b border-gray-800 shrink-0 px-4">
        <LogoIcon className="h-8 w-8 text-white" />
        <span className="ml-2 text-lg font-bold text-white">MyItalchimici Intra</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavItem icon={<HomeIcon className="h-5 w-5" />} label="Home" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
        <NavItem icon={<CalendarIcon className="h-5 w-5" />} label="Ferie e Permessi" active={activeView === 'holidays'} onClick={() => setActiveView('holidays')} />
        <NavItem icon={<DocsIcon className="h-5 w-5" />} label="Documents" active={activeView === 'documents'} onClick={() => setActiveView('documents')} />
        <NavItem icon={<SheetsIcon className="h-5 w-5" />} label="Spreadsheets" active={activeView === 'spreadsheets'} onClick={() => setActiveView('spreadsheets')} />
        <NavItem icon={<LightbulbIcon className="h-5 w-5" />} label="Suggerimenti" active={activeView === 'suggestions'} onClick={() => setActiveView('suggestions')} />
        <NavItem icon={<ForumIcon className="h-5 w-5" />} label="Forum" active={activeView === 'forum'} onClick={() => setActiveView('forum')} />
        <NavItem icon={<PolicyIcon className="h-5 w-5" />} label="Politiche e Procedure" active={activeView === 'policies'} onClick={() => setActiveView('policies')} />
        <NavItem icon={<TeamIcon className="h-5 w-5" />} label="Team Directory" active={activeView === 'team'} onClick={() => setActiveView('team')} />
        <NavItem icon={<GmailIcon className="h-5 w-5" />} label="Email" active={activeView === 'email'} onClick={() => setActiveView('email')} />
        <NavItem icon={<TasksIcon className="h-5 w-5" />} label="Open Tasks" active={activeView === 'tasks'} onClick={() => setActiveView('tasks')} />
      </nav>
      <div className="p-4 border-t border-gray-800">
        <NavItem icon={<SettingsIcon className="h-5 w-5" />} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
      </div>
    </aside>
  );
};