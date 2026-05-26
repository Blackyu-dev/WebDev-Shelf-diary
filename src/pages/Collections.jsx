import { useState } from "react"; // 🌟 移除 useEffect
import Card from "../components/Card";
import { getBooks } from "../data/booksStorage";
import "./collections.css";

export default function Collections() {

    // 直接在 useState 裡面傳入一個箭頭函式
    const [favoriteBooks] = useState(() => {
        const allBooks = getBooks();
        return allBooks.filter(book => book.favorite === true);
    });

    return (
        <section>
            <h2> 我的收藏</h2>

            {favoriteBooks.length === 0 ? (
                <p style={{ marginTop: "20px", color: "#666" }}>
                    目前還沒有收藏的書籍喔！去首頁把喜歡的書打勾吧～
                </p>
            ) : (
                <div className="books-grid">
                    {favoriteBooks.map((book) => (
                        <Card
                            key={book.id}
                            book={book}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}