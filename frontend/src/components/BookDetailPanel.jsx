import { useState } from "react";
import "./BookDetailPanel.css";

import BookInfoCard from "./panels/BookInfoCard";
import BookTagCard from "./panels/BookTagCard";
import BookDescriptionCard from "./panels/BookDescriptionCard";
import BookNoteCard from "./panels/BookNoteCard";

// 原 localStorage 匯入
// import { updateBook } from "../data/booksStorage";

export default function BookDetailPanel({ book, onClose, onUpdateBook, onDeleteBook }) {
  const [noteText, setNoteText] = useState(
    book?.note?.text || ""
  );

  const [prevBook, setPrevBook] = useState(book);

  if (book !== prevBook) {
    setPrevBook(book);
    setNoteText(book?.note?.text || "");
  }

  if (!book) return null;

  // 處理備註新增 (發送 PUT 請求到 MongoDB)
  const handleSaveNote = async () => {
    const updatedBook = {
      ...book,
      note: {
        text: noteText,
        updatedAt: new Date().toLocaleString()
      }
    };

    try {
      const response = await fetch(`http://localhost:3000/api/books/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook)
      });

      if (response.ok) {
        const savedBook = await response.json();
        if (onUpdateBook) {
          onUpdateBook(savedBook); // 通知首頁更新狀態
        }
        alert("備註儲存成功！");
      } else {
        alert("備註儲存失敗，請稍後再試。");
      }
    } catch (error) {
      console.error("更新備註錯誤:", error);
      alert("伺服器連線錯誤！");
    }
  };

  //處理下拉選單變更 (發送 PUT 請求到 MongoDB)
  const handleSelectChange = async (field, value) => {
    const updatedBook = { ...book, [field]: value };

    try {
      const response = await fetch(`http://localhost:3000/api/books/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook)
      });

      if (response.ok) {
        const savedBook = await response.json();
        if (onUpdateBook) {
          onUpdateBook(savedBook); // 通知首頁重新渲染
        }
      } else {
        console.error("更新欄位失敗");
      }
    } catch (error) {
      console.error("伺服器連線錯誤:", error);
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
        <div className="panel-footer">
          <button
            className="ghost-delete-btn"
            onClick={() => onDeleteBook(book._id)}
          >
            移除此書本
          </button>
        </div>
      </div>
    </div>
  );
}