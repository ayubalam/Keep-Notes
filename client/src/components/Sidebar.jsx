export default function Sidebar() {
  return (
    <aside className="w-64 min-h-[calc(100vh-61px)] bg-white border-r border-gray-200 p-4 space-y-2 hidden md:block">
      <button className="w-full flex items-center space-x-4 px-4 py-3 bg-yellow-100 text-yellow-900 font-medium rounded-xl transition-all">
        <span>📝</span>
        <span>Notes</span>
      </button>
      <button className="w-full flex items-center space-x-4 px-4 py-3 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-all">
        <span>📥</span>
        <span>Archive</span>
      </button>
      <button className="w-full flex items-center space-x-4 px-4 py-3 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-all">
        <span>🗑️</span>
        <span>Trash</span>
      </button>
    </aside>
  )
}