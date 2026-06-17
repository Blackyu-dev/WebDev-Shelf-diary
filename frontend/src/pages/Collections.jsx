import { useState, useEffect } from "react";
import Card from "../components/Card";
import "./collections.css";

export default function Collections() {
    const [favoriteBooks, setFavoriteBooks] = useState([]);

    useEffect(() => {
        const fetchFavoriteBooks = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/books");

                if (response.ok) {
                    const allBooks = await response.json();
                    const favorites = allBooks.filter(book => book.favorite === true);
                    setFavoriteBooks(favorites);
                } else {
                    console.error("無法取得收藏書籍");
                }
            } catch (error) {
                console.error("伺服器連線發生錯誤:", error);
            }
        };

        fetchFavoriteBooks();
    }, []);

    return (
        <div className="home-container">

            {/* 統計（跟 Home 一樣定位） */}
            <div className="library-stats">
                共 {favoriteBooks.length} 本收藏書
            </div>

            <div className="content-layout">

                {/* 書籍區 */}
                <div className="bookshelf-row">
                    {favoriteBooks.length === 0 ? (
                        <p style={{ color: "#666" }}>
                            目前還沒有收藏的書籍喔！
                        </p>
                    ) : (
                        favoriteBooks.map((book) => (
                            <Card key={book._id} book={book} />
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}