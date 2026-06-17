import Card from "../components/Card";
import { useState } from "react";
import BookDetailPanel from "../components/BookDetailPanel";
import useSearchBooks from "../hooks/useSearchBooks";
import "./Home.css";

export default function Home() {
    const [selectedBook, setSelectedBook] = useState(null);
    // 刪除時的編輯模式
    const [isEditMode, setIsEditMode] = useState(false);
    // 篩選 
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const {
        searchTerm, setSearchTerm, filteredBooks, refreshBooks, totalBooks,
        selectedFilters, toggleFilter, filterStats, updateLocalBook
    } = useSearchBooks();

    //  動態產生篩選選項的邏輯 
    // 1. 定義基礎篩選配置 (不包含「其他」，因為等一下會動態把它塞在最後面)
    const baseFilters = [
        { key: 'status', title: '閱讀狀態', defaults: ['未讀', '想讀', '閱讀中', '已讀'] },
        { key: 'source', title: '書籍來源', defaults: ['博客來', '讀墨', "Play圖書", '誠品', 'Hyread', 'Kobo', 'BOOKWALKER'] },
        { key: 'category', title: '類型', defaults: ['文學小說', '漫畫', '輕小說', '技術/學習', '雜誌'] },
        { key: 'serialStatus', title: '連載狀態', defaults: ['連載中', '已完結'] }, // 對齊 TagCard 的「已完結」
    ];

    // 2. 合併預設選項與真實存在的新選項
    const dynamicFilterConfig = baseFilters.map(group => {
        // 從 hooks 統計出來的 filterStats 抓出現有的 key (例如你新增的 '科幻')
        const existOptions = Object.keys(filterStats[group.key] || {});
        // 用 Set 來合併預設值與現有值，並自動去除重複
        const allOptions = Array.from(new Set([...group.defaults, ...existOptions]));
        // 把「其他」獨立抽出來，確保它永遠排在陣列的最後一個
        const optionsWithoutOther = allOptions.filter(opt => opt !== '其他');

        return {
            ...group,
            options: [...optionsWithoutOther, '其他']
        };
    });

    const handleBookClick = (book) => {
        if (isEditMode) return;
        setSelectedBook(book);
    };

    const handleUpdateBook = (updatedBook) => {
        setSelectedBook(updatedBook);

        if (updateLocalBook) {
            updateLocalBook(updatedBook);
        }
    };

    // 呼叫後端的 DELETE API
    const handleDeleteBook = async (bookId) => {
        if (window.confirm("確定要將這本書從書櫃移除嗎？")) {
            try {
                // 發送 DELETE 請求給 Express 
                const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    refreshBooks(); // 重新向後端抓取並更新畫面

                    if (selectedBook && selectedBook._id === bookId) {
                        setSelectedBook(null);
                    }
                } else {
                    alert("刪除失敗，請稍後再試！");
                }
            } catch (error) {
                console.error("刪除時發生錯誤:", error);
                alert("伺服器連線錯誤！");
            }
        }
    };

    return (
        <div className="home-container">
            <div className="library-stats">
                共 {totalBooks} 本書
            </div>

            <div className="content-layout">
                {/*  使用動態生成的 dynamicFilterConfig 渲染篩選面板  */}
                <div className={`filter-panel ${isFilterOpen ? 'open' : ''}`}>
                    {dynamicFilterConfig.map(group => (
                        <div key={group.key} className="filter-group">
                            <h3 className="filter-title">{group.title}</h3>
                            <div className="filter-options">
                                {group.options.map(option => {
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
                            key={book._id}
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