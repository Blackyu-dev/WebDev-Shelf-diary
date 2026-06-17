import './Card.css';
import { useState } from "react";

export default function Card({ book, onClick, isEditMode, onDelete, onToggleFavorite }) {

    const [heartAnim, setHeartAnim] = useState(false);

    if (!book) return null;

    const defaultCover = "https://placehold.co/120x180?text=No+Image";

    const getCoverUrl = (coverImage) => {
        if (!coverImage) return defaultCover;

        if (
            coverImage.startsWith("http://") ||
            coverImage.startsWith("https://")
        ) {
            return coverImage;
        }

        const formattedPath = coverImage.startsWith("/")
            ? coverImage
            : `/${coverImage}`;

        return `http://localhost:3000${formattedPath}`;
    };

    const handleHeartClick = (e) => {
        e.stopPropagation();

        setHeartAnim(true);
        setTimeout(() => setHeartAnim(false), 300);

        onToggleFavorite && onToggleFavorite(book._id);
    };

    return (
        <div
            className={`book-card ${isEditMode ? 'edit-mode' : ''}`}
            onClick={() => onClick && onClick(book)}
        >
            <div className="cover-wrapper">

                {isEditMode && (
                    <button
                        className="delete-badge"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(book._id);
                        }}
                    >
                        ✕
                    </button>
                )}

                <img
                    src={getCoverUrl(book.coverImage)}
                    alt={book.title || "未知書名"}
                    className="book-cover"
                />

                <button
                    className={`favorite-heart-overlay ${heartAnim ? "active" : ""}`}
                    onClick={handleHeartClick}
                >
                    {book.favorite ? "❤️" : "🤍"}
                </button>

            </div>

            <div className="book-info">
                <h3 className="book-title">
                    {book.title || "未知書名"}
                </h3>
            </div>
        </div>
    );
}