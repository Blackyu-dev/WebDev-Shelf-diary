import { useState, useEffect } from "react";
import Card from "../components/Card";
// 原本地端讀取邏輯
// import { getBooks } from "../data/booksStorage";
import "./collections.css";

export default function Collections() {
    //  1. 狀態改成空陣列，並加入 setFavoriteBooks
    const [favoriteBooks, setFavoriteBooks] = useState([]);

    //  2. 在 useEffect 裡面發送 GET 請求，抓取資料並篩選
    useEffect(() => {
        const fetchFavoriteBooks = async () => {
            try {
                // 發送請求給 Express API
                const response = await fetch("http://localhost:3000/api/books");

                if (response.ok) {
                    const allBooks = await response.json(); // 拿到 MongoDB 裡所有的書
                    // 篩選出 favorite 為 true 的書本
                    const favorites = allBooks.filter(book => book.favorite === true);
                    setFavoriteBooks(favorites);
                } else {
                    console.error("無法取得收藏書籍");
                }
            } catch (error) {
                console.error("伺服器連線發生錯誤:", error);
            }
        };

        fetchFavoriteBooks(); // 執行抓取函式
    }, []); // 空陣列表示只在畫面第一次載入時抓取一次

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
                            key={book._id}
                            book={book}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}