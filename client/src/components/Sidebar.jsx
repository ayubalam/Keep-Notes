export default function Sidebar({ currentTab, setCurrentTab, counts = { notes: 0, archive: 0, trash: 0 } }) {
  const menuItems = [
    { id: 'notes', label: 'Notes', icon: '💡', count: counts.notes },
    { id: 'archive', label: 'Archive', icon: '📥', count: counts.archive },
    { id: 'trash', label: 'Trash', icon: '🗑️', count: counts.trash }
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block select-none">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
                isActive 
                  ? 'bg-yellow-50 text-yellow-800' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              
              {item.count > 0 && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full transition-colors ${
                  isActive ? 'bg-yellow-200 text-yellow-900' : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}