import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, LogoutIcon, PlusCircleIcon, GmailIcon, CalendarIcon } from './Icons';
import type { View } from '../types';


interface HeaderProps {
    onSearch: (query: string) => void;
    onLogout: () => void;
    activeView: View;
}

const ActionLink: React.FC<{ href: string; icon: React.ReactNode; text: string; }> = ({ href, icon, text }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition-colors text-sm font-medium"
        aria-label={text}
    >
        {icon}
        <span>{text}</span>
    </a>
);


export const Header: React.FC<HeaderProps> = ({ onSearch, onLogout, activeView }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
          const query = event.currentTarget.value;
          onSearch(query);
          event.currentTarget.value = '';
      }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
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
          <div className="hidden lg:flex items-center space-x-3">
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
          </div>
        );
      case 'documents':
        return (
           <div className="hidden lg:flex">
             <ActionLink
              href="https://docs.google.com/document/create"
              icon={<PlusCircleIcon className="h-5 w-5 text-blue-600" />}
              text="New Document"
            />
           </div>
        );
      case 'spreadsheets':
        return (
          <div className="hidden lg:flex">
            <ActionLink
              href="https://docs.google.com/spreadsheets/create"
              icon={<PlusCircleIcon className="h-5 w-5 text-green-600" />}
              text="New Spreadsheet"
            />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 md:px-8 shrink-0 space-x-4">
      {/* Left & Center Section */}
      <div className="flex items-center flex-1 min-w-0">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search documents, people, or news..."
            className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onKeyDown={handleKeyDown}
            aria-label="Search intranet"
          />
        </div>
        <div className="ml-6 flex-shrink-0">
          {renderContextualActions()}
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4 shrink-0">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <img
                className="h-9 w-9 rounded-full object-cover"
                src="https://picsum.photos/100/100"
                alt="User avatar"
              />
              <div className="ml-3 hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">Alex Chen</p>
                <p className="text-xs text-gray-500">Product Manager</p>
              </div>
            </button>
            {isDropdownOpen && (
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