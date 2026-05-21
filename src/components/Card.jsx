import './Card.css';
export default function Card({ book, onClick }) {
    return (
        <div className="book-card" onClick={() => onClick(book)}>
            <img
                src={book.coverImage}
                alt={book.title}
                title={book.title}
                className="book-cover"
            />
        </div>
    );
}