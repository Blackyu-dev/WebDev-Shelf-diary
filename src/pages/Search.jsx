import { useState } from 'react';
import { booksData } from '../data';
import Card from '../components/Card';
import BookModal from '../components/BookModal';
import './Search.css';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 判斷搜尋框是否為空 (去掉前後空白後)
    const isSearchEmpty = searchTerm.trim() === '';

    const filteredBooks = booksData.filter((book) => {
        const lowerCaseTerm = searchTerm.toLowerCase();
        const matchTitle = book.title?.toLowerCase().includes(lowerCaseTerm) || false;
        const matchAuthor = book.author?.toLowerCase().includes(lowerCaseTerm) || false;

        return matchTitle || matchAuthor;
    });

    const handleCardClick = (clickedBook) => {
        setSelectedBook(clickedBook);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedBook(null), 300);
    };

    return (
        <div className="search-page">
            <h2 className="search-title">探索書庫</h2>

            <div className="search-bar-container">
                <div className="search-input-wrapper">
                    <img
                        src="/src/assets/search.png"
                        alt="search"
                        className="search-icon"
                    />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="搜尋書名或作者..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* 判斷邏輯開始 */}
            {isSearchEmpty ? (
                // 狀態 1：還沒輸入任何關鍵字
                <div className="empty-state">
                    <h4>準備好尋找下一本好書了嗎？</h4>
                    <p>請在上方輸入書名或作者來開始搜尋。</p>
                </div>
            ) : filteredBooks.length > 0 ? (
                // 狀態 2：有輸入關鍵字，且有找到書籍
                <div className="books-grid">
                    {filteredBooks.map((book) => (
                        <div className="book-item" key={book.id}>
                            <Card
                                book={book}
                                onClick={handleCardClick}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                // 狀態 3：有輸入關鍵字，但找不到書籍
                <div className="empty-state">
                    <h4>找不到符合「{searchTerm}」的書籍</h4>
                    <p>請嘗試其他關鍵字，或檢查是否有錯字。</p>
                </div>
            )}

            {selectedBook && (
                <BookModal
                    book={selectedBook}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Search;