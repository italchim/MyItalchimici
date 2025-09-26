import React from 'react';
import { HomeIcon, DocsIcon, SheetsIcon, GmailIcon, TeamIcon, SettingsIcon, LogoIcon, CalendarIcon, LightbulbIcon, ForumIcon, PolicyIcon } from './Icons';
import type { View } from '../types';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
      active
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
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
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 shrink-0 px-4">
        <LogoIcon className="h-8 w-8 text-gray-900" />
        <span className="ml-2 text-lg font-bold text-gray-800">MyItalchimici Intra</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavItem icon={<HomeIcon className="h-5 w-5" />} label="Home" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
        <NavItem icon={<CalendarIcon className="h-5 w-5" />} label="Ferie e Permessi" active={activeView === 'holidays'} onClick={() => setActiveView('holidays')} />
        <NavItem icon={<DocsIcon className="h-5 w-5" />} label="Documents" active={activeView === 'documents'} onClick={() => setActiveView('documents')} />
        <NavItem icon={<SheetsIcon className="h-5 w-5" />} label="Spreadsheets" active={activeView === 'spreadsheets'} onClick={() => setActiveView('spreadsheets')} />
        <NavItem icon={<LightbulbIcon className="h-5 w-5" />} label="Suggerimenti" active={activeView === 'suggestions'} onClick={() => setActiveView('suggestions')} />
        <NavItem icon={<ForumIcon className="h-5 w-5" />} label="Forum" active={activeView === 'forum'} onClick={() => setActiveView('forum')} />
        <NavItem icon={<PolicyIcon className="h-5 w-5" />} label="Politiche e Procedure" active={activeView === 'policies'} onClick={() => setActiveView('policies')} />
        <NavItem icon={<GmailIcon className="h-5 w-5" />} label="Email" onClick={() => {}} />
        <NavItem icon={<TeamIcon className="h-5 w-5" />} label="Team Directory" onClick={() => {}} />
      </nav>
      <div className="p-4 border-t border-gray-200">
        <NavItem icon={<SettingsIcon className="h-5 w-5" />} label="Settings" onClick={() => {}} />
      </div>
    </aside>
  );
};