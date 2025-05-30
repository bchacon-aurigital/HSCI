// components/ui/TabSelector.tsx
import React from 'react';
import { Info } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = React.useState<string | null>(null);

  return (
    <div className={`relative ${className}`}>
      <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative flex-1">
            <button
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              onMouseEnter={() => tab.disabled && tab.tooltip && setShowTooltip(tab.id)}
              onMouseLeave={() => setShowTooltip(null)}
              className={`
                w-full px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : tab.disabled
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }
              `}
              disabled={tab.disabled}
            >
              <div className="flex items-center justify-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
                {tab.disabled && (
                  <Info className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </button>
            
            {/* Tooltip */}
            {showTooltip === tab.id && tab.tooltip && (
              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                {tab.tooltip}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};