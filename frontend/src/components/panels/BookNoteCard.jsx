import "./BookNoteCard.css";

export default function BookNoteCard({
  book,
  noteText,
  setNoteText,
  onSave
}) {
  return (
    <div className="card note-card">
      <div className="desc-title">
        備註
      </div>

      <textarea
        className="note-input"
        value={noteText}
        onChange={(e) =>
          setNoteText(e.target.value)
        }
        placeholder="輸入你的備註..."
      />

      <div className="note-footer">
        <div className="note-time">
          {book.note?.updatedAt
            ? `最後更新：${book.note.updatedAt}`
            : "尚未有備註"}
        </div>

        <button
          className="add-note-btn"
          onClick={onSave}
        >
          儲存
        </button>
      </div>
    </div>
  );
}