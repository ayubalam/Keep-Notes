export default function Sidebar({ currentTab, setCurrentTab, counts }) {
  const menuItems = [
    { id: 'notes', label: 'Notes', icon: '💡', count: counts.notes },
    { id: 'archive', label: 'Archive', icon: '📥', count: counts.archive },
    { id: 'trash', label: 'Deleted', icon: '🗑️', count: counts.trash }
  ]

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-neutral-800 p-4 space-y-1 transition-colors">
      {menuItems.map((item) => {
        const isActive = currentTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.count > 0 && (
              <span className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full font-bold">
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </aside>
  )
}