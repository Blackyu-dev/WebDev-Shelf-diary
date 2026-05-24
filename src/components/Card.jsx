import './Card.css';

export default function Card({ book, onClick }) {

    // 如果沒有 book 資料
    if (!book) {
        return null;
    }

    // 預設封面
    const defaultCover =
        "https://placehold.co/300x450?text=No+Image";

    return (
        <div
            className="book-card"
            onClick={() => onClick && onClick(book)}
        >
            {/* 書封 */}
            <img
                src={book.coverImage || defaultCover}
                alt={book.title || "未知書名"}
                title={book.title || "未知書名"}
                className="book-cover"
            />

            {/* 書籍資訊 */}
            <div className="book-info">

                {/* 書名 */}
                <h3 className="book-title">
                    {book.title || "未知書名"}
                </h3>

                {/* 作者 */}
                <p className="book-author">
                    {book.author || "未知作者"}
                </p>

                {/* 出版社 */}
                <p className="book-publisher">
                    {book.publisher || "未知出版社"}
                </p>

                {/* 閱讀狀態 */}
                <span className="book-status">
                    {book.status || "未讀"}
                </span>

            </div>
        </div>
    );
}