import Card from "../components/Card";
import { useState } from 'react';
import { booksData } from '../data';
import BookModal from '../components/BookModal';

export default function Home() {
    // 狀態管理：記錄選中哪本書、燈箱是否開啟
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    return (
        <div className="container mt-5">
            {/* 書架容器 */}
            <div className="bookshelf-row ">
                {booksData.map((book) => (
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
