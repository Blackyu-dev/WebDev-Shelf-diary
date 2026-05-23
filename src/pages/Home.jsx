import Card from "../components/Card";
import { useEffect, useState } from "react";
import { getBooks } from "../data/booksStorage";
import BookModal from '../components/BookModal';
import "./Home.css";

export default function Home() {
    // 書籍資料狀態
    const [booksData, setBooksData] = useState([]);

    // 首次載入從 localStorage 取得書籍資料
    useEffect(() => {
        setBooksData(getBooks());
    }, []);

    // 狀態管理：記錄選中哪本書、燈箱是否開啟
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ===== 篩選功能 =====

    // 書籍類型篩選（全部 / 漫畫 / 小說）
    const [selectedCategory, setSelectedCategory] = useState("全部");

    // 作品狀態篩選（全部 / 連載 / 完結）
    const [selectedSerialStatus, setSelectedSerialStatus] = useState("全部");

    // 閱讀狀態篩選（全部 / 已讀 / 未讀）
    const [selectedReadStatus, setSelectedReadStatus] = useState("全部");

    // 點擊書本的處理函式
    const handleBookClick = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    // 關閉燈箱的處理函式
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };

    // ===== 書籍篩選邏輯 =====
    const filteredBooks = booksData.filter((book) => {

        // 類型篩選
        const matchCategory =
            selectedCategory === "全部" ||
            book.category === selectedCategory;

        // 連載狀態篩選
        const matchSerial =
            selectedSerialStatus === "全部" ||
            book.serialStatus === selectedSerialStatus;

        // 閱讀狀態篩選
        const matchRead =
            selectedReadStatus === "全部" ||
            book.status === selectedReadStatus;

        // 三個條件都符合才顯示
        return matchCategory && matchSerial && matchRead;
    });

    return (
        <div className="container mt-5">

            {/* ===== 篩選區 ===== */}
            <div className="filter-section mb-4">

                {/* 第一行：書籍類型 */}
                <div className="filter-row">

                    {["全部", "漫畫", "小說"].map((item) => (
                        <button
                            key={item}

                            // active：目前選中的按鈕高亮
                            className={`filter-btn ${selectedCategory === item ? "active" : ""}`}

                            // 點擊切換類型
                            onClick={() => setSelectedCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* 第二行：連載狀態 + 閱讀狀態 */}
                <div className="filter-row mt-2">

                    {/* 連載 / 完結 */}
                    {["全部", "連載", "完結"].map((item) => (
                        <button
                            key={item}
                            className={`filter-btn ${selectedSerialStatus === item ? "active" : ""}`}
                            onClick={() => setSelectedSerialStatus(item)}
                        >
                            {item}
                        </button>
                    ))}

                    {/* 已讀 / 未讀 */}
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

            {/* 書架容器 */}
            <div className="bookshelf-row ">
                {filteredBooks.map((book) => (
                    <Card
                        key={book.id}
                        book={book}
                        onClick={handleBookClick}
                    />
                ))}
            </div>

            {/* 詳細資訊燈箱 */}
            <BookModal
                key={selectedBook ? selectedBook.id : 'empty'}
                book={selectedBook}
                isOpen={isModalOpen}
                onClose={closeModal}
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
