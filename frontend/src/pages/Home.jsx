import Card from "../components/Card";
import { useState } from "react";
import BookDetailPanel from "../components/BookDetailPanel";
import useSearchBooks from "../hooks/useSearchBooks";
import { deleteBook } from "../data/booksStorage";
import "./Home.css";
// 定義篩選類別與選項 
const FILTER_CONFIG = [
    { key: 'status', title: '閱讀狀態', options: ['未讀', '已讀', '閱讀中', '想讀'] },
    { key: 'source', title: '書籍來源', options: ['博客來', '讀墨', '誠品', 'Hyread', 'Kobo', 'BOOKWALKER', '其他'] },
    { key: 'category', title: '類型', options: ['文學小說', '漫畫', '輕小說', '技術/學習', '雜誌', '其他'] },
    { key: 'serialStatus', title: '連載狀態', options: ['連載中', '完結'] },
];
export default function Home() {
    const [selectedBook, setSelectedBook] = useState(null);
    //刪除時的編輯模式
    const [isEditMode, setIsEditMode] = useState(false);
    // ===== 搜尋 Hook =====
    // const { searchTerm, setSearchTerm, filteredBooks, refreshBooks, totalBooks } = useSearchBooks();
    // ===== 篩選 =====
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const {
        searchTerm, setSearchTerm, filteredBooks, refreshBooks, totalBooks,
        selectedFilters, toggleFilter, filterStats
    } = useSearchBooks();

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
            <div className="library-stats">
                共 {totalBooks} 本書
            </div>

            {/*  flex 容器包住「篩選面板」和「書籍區」 */}
            <div className="content-layout">

                {/* 動態渲染篩選面板 */}
                <div className={`filter-panel ${isFilterOpen ? 'open' : ''}`}>
                    {FILTER_CONFIG.map(group => (
                        <div key={group.key} className="filter-group">
                            <h3 className="filter-title">{group.title}</h3>
                            <div className="filter-options">
                                {group.options.map(option => {
                                    // 取得該選項的書本數量，若沒有則為 0
                                    const count = filterStats[group.key][option] || 0;

                                    return (
                                        <label key={option} className="filter-label">
                                            <div className="filter-label-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[group.key].includes(option)}
                                                    onChange={() => toggleFilter(group.key, option)}
                                                />
                                                <span className="filter-text">{option}</span>
                                            </div>
                                            <span className="filter-count">({count})</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {/* 書籍區 */}
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
            </div>

            {/* 右上角搜尋框 */}
            <div className="floating-search">
                <button
                    className={`filter-btn ${isFilterOpen ? 'active' : ''}`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    篩選
                </button>
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

            {/* 側邊詳情 */}
            <BookDetailPanel
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
                onUpdateBook={handleUpdateBook}
                onDeleteBook={handleDeleteBook}
            />
        </div>
    );
}

