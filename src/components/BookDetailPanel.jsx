import { useState } from "react";
import "./BookDetailPanel.css";

import BookInfoCard from "./panels/BookInfoCard";
import BookTagCard from "./panels/BookTagCard";
import BookDescriptionCard from "./panels/BookDescriptionCard";
import BookNoteCard from "./panels/BookNoteCard";

import { updateBook } from "../data/booksStorage";

export default function BookDetailPanel({ book, onClose, onUpdateBook }) {
  const [noteText, setNoteText] = useState(
    book?.note?.text || ""
  );

  // 用一個 state 來記住「上一次」傳進來的書
  const [prevBook, setPrevBook] = useState(book);

  // 當發現傳進來的書跟上次不一樣時，直接更新 noteText
  if (book !== prevBook) {
    setPrevBook(book);
    setNoteText(book?.note?.text || "");
  }



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


  return (
    <div className={`side-panel ${book ? "open" : ""}`}>
      <div className="panel-header">
        <h3 className="panel-title">{book.title}</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="panel-body">

        <BookInfoCard
          book={book}
          onChange={handleSelectChange}
        />

        <BookTagCard
          book={book}
          onChange={handleSelectChange}
        />

        <BookDescriptionCard
          description={book.description}
        />

        <BookNoteCard
          book={book}
          noteText={noteText}
          setNoteText={setNoteText}
          onSave={handleSaveNote}
        />

      </div>

    </div>
  );
}
// components/
// │
// ├── BookDetailPanel.jsx
// │
// ├── panels/
// │   ├── BookInfoCard.jsx (管理書籍基本資訊和評分)
// │   ├── BookTagCard.jsx  (管理書籍的閱讀狀態、來源、分類、連載狀態等標籤)
// │   ├── BookDescriptionCard.jsx  (顯示書籍簡介)
// │   ├── BookNoteCard.jsx  (管理書籍備註)
// │   └── BookSeriesCard.jsx  (管理系列書相關資訊，如是否為系列書、系列名稱、系列順序等)

