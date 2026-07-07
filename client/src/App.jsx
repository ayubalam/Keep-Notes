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
  const API_URL = 'http://localhost:5000/api/notes'

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setNotes([])
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
        // Wrapped in setTimeout to prevent synchronous state mutations during the effect call loop
        setTimeout(() => setNotes(data), 0)
      } else {
        setTimeout(() => handleLogout(), 0)
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }, [token, handleLogout])

  useEffect(() => {
    if (token) {
      fetchNotes()
    }
  }, [token, fetchNotes])

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
        body: JSON.stringify({ title, content })
      })
      if (response.ok) {
        const newNote = await response.json()
        setNotes([newNote, ...notes])
        setTitle('')
        setContent('')
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
      }
    } catch (error) {
      console.error('Error deleting note:', error)
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

  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />
  }

  const filteredNotes = notes.filter(note => 
    (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.content || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const viewNotes = filteredNotes.filter(note => {
    if (currentTab === 'trash') return note.isTrashed
    if (currentTab === 'archive') return note.isArchived && !note.isTrashed
    return !note.isArchived && !note.isTrashed
  })

  const pinnedNotes = viewNotes.filter(note => note.isPinned)
  const regularNotes = viewNotes.filter(note => !note.isPinned)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onLogout={handleLogout} />
      
      <div className="flex flex-1">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        
        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          {currentTab === 'notes' && (
            <form onSubmit={handleCreateNote} className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-8 space-y-3">
              <input 
                type="text" 
                placeholder="Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <textarea 
                placeholder="Take a note..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
                className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none resize-none"
              />
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm rounded-lg transition-colors shadow-sm">
                  Close
                </button>
              </div>
            </form>
          )}

          {viewNotes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No notes found in {currentTab}</p>
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
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {editingNote && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-5 w-full max-w-lg space-y-4">
            <input 
              type="text" 
              value={editingNote.title}
              onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              className="w-full font-semibold text-gray-800 text-lg focus:outline-none"
              placeholder="Title"
            />
            <textarea 
              value={editingNote.content}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              rows={5}
              className="w-full text-sm text-gray-600 focus:outline-none resize-none"
              placeholder="Note text..."
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button 
                onClick={() => setEditingNote(null)}
                className="px-4 py-2 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleUpdateNote(editingNote)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}