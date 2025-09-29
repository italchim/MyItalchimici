import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, LogoutIcon, PlusCircleIcon, GmailIcon, CalendarIcon, LinkIcon, ChevronDownIcon, TasksIcon } from './Icons';
import type { View } from '../types';


interface HeaderProps {
    onSearch: (query: string) => void;
    onLogout: () => void;
    activeView: View;
    userName: string;
    userAvatarUrl: string;
}

const ActionLink: React.FC<{ href: string; icon: React.ReactNode; text: string; }> = ({ href, icon, text }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-colors text-sm font-medium"
        aria-label={text}
        title={text}
    >
        {icon}
        <span className="hidden lg:inline">{text}</span>
    </a>
);


export const Header: React.FC<HeaderProps> = ({ onSearch, onLogout, activeView, userName, userAvatarUrl }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [isLinksDropdownOpen, setIsLinksDropdownOpen] = useState(false);
  const linksDropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
          const query = event.currentTarget.value;
          onSearch(query);
          event.currentTarget.value = '';
      }
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
            setIsUserDropdownOpen(false);
        }
        if (linksDropdownRef.current && !linksDropdownRef.current.contains(event.target as Node)) {
            setIsLinksDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderContextualActions = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="hidden md:flex items-center space-x-3">
            <ActionLink
              href="https://mail.google.com"
              icon={<GmailIcon className="h-5 w-5 text-red-500" />}
              text="Open Gmail"
            />
            <ActionLink
              href="https://calendar.google.com"
              icon={<CalendarIcon className="h-5 w-5 text-blue-500" />}
              text="Open Calendar"
            />
             <div className="relative" ref={linksDropdownRef}>
                <button
                    onClick={() => setIsLinksDropdownOpen(!isLinksDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-colors text-sm font-medium"
                    title="Links"
                >
                    <LinkIcon className="h-5 w-5" />
                    <span className="hidden lg:inline">Links</span>
                    <ChevronDownIcon className="h-4 w-4" />
                </button>
                {isLinksDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10 animate-fade-in-down">
                        <a href="https://assoservizipaghe.aib.bs.it/HRPortal/" target="_blank" rel="noopener noreferrer" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Cedolini/Paghe
                        </a>
                        <a href="https://mynest.fondoest.it/" target="_blank" rel="noopener noreferrer" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            FondoEst
                        </a>
                    </div>
                )}
            </div>
          </div>
        );
      case 'documents':
        return (
           <div className="hidden lg:flex">
             <a
                href="https://docs.google.com/document/create"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-colors text-sm font-medium"
              >
              <PlusCircleIcon className="h-5 w-5 text-blue-600" />
              <span>New Document</span>
            </a>
           </div>
        );
      case 'spreadsheets':
        return (
          <div className="hidden lg:flex">
            <a
              href="https://docs.google.com/spreadsheets/create"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <PlusCircleIcon className="h-5 w-5 text-green-600" />
              <span>New Spreadsheet</span>
            </a>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <header className="flex items-center justify-between h-16 bg-black border-b border-gray-800 px-4 md:px-8 shrink-0 space-x-4">
      {/* Left & Center Section */}
      <div className="flex items-center flex-1 min-w-0 gap-6">
        <div className="relative flex-shrink w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search documents, people, or news..."
            className="w-full bg-gray-200 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onKeyDown={handleKeyDown}
            aria-label="Search intranet"
          />
        </div>
        <div className="flex-shrink-0">
          {renderContextualActions()}
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4 shrink-0">
        <a
            href="https://tasks.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-gray-300 hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
            aria-label="Open Google Tasks"
        >
            <TasksIcon className="h-6 w-6" />
        </a>
        <button className="p-2 rounded-full text-gray-300 hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="relative" ref={userDropdownRef}>
            <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center p-1 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500">
              <img
                className="h-9 w-9 rounded-full object-cover"
                src={userAvatarUrl}
                alt="User avatar"
                onError={(e) => { e.currentTarget.src = 'https://picsum.photos/100/100'; }} // Fallback
              />
              <div className="ml-3 hidden md:block text-left">
                <p className="text-sm font-medium text-gray-200">{userName}</p>
                <p className="text-xs text-gray-400">Product Manager</p>
              </div>
            </button>
            {isUserDropdownOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10 animate-fade-in-down">
                    <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <LogoutIcon className="h-5 w-5 mr-2 text-gray-500" />
                        Sign Out
                    </button>
                 </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
};