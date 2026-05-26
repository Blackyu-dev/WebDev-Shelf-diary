import Card from "../components/Card";
import { useState } from "react";
import BookDetailPanel from "../components/BookDetailPanel";
import useSearchBooks from "../hooks/useSearchBooks";
import "./Home.css";

export default function Home() {
    const [selectedBook, setSelectedBook] = useState(null);

    // ===== 搜尋 Hook =====
    const { searchTerm, setSearchTerm, filteredBooks, refreshBooks } = useSearchBooks();

    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    const handleUpdateBook = (updatedBook) => {
        setSelectedBook(updatedBook); // 1. 更新目前面板顯示的書
        if (refreshBooks) {
            refreshBooks(); // 2. 通知 Hook 重新去 LocalStorage 拿最新的資料！
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
            </div>

            {/* 📖 側邊詳情 */}
            <BookDetailPanel
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
                onUpdateBook={handleUpdateBook}
            />
        </div>
    );
}

//TODO: 首頁的結構：(暫定)
// 首頁 (Home)
// |
// |-- 導覽列 (Navigation)
// |   |-- 首頁
// |   |-- 新增書籍
// |   |-- 搜尋
// |   |-- 我的收藏
// |   |-- 設定
// |
// |-- 書籍清單區 (Book List Section)
// |   |-- 書籍卡片 (Book Card)
// |       |-- 封面圖片
// |       |-- 書名
// |       |-- 作者
// |       |-- ISBN
// |       |-- 狀態標籤 (已讀 / 想讀)
// |
// |-- 快速操作區 (Quick Actions)
// |   |-- 新增書籍按鈕
// |   |-- 搜尋框
// |
// |-- 推薦/系列區 (Recommendations / Series)
// |   |-- 系列書籍卡片
// |   |-- 自動匯入整套 ISBN
// |
// |-- 頁尾 (Footer)
// |   |-- 版權資訊
// |   |-- 聯絡/社群連結
