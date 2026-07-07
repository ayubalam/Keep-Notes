export default function NoteCard({ note, onUpdate, onDelete, onEditClick, searchQuery = '' }) {
  const colors = ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb'];

  const renderHighlightedText = (text, query) => {
    if (!text) return "";
    if (!query.trim()) return text;

    // Fixed: Removed useless escape slash to pass strict ESLint criteria
    const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div 
      style={{ backgroundColor: note.color || '#ffffff' }}
      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all flex flex-col justify-between group relative"
    >
      <div className="cursor-pointer" onClick={() => !note.isTrashed && onEditClick(note)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">
            {note.title ? renderHighlightedText(note.title, searchQuery) : "Untitled"}
          </h3>
          {!note.isTrashed && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onUpdate({ ...note, isPinned: !note.isPinned })
              }}
              className={`text-lg opacity-0 group-hover:opacity-100 transition-opacity ${note.isPinned ? 'opacity-100 text-yellow-500' : 'text-gray-400'}`}
            >
              📌
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-6">
          {renderHighlightedText(note.content, searchQuery)}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          {!note.isTrashed && colors.map((c) => (
            <button
              key={c}
              style={{ backgroundColor: c }}
              onClick={(e) => {
                e.stopPropagation()
                onUpdate({ ...note, color: c })
              }}
              className={`w-4 h-4 rounded-full border border-gray-300 transition-transform hover:scale-125 ${note.color === c ? 'ring-2 ring-gray-500' : ''}`}
            />
          ))}
        </div>
        
        <div className="flex space-x-2">
          {note.isTrashed ? (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdate({ ...note, isTrashed: false })
                }}
                className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg text-sm transition-colors"
                title="Restore note"
              >
                ↩️
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(note._id)
                }}
                className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg text-sm transition-colors"
                title="Delete forever"
              >
                💥
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdate({ ...note, isArchived: !note.isArchived, isPinned: false })
                }}
                className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg text-sm transition-colors"
                title={note.isArchived ? "Unarchive" : "Archive"}
              >
                {note.isArchived ? '📤' : '📥'}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdate({ ...note, isTrashed: true, isPinned: false })
                }}
                className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg text-sm transition-colors"
                title="Move to trash"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}