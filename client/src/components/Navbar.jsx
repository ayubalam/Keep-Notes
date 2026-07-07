export default function Navbar({ searchQuery, setSearchQuery, onLogout }) {
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'User' };
  const initial = user.username.charAt(0).toUpperCase();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <span className="text-2xl text-yellow-500 font-bold">💡</span>
        <span className="text-xl font-semibold text-gray-700 tracking-tight">KeepNotes</span>
      </div>
      
      <div className="flex-1 max-w-2xl mx-8">
        <input 
          type="text" 
          placeholder="Search notes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-gray-300 focus:outline-none transition-colors"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={onLogout}
          className="text-xs font-medium text-gray-500 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 border border-gray-200 px-3 py-1.5 rounded-lg"
        >
          Logout
        </button>
        <div className="w-9 h-9 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm" title={user.username}>
          {initial}
        </div>
      </div>
    </nav>
  )
}