export default function Sidebar({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'archive', label: 'Archive', icon: '📥' },
    { id: 'trash', label: 'Trash', icon: '🗑️' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-61px)] p-4 space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            currentTab === tab.id
              ? 'bg-yellow-100/60 text-yellow-800'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </aside>
  )
}