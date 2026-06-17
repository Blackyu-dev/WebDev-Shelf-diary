import "./BookNoteCard.css";

export default function BookNoteCard({
  book,
  noteText,
  setNoteText,
  onSave
}) {
  return (
    // 備註編輯區
    <div className="card note-card">
      <div className="desc-title">
        備註
      </div>

      {/*  備註輸入框 */}
      <textarea
        className="note-input"
        value={noteText}
        onChange={(e) =>
          setNoteText(e.target.value)
        }
        placeholder="輸入你的備註..."
      />

      {/* 最後更新時間與儲存按鈕 */}
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