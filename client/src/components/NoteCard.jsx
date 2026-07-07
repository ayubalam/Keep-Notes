export default function NoteCard({ note, onDelete, onUpdate }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between group relative">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{note.title || "Untitled"}</h3>
          <button 
            onClick={() => onUpdate({ ...note, isPinned: !note.isPinned })}
            className={`text-lg opacity-0 group-hover:opacity-100 transition-opacity ${note.isPinned ? 'opacity-100 text-yellow-500' : 'text-gray-400'}`}
          >
            📌
          </button>
        </div>
        <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-6">{note.content}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onDelete(note.id)}
          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg text-sm transition-colors"
          title="Delete note"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}