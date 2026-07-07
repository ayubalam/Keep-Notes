import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import NoteCard from './components/NoteCard'
import Auth from './components/Auth'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const [currentTab, setCurrentTab] = useState('notes')
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [selectedNoteIds, setSelectedNoteIds] = useState([])
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark')
  
  const API_URL = 'http://localhost:5000/api/notes'
  const colors = ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb']

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setNotes([])
    setSelectedNoteIds([])
  }, [])

  const fetchNotes = useCallback(async () => {
    if (!token) return
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setNotes(data)
      } else {
        handleLogout()
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }, [token, handleLogout])

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNotes()
    }
  }, [token, fetchNotes])

  const handleTabChange = (tabId) => {
    setSelectedNoteIds([])
    setCurrentTab(tabId)
    setIsDrawerOpen(false)
  }

  const handleAuthSuccess = () => {
    setToken(localStorage.getItem('token'))
  }

  const handleCreateNote = async (e) => {
    e.preventDefault()
    if (!content.trim() && !title.trim()) return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, color: selectedColor })
      })
      if (response.ok) {
        const newNote = await response.json()
        setNotes([newNote, ...notes])
        setTitle('')
        setContent('')
        setSelectedColor('#ffffff')
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        setNotes(notes.filter(note => note._id !== id))
        setSelectedNoteIds(prev => prev.filter(selectedId => selectedId !== id))
      }
    } catch (error) {
      console.error('Error deleting note permanently:', error)
    }
  }

  const handleUpdateNote = async (updatedNote) => {
    try {
      const response = await fetch(`${API_URL}/${updatedNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedNote)
      })
      if (response.ok) {
        const data = await response.json()
        setNotes(notes.map(note => note._id === data._id ? data : note))
        setEditingNote(null)
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleToggleSelectNote = (id) => {
    setSelectedNoteIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = async (updateFields) => {
    const promises = selectedNoteIds.map(id => {
      const targetNote = notes.find(n => n._id === id);
      if (!targetNote) return null;
      return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...targetNote, ...updateFields })
      }).then(res => res.ok ? res.json() : null);
    });

    try {
      const updatedResults = await Promise.all(promises);
      const validUpdates = updatedResults.filter(Boolean);
      
      setNotes(prevNotes => prevNotes.map(note => {
        const match = validUpdates.find(u => u._id === note._id);
        return match ? match : note;
      }));
      setSelectedNoteIds([]);
    } catch (err) {
      console.error("Bulk update failure:", err);
    }
  };

  const handleBulkDeleteForever = async () => {
    const promises = selectedNoteIds.map(id => 
      fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.ok ? id : null)
    );

    try {
      const deletedIds = await Promise.all(promises);
      const successfulIds = deletedIds.filter(Boolean);
      setNotes(prev => prev.filter(note => !successfulIds.includes(note._id)));
      setSelectedNoteIds([]);
    } catch (err) {
      console.error("Bulk delete failure:", err);
    }
  };

  const handleEmptyTrashAll = async () => {
    const trashedNotes = notes.filter(n => n.isTrashed);
    const promises = trashedNotes.map(note => 
      fetch(`${API_URL}/${note._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.ok ? note._id : null)
    );

    try {
      const deletedIds = await Promise.all(promises);
      const successfulIds = deletedIds.filter(Boolean);
      setNotes(prev => prev.filter(note => !successfulIds.includes(note._id)));
    } catch (err) {
      console.error("Wiping trash folder failure:", err);
    }
  };

  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />
  }

  const filteredNotes = notes.filter(note => 
    (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.content || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isValidNote = (note) => {
    return (note.title && note.title.trim() !== "") || (note.content && note.content.trim() !== "");
  };

  const viewNotes = filteredNotes.filter(note => {
    if (!isValidNote(note)) return false; 

    if (currentTab === 'trash') return note.isTrashed
    if (currentTab === 'archive') return note.isArchived && !note.isTrashed
    return !note.isArchived && !note.isTrashed
  })

  const sidebarCounts = {
    notes: notes.filter(n => isValidNote(n) && !n.isArchived && !n.isTrashed).length,
    archive: notes.filter(n => isValidNote(n) && n.isArchived && !n.isTrashed).length,
    trash: notes.filter(n => isValidNote(n) && n.isTrashed).length
  }

  const pinnedNotes = viewNotes.filter(note => note.isPinned)
  const regularNotes = viewNotes.filter(note => !note.isPinned)

  const emptyStateConfig = {
    notes: { icon: '💡', text: 'Notes you add appear here' },
    archive: { icon: '📥', text: 'Your archived notes appear here' },
    trash: { icon: '🗑️', text: 'No notes in Deleted folder' }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased pb-24 md:pb-6 transition-colors duration-200">
      
      {/* Top Header/Navbar Section */}
      <div className="flex items-center bg-white border-b border-gray-200 px-4">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-1">
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onLogout={handleLogout} />
        </div>
      </div>
      
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar currentTab={currentTab} setCurrentTab={handleTabChange} counts={sidebarCounts} />
        </div>
        
        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          {currentTab === 'notes' && (
            <form 
              onSubmit={handleCreateNote} 
              style={{ backgroundColor: selectedColor }} 
              className="max-w-xl mx-auto border border-gray-200 rounded-xl shadow-sm p-4 mb-6 md:mb-8 space-y-3 transition-colors"
            >
              <input 
                type="text" 
                placeholder="Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full font-medium text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent text-base"
              />
              <textarea 
                placeholder="Take a note..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
                className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none resize-none bg-transparent"
              />
              <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {colors.map(c => (
                    <button
                      key={c}
                      type="button"
                      style={{ backgroundColor: c }}
                      onClick={() => setSelectedColor(c)}
                      className={`w-4 h-4 rounded-full border transition-transform hover:scale-110 ${selectedColor === c ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-300'}`}
                    />
                  ))}
                </div>
                <button type="submit" className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm rounded-lg transition-colors shadow-sm ml-auto">
                  Close
                </button>
              </div>
            </form>
          )}

          {currentTab === 'trash' && viewNotes.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-center">
              <p className="text-amber-800 text-sm font-medium">
                Notes in Deleted will persist until emptied permanently.
              </p>
              <button 
                onClick={handleEmptyTrashAll}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                💥 Empty Deleted Now
              </button>
            </div>
          )}

          {viewNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 select-none animate-fade-in">
              <span className="text-6xl md:text-7xl mb-4 opacity-25">
                {emptyStateConfig[currentTab]?.icon || '📝'}
              </span>
              <p className="text-gray-500 font-medium text-base md:text-lg">
                {emptyStateConfig[currentTab]?.text || 'No notes found'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {pinnedNotes.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Pinned</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pinnedNotes.map(note => (
                      <NoteCard 
                        key={note._id} 
                        note={note} 
                        onDelete={handleDeleteNote} 
                        onUpdate={handleUpdateNote} 
                        onEditClick={setEditingNote}
                        searchQuery={searchQuery}
                        isSelected={selectedNoteIds.includes(note._id)}
                        onToggleSelect={handleToggleSelectNote}
                      />
                    ))}
                  </div>
                </div>
              )}

              {regularNotes.length > 0 && (
                <div>
                  {pinnedNotes.length > 0 && (
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Others</h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regularNotes.map(note => (
                      <NoteCard 
                        key={note._id} 
                        note={note} 
                        onDelete={handleDeleteNote} 
                        onUpdate={handleUpdateNote} 
                        onEditClick={setEditingNote}
                        searchQuery={searchQuery}
                        isSelected={selectedNoteIds.includes(note._id)}
                        onToggleSelect={handleToggleSelectNote}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Simplified Sliding Navigation Drawer Sheet */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in">
          <div 
            onClick={() => setIsDrawerOpen(false)} 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
          />
          
          <div className="relative w-72 max-w-xs bg-white h-full shadow-2xl flex flex-col p-4 z-50 transition-transform">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <span className="font-bold text-gray-800 text-lg tracking-wide pl-2">Google Keep Clone</span>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Custom Filtered Nav List */}
            <nav className="flex-1 space-y-1">
              {[
                { id: 'notes', label: 'Notes', icon: '💡', count: sidebarCounts.notes },
                { id: 'archive', label: 'Archive', icon: '📥', count: sidebarCounts.archive },
                { id: 'trash', label: 'Deleted', icon: '🗑️', count: sidebarCounts.trash }
              ].map((item) => {
                const isCurrent = currentTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isCurrent 
                        ? 'bg-yellow-50 text-yellow-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
                        {item.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Dark Mode toggle layout */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
                  {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-yellow-500 transition-colors focus:outline-none"
                >
                  <span
                    className={`${
                      darkMode ? 'translate-x-6 bg-neutral-900' : 'translate-x-1 bg-white'
                    } inline-block h-4 w-4 transform rounded-full transition-transform`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectedNoteIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 md:px-6 py-3 rounded-xl shadow-xl flex items-center justify-between md:justify-start space-x-3 md:space-x-6 z-50 w-[92%] max-w-lg transition-all border border-gray-800">
          <span className="text-xs md:text-sm font-medium text-gray-300 whitespace-nowrap">
            Selected <strong className="text-white font-semibold">{selectedNoteIds.length}</strong>
          </span>
          <div className="h-4 w-px bg-gray-700 hidden sm:block" />
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            {currentTab === 'trash' ? (
              <>
                <button 
                  onClick={() => handleBulkUpdate({ isTrashed: false })}
                  className="px-2.5 py-1.5 text-[11px] font-medium hover:bg-gray-800 rounded-lg transition-colors text-emerald-400 whitespace-nowrap"
                >
                  ↩️ Restore
                </button>
                <button 
                  onClick={handleBulkDeleteForever}
                  className="px-2.5 py-1.5 text-[11px] font-medium hover:bg-red-900/40 text-red-400 rounded-lg transition-colors whitespace-nowrap"
                >
                  💥 Wipe
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleBulkUpdate({ isArchived: currentTab !== 'archive' })}
                  className="px-2.5 py-1.5 text-[11px] font-medium hover:bg-gray-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  {currentTab === 'archive' ? '📤 Unarchive' : '📥 Archive'}
                </button>
                <button 
                  onClick={() => handleBulkUpdate({ isTrashed: true, isPinned: false })}
                  className="px-2.5 py-1.5 text-[11px] font-medium hover:bg-red-900/40 text-red-400 rounded-lg transition-colors whitespace-nowrap"
                >
                  🗑️ Trash
                </button>
              </>
            )}
          </div>
          
          <div className="h-4 w-px bg-gray-700 hidden sm:block" />
          <button 
            onClick={() => setSelectedNoteIds([])}
            className="text-[11px] text-gray-400 hover:text-white transition-colors pl-1"
          >
            Clear
          </button>
        </div>
      )}

      {editingNote && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            style={{ backgroundColor: editingNote.color || '#ffffff' }}
            className="border border-gray-200 rounded-xl shadow-xl p-5 w-full max-w-lg space-y-4 transition-colors max-h-[90vh] overflow-y-auto"
          >
            <input 
              type="text" 
              value={editingNote.title}
              onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              className="w-full font-semibold text-gray-800 text-lg focus:outline-none bg-transparent"
              placeholder="Title"
            />
            <textarea 
              value={editingNote.content}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              rows={5}
              className="w-full text-sm text-gray-600 focus:outline-none resize-none bg-transparent"
              placeholder="Note text..."
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              <div className="flex flex-wrap gap-1.5">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    style={{ backgroundColor: c }}
                    onClick={() => setEditingNote({ ...editingNote, color: c })}
                    className={`w-4 h-4 rounded-full border transition-transform hover:scale-110 ${editingNote.color === c ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-300'}`}
                  />
                ))}
              </div>
              <div className="flex space-x-2 ml-auto">
                <button 
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 hover:bg-black/5 text-gray-600 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleUpdateNote(editingNote)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}