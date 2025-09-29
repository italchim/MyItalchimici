import React from 'react';

interface WidgetCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  showViewAll?: boolean;
  onViewAll?: () => void;
  headerAction?: React.ReactNode;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ title, icon, children, showViewAll = true, onViewAll, headerAction }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
            {icon}
            <h3 className="text-lg font-semibold text-gray-800 ml-3">{title}</h3>
        </div>
        <div className="flex items-center space-x-4">
            {headerAction}
            {showViewAll && <button onClick={onViewAll} className="text-sm font-medium text-blue-600 hover:text-blue-800">View all</button>}
        </div>
      </div>
      <div className="p-4 md:p-5">
        {children}
      </div>
    </div>
  );
};
