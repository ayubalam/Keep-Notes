export default function NoteCard({ note, onUpdate, onDelete, onEditClick, searchQuery = '', isSelected = false, onToggleSelect }) {
  const colors = ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb'];

  const renderHighlightedText = (text, query) => {
    if (!text) return "";
    if (!query.trim()) return text;

    const escapedQuery = query
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/-/g, '\\-')
      .replace(/\//g, '\\/');

    const regex = new RegExp(`(${escapedQuery})`, 'gi');
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

  const hasTitle = note.title && note.title.trim() !== "";
  const hasContent = note.content && note.content.trim() !== "";

  return (
    <div 
      style={{ backgroundColor: note.color || '#ffffff' }}
      className={`border rounded-xl p-5 hover:shadow-md transition-all flex flex-col justify-between group relative ${
        isSelected ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-200'
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect(note._id);
          }}
          className="w-4 h-4 rounded text-yellow-600 border-gray-300 focus:ring-yellow-500 cursor-pointer"
        />
      </div>

      <div className="cursor-pointer pl-5" onClick={() => !note.isTrashed && onEditClick(note)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">
            {hasTitle ? renderHighlightedText(note.title, searchQuery) : <span className="text-gray-400 italic text-sm">Empty Note</span>}
          </h3>
          {!note.isTrashed && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onUpdate({ ...note, isPinned: !note.isPinned })
              }}
              className={`text-lg transition-colors ${note.isPinned ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-500'}`}
            >
              📌
            </button>
          )}
        </div>
        {hasContent && (
          <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-6">
            {renderHighlightedText(note.content, searchQuery)}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100/50 flex items-center justify-between">
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
                className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm border border-gray-200"
                title="Restore note"
              >
                
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Are you sure you want to delete this particular note permanently?")) {
                    onDelete(note._id);
                  }
                }}
                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-sm border border-red-200"
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
                className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm border border-gray-200"
                title={note.isArchived ? "Unarchive" : "Archive"}
              >
                {note.isArchived ? '📤' : '📥'}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdate({ ...note, isTrashed: true, isPinned: false })
                }}
                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-sm border border-red-200"
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