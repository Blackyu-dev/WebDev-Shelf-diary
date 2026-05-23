import Card from "../components/Card";
import { useState } from "react";
import { getBooks } from "../data/booksStorage";
import BookDetailPanel from "../components/BookDetailPanel";
import "./Home.css";

export default function Home() {
    // 💡 修正 1：直接在 useState 初始化時讀取資料，徹底移除 useEffect！
    // 這樣可以避免元件渲染後又重新設定一次狀態的效能問題。
    const [booksData, setBooksData] = useState(() => getBooks());

    const [selectedBook, setSelectedBook] = useState(null);

    // ===== 篩選狀態 =====
    const [selectedCategory, setSelectedCategory] = useState("全部");
    const [selectedSerialStatus, setSelectedSerialStatus] = useState("全部");
    const [selectedReadStatus, setSelectedReadStatus] = useState("全部");

    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    // 💡 修正 2：新增此函式，當備註更新時，同步更新 Home 的列表與側邊欄狀態
    const handleUpdateBook = (updatedBook) => {
        // 更新整體書籍列表
        setBooksData((prevBooks) =>
            prevBooks.map(b => b.id === updatedBook.id ? updatedBook : b)
        );
        // 更新目前選中（側邊欄顯示中）的書籍
        setSelectedBook(updatedBook);
    };

    // ===== 書籍篩選邏輯 =====
    const filteredBooks = booksData.filter((book) => {
        const matchCategory = selectedCategory === "全部" || book.category === selectedCategory;
        const matchSerial = selectedSerialStatus === "全部" || book.serialStatus === selectedSerialStatus;
        const matchRead = selectedReadStatus === "全部" || book.status === selectedReadStatus;
        return matchCategory && matchSerial && matchRead;
    });

    return (
        <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
            <div style={{ flex: 1, minWidth: 0, transition: "0.3s ease" }}>
                <div className="container mt-5" style={{ width: "100%" }}>

                    <div className="filter-section mb-4">
                        <div className="filter-row">
                            {["全部", "漫畫", "小說"].map((item) => (
                                <button
                                    key={item}
                                    className={`filter-btn ${selectedCategory === item ? "active" : ""}`}
                                    onClick={() => setSelectedCategory(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="filter-row mt-2">
                            {["全部", "連載", "完結"].map((item) => (
                                <button
                                    key={item}
                                    className={`filter-btn ${selectedSerialStatus === item ? "active" : ""}`}
                                    onClick={() => setSelectedSerialStatus(item)}
                                >
                                    {item}
                                </button>
                            ))}

                            <div className="read-filter">
                                {["全部", "已讀", "未讀"].map((item) => (
                                    <button
                                        key={item}
                                        className={`filter-btn small ${selectedReadStatus === item ? "active" : ""}`}
                                        onClick={() => setSelectedReadStatus(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bookshelf-row">
                        {filteredBooks.map((book) => (
                            <Card
                                key={book.id}
                                book={book}
                                onClick={handleBookClick}
                            />
                        ))}
                    </div>

                </div>
            </div>

            {/* 💡 修正 3：把更新函式以 props 的方式傳遞給側邊欄 */}
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
