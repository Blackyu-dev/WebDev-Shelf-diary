import { useState } from "react";
import "./BookDetailPanel.css";
import NoteModal from "./NoteModal";
import { updateBook } from "../data/booksStorage";

export default function BookDetailPanel({ book, onClose, onUpdateBook }) {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState(
    book?.note?.text || ""
  );



  if (!book) return null;

  // 處理備註新增
  const handleSaveNote = () => {
    const updatedBook = {
      ...book,
      note: {
        text: noteText,
        updatedAt: new Date().toLocaleString()
      }
    };

    updateBook(updatedBook);
    onUpdateBook?.(updatedBook);
  };

  // 🟢 新增：處理下拉選單變更的函式
  const handleSelectChange = (field, value) => {
    // 複製原本的書籍物件，並更新改變的欄位
    const updatedBook = { ...book, [field]: value };

    updateBook(updatedBook); // 存回 LocalStorage

    // 通知 Home.jsx 重新渲染，此時首頁的「已讀/未讀」等篩選也能即時生效！
    if (onUpdateBook) {
      onUpdateBook(updatedBook);
    }
  };
  const renderStars = () => {
    const currentRating = book.rating || 0;
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= currentRating ? "filled" : ""}`}
            onClick={() => handleSelectChange("rating", star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const latestNote = book.notes && book.notes.length > 0 ? book.notes[book.notes.length - 1] : null;

  return (
    <div className={`side-panel ${book ? "open" : ""}`}>
      <div className="panel-header">
        <h3 className="panel-title">{book.title}</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="panel-body">
        {/* ===== 卡片1：基本資訊 ===== */}
        <div className="card info-card">
          <div className="top-section">
            <img src={book.coverImage} className="panel-cover" alt="封面" />
            <div className="info-section">
              {/* ...保持之前的基本資訊顯示不變... */}
              <div className="line strong">{book.author}</div>
              <div className="line">{book.publisher}</div>
              <div className="line">{book.publishDate?.replace("年", "-").replace("月", "-").replace("日", "")}</div>
              <div className="line">{book.publishPlace} ｜ {book.language}</div>
              <div className="line">{book.version} ｜ {book.binding} ｜ {book.grade}</div>
              <div className="line isbn">ISBN {book.isbn}</div>
              {renderStars()}{/* 顯示星級評分 */}
            </div>
          </div>
        </div>

        {/* ===== 卡片2：Tags 可編輯的下拉選單 ===== */}
        <div className="card tag-card">

          {/* 閱讀狀態 */}
          <select
            className="tag-select"
            value={book.status || "未讀"}
            onChange={(e) => handleSelectChange("status", e.target.value)}
          >
            <option value="未讀">未讀</option>
            <option value="閱讀中">閱讀中</option>
            <option value="已讀">已讀</option>
          </select>

          {/* 來源 */}
          <select
            className="tag-select"
            value={book.source || "其他"}
            onChange={(e) => handleSelectChange("source", e.target.value)}
          >
            <option value="博客來">博客來</option>
            <option value="讀冊">讀冊</option>
            <option value="Kindle">Kindle</option>
            <option value="其他">其他</option>
          </select>

          {/* 分類 */}
          <select
            className="tag-select"
            value={book.category || "其他"}
            onChange={(e) => handleSelectChange("category", e.target.value)}
          >
            <option value="文學小說">文學小說</option>
            <option value="漫畫">漫畫</option>
            <option value="輕小說">輕小說</option>
            <option value="其他">其他</option>
          </select>

          {/* 連載狀態  */}
          <select
            className="tag-select"
            value={book.serialStatus || "完結"}
            onChange={(e) => handleSelectChange("serialStatus", e.target.value)}
          >
            <option value="連載">連載</option>
            <option value="完結">完結</option>
          </select>

        </div>

        {/* ===== 卡片3：簡介 ===== */}
        <div className="card desc-card">
          <div className="desc-title">簡介</div>
          <p className="desc-text">{book.description}</p>
        </div>

        {/* ===== 卡片4：備註  ===== */}
        <div className="card note-card">
          <div className="desc-title">備註</div>

          <textarea
            className="note-input"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="輸入你的備註..."
          />

          <div className="note-footer">
            <div className="note-time">
              {book.note?.updatedAt ? `最後更新：${book.note.updatedAt}` : "尚未有備註"}
            </div>

            <button className="add-note-btn" onClick={handleSaveNote}>
              儲存
            </button>
          </div>
        </div>
      </div> {/* <-- 這是 panel-body 的結尾 */}

      {isNoteModalOpen && (
        <NoteModal
          onClose={() => setIsNoteModalOpen(false)}
          onSave={handleSaveNote}
          notesHistory={book.notes || []}
        />
      )}
    </div>
  );
}