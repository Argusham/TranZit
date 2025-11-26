interface Tab {
  id: string;
  label: string;
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
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 py-2.5 px-4 text-center rounded-full font-medium transition-all duration-300 ease-in-out
              ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-md transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
              }
            `}
          >
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
