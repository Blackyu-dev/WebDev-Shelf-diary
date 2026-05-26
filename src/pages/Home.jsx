import Card from "../components/Card";
import { useState } from "react";
import BookDetailPanel from "../components/BookDetailPanel";
import useSearchBooks from "../hooks/useSearchBooks";
import { deleteBook } from "../data/booksStorage";
import "./Home.css";

export default function Home() {
    const [selectedBook, setSelectedBook] = useState(null);
    //刪除時的編輯模式
    const [isEditMode, setIsEditMode] = useState(false);
    // ===== 搜尋 Hook =====
    const { searchTerm, setSearchTerm, filteredBooks, refreshBooks } = useSearchBooks();

    const handleBookClick = (book) => {
        if (isEditMode) return;
        setSelectedBook(book);
    };

    const handleUpdateBook = (updatedBook) => {
        setSelectedBook(updatedBook); // 1. 更新目前面板顯示的書
        if (refreshBooks) {
            refreshBooks(); // 2. 通知 Hook 重新去 LocalStorage 拿最新的資料！
        }
    };

    const handleDeleteBook = (bookId) => {
        if (window.confirm("確定要將這本書從書櫃移除嗎？")) {
            deleteBook(bookId);    // 刪除資料庫資料
            refreshBooks();        // 重新抓取並更新畫面

            // 如果刪除的剛好是現在面板正在看的那本書，就順便把面板關掉
            if (selectedBook && selectedBook.id === bookId) {
                setSelectedBook(null);
            }
        }
    };

    return (
        <div className="home-container">

            {/* 📚 書籍區 */}
            <div className="bookshelf-row">
                {filteredBooks.map((book) => (
                    <Card
                        key={book.id}
                        book={book}
                        onClick={handleBookClick}
                        isEditMode={isEditMode}
                        onDelete={handleDeleteBook}
                    />
                ))}
            </div>

            {/* 🔍 右上角搜尋框 */}
            <div className="floating-search">
                <input
                    type="text"
                    placeholder="搜尋書名 / 作者..."
                    onFocus={() => console.log("focus")}
                    onBlur={() => console.log("blur")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* 編輯模式切換按鈕 */}
                <button
                    className={`edit-toggle-btn ${isEditMode ? 'active' : ''}`}
                    onClick={() => setIsEditMode(!isEditMode)}
                >
                    {isEditMode ? "完成" : "管理書櫃"}
                </button>
            </div>

            {/* 📖 側邊詳情 */}
            <BookDetailPanel
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
                onUpdateBook={handleUpdateBook}
                onDeleteBook={handleDeleteBook}
            />
        </div>
    );
}

