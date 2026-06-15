import './Card.css';

export default function Card({ book, onClick, isEditMode, onDelete }) {

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(book._id);
    };

    if (!book) return null;

    const defaultCover =
        "https://placehold.co/120x180?text=No+Image";

    return (
        <div
            className={`book-card ${isEditMode ? 'edit-mode' : ''}`}
            onClick={() => onClick && onClick(book)}
        >
            {isEditMode && (
                <button className="delete-badge" onClick={handleDeleteClick}>
                    ✕
                </button>
            )}

            <img
                src={book.coverImage || defaultCover}
                alt={book.title || "未知書名"}
                className="book-cover"
            />

            <div className="book-info">

                <h3 className="book-title">
                    {book.title || "未知書名"}
                </h3>

                {/* 🔥 合併狀態：一行 */}
                <div className="book-status-row">

                    <span className={`book-status status-${book.status || "未讀"}`}>
                        {book.status || "未讀"}
                    </span>

                    <span className={`book-serial serial-${book.serialStatus || "連載中"}`}>
                        {book.serialStatus || "連載中"}
                    </span>

                </div>

            </div>
        </div>
    );
}