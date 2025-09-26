import React from 'react';
import { SearchIcon, BellIcon } from './Icons';

interface HeaderProps {
    onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
          const query = event.currentTarget.value;
          onSearch(query);
          event.currentTarget.value = '';
      }
  };

  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 md:px-8 shrink-0">
      <div className="flex items-center w-full max-w-lg">
        <div className="relative w-full">
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
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center">
          <img
            className="h-9 w-9 rounded-full object-cover"
            src="https://picsum.photos/100/100"
            alt="User avatar"
          />
          <div className="ml-3 hidden md:block">
            <p className="text-sm font-medium text-gray-700">Alex Chen</p>
            <p className="text-xs text-gray-500">Product Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};
