import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import NoteCard from './components/NoteCard'

export default function App() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Project Idea', content: 'Build a production grade Keep Notes application using MERN stack.', isPinned: true },
    { id: 2, title: 'Shopping List', content: 'Milk, Eggs, Coffee beans, Avocado.', isPinned: false }
  ])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleCreateNote = (e) => {
    e.preventDefault()
    if (!content.trim() && !title.trim()) return

    const newNote = {
      id: Date.now(),
      title,
      content,
      isPinned: false
    }

    setNotes([newNote, ...notes])
    setTitle('')
    setContent('')
  }

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          {/* Note Input Form */}
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

          {/* Notes Grid Display */}
          {notes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">Notes you add appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onDelete={handleDeleteNote} 
                  onUpdate={handleUpdateNote} 
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}