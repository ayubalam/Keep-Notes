export default function Navbar({ searchQuery, setSearchQuery, onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const initial = user.username ? user.username.charAt(0).toUpperCase() : 'U'

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 md:px-6 sticky top-0 z-50 select-none shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Brand Logo Area */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <span className="text-2xl">💡</span>
            <span className="font-bold text-xl tracking-tight text-gray-800 bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
              KeepNotes
            </span>
          </div>
          
          {/* User Controls - Visible on Mobile Right Corner */}
          <div className="flex items-center space-x-3 sm:hidden">
            <button 
              onClick={onLogout}
              className="px-3 py-1.5 border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white font-bold shadow-sm text-sm">
              {initial}
            </div>
          </div>
        </div>

        {/* Dynamic Search Bar Component */}
        <div className="w-full sm:max-w-xl flex-1 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
          <input
            type="text"
            placeholder="Search your workspace content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 text-sm pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400/50 transition-all placeholder-gray-400 border border-transparent focus:border-transparent"
          />
        </div>

        {/* User Controls - Desktop Layout Only */}
        <div className="hidden sm:flex items-center space-x-4">
          <button 
            onClick={onLogout}
            className="px-4 py-2 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
          >
            Logout
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white font-bold shadow-md transform hover:rotate-12 transition-transform">
            {initial}
          </div>
        </div>

      </div>
    </nav>
  )
}