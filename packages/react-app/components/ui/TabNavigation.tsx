import React from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabNavigationProps) {
  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-full p-1.5 shadow-inner">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              ${tab.icon ? 'flex-shrink-0 w-10 h-10 px-0' : 'flex-1 px-2 sm:px-4'}
              py-2.5 flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-in-out
              ${
                activeTab === tab.id
                  ? tab.icon
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-md transform scale-105"
                    : "bg-white text-blue-600 shadow-md transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
              }
            `}
            aria-label={tab.label}
          >
            {tab.icon ? (
              <span className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-gray-700"}`}>{tab.icon}</span>
            ) : (
              <span className="text-xs sm:text-sm truncate">{tab.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
