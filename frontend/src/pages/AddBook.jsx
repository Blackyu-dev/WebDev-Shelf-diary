
import Card from "../components/Card";
import BookModal from '../components/BookModal/BookModal';
import SearchBookInputs from "../components/SearchBookInputs";
import useSearchBooks from "../hooks/useSearchBooks";
import "./AddBook.css";

export default function AddBook() {
    const {
        isbn, setIsbn, keyword, setKeyword,
        searchResults, loading, error,
        selectedBook, setSelectedBook,
        isModalOpen, setIsModalOpen,
        handleISBNImport, handleGoogleSearch, handleCloseModal, openManualAdd
    } = useSearchBooks();

    return (
        <section className="add-book-page">
            <h2>新增書籍</h2>

            <SearchBookInputs
                isbn={isbn} setIsbn={setIsbn} handleISBNImport={handleISBNImport}
                keyword={keyword} setKeyword={setKeyword} handleGoogleSearch={handleGoogleSearch}
                loading={loading}
            />

            {/* // 錯誤訊息顯示 */}
            {error && (
                <p className="isbn-error" style={{ textAlign: "center", color: "red" }}>
                    {error}
                </p>
            )}

            {/* // 提供完全手動輸入書籍資料的按鈕，會開啟一個空白的 BookModal 讓使用者填寫所有欄位 */}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
                <button
                    className="isbn-button"
                    style={{ backgroundColor: "#8b5a2b", padding: "10px 20px" }}
                    onClick={openManualAdd}
                >
                    ✍️ 找不到書？點此完全手動輸入
                </button>
            </div>

            {/* // 搜尋結果顯示區：如果有搜尋結果，就以 Card 的形式呈現，點擊後會開啟 BookModal 顯示詳細資訊 */}
            {searchResults.length > 0 && (
                <div className="add-book-grid">
                    {searchResults.map((book) => (
                        <div
                            key={book.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setSelectedBook(book);
                                setIsModalOpen(true);
                            }}
                        >
                            <Card book={book} />
                        </div>
                    ))}
                </div>
            )}

            {selectedBook && (
                <BookModal
                    key={selectedBook.id}
                    book={selectedBook}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </section>
    );
}