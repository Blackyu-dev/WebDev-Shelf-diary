import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../data/booksStorage";
import Card from "../components/Card";
import BookModal from "../components/BookModal";
import "./AddBook.css";

export default function AddBook() {
    const navigate = useNavigate();
    const [isbn, setIsbn] = useState("");
    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] =
        useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

    const [selectedBook, setSelectedBook] =
        useState(null);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    // ISBN 搜尋
    const handleISBNImport = async () => {
        if (!isbn.trim()) return;

        try {
            setLoading(true);
            setError("");

            // vite proxy
            const response = await fetch(
                `/isbn-api/${isbn}`
            );

            const html = await response.text();

            // 解析 HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // 基本欄位
            const title =
                doc.querySelector("h1")?.innerText?.trim();

            if (!title) {

                setError("找不到這本書，請改用書名或手動輸入");

                return;
            }

            // 圖片
            const cover = `https://isbn.tw/${isbn}.jpg`;

            // 預設欄位
            let author = "";
            let publisher = "";
            let publishDate = "";
            let publishPlace = "";
            let language = "";
            let version = "";
            let binding = "";
            let grade = "";
            let isbnValue = isbn;

            // 抓 dt / dd 結構
            const dts = doc.querySelectorAll("dt");
            if (dts.length === 0) {

                setError("找不到這本書，請改用書名或手動輸入");

                return;
            }

            dts.forEach((dt) => {
                const key = dt.innerText.trim();
                const value =
                    dt.nextElementSibling?.innerText?.trim() ||
                    "";

                switch (key) {
                    case "作者":
                        author = value;
                        break;

                    case "出版社":
                        publisher = value;
                        break;

                    case "出版日期":
                        publishDate = value;
                        break;

                    case "出版地":
                        publishPlace = value;
                        break;

                    case "語言":
                        language = value;
                        break;

                    case "版本":
                        version = value;
                        break;

                    case "裝訂":
                        binding = value;
                        break;

                    case "分級":
                        grade = value;
                        break;

                    case "ISBN":
                        isbnValue = value;
                        break;
                }
            });

            // 簡介
            let description = "";

            const introHeaders =
                doc.querySelectorAll(".card-header");

            introHeaders.forEach((header) => {
                if (header.innerText.trim() === "簡介") {
                    const body =
                        header.nextElementSibling;

                    if (!body) return;

                    // 抓所有 p（不管是不是影片包住）
                    const paragraphs =
                        body.querySelectorAll("p");

                    let texts = [];

                    paragraphs.forEach((p) => {
                        const text =
                            p.innerText
                                ?.replace(/\s+/g, " ")
                                .trim();

                        if (text) texts.push(text);
                    });

                    description = texts.join("\n\n");
                }
            });

            // 建立書籍資料
            const bookData = {
                id: Date.now(),
                title,                  // 書名
                author,                 // 作者
                publisher,              // 出版社
                publishDate,            // 出版日期
                publishPlace,           // 出版地
                language,               // 語言
                version,                // 版本
                binding,                // 裝訂
                grade,                  // 分級
                isbn: isbnValue,        // ISBN
                coverImage: cover,      // 書封面
                description,            // 簡介
                category: "未分類",     // 預設類別
                serialStatus: "連載中", // 預設連載狀態(連載中/已完結/全一冊)
                status: "未讀",         // 預設閱讀狀態(未讀/閱讀中/已讀/棄讀/想讀/收藏/借閱/借出/其他)
                source: "未知",         // 預設來源(博客來/墊腳石/Hread/讀冊/其他/未知)
            };

            setSelectedBook(bookData);

            setIsModalOpen(true);

            // 新增到 localStorage
            // addBook(bookData); 改由 Modal 確認新增

        } catch (error) {
            console.error(error);

            alert("ISBN 匯入失敗");
        } finally {
            setLoading(false);
        }
    };
    // Google 書名搜尋
    const handleGoogleSearch = async () => {
        if (!keyword.trim()) return;

        try {
            setLoading(true);

            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${keyword}&key=${API_KEY}`
            );

            const data = await response.json();

            if (!data.items) {
                setError("找不到相關書籍，請改用ISBN或手動輸入");
                return;
            }

            // 整理資料
            const books = data.items.map((item) => {
                const info = item.volumeInfo;

                return {
                    id: item.id,

                    title:
                        info.title || "未知書名",

                    author:
                        info.authors?.join(", ") ||
                        "未知作者",

                    publisher:
                        info.publisher || "",

                    publishDate:
                        info.publishedDate || "",

                    language:
                        info.language || "",

                    version: "",

                    binding: "",

                    grade: "",

                    isbn:
                        info.industryIdentifiers?.[0]
                            ?.identifier || "",

                    coverImage:
                        info.imageLinks?.thumbnail ||
                        "",

                    description:
                        info.description || "",

                    category: "未分類",

                    serialStatus: "連載中",

                    status: "未讀",

                    source: "未知",
                };
            });

            setSearchResults(books);

        } catch (error) {

            console.error(error);

            setError("找不到相關書籍，請改用ISBN或手動輸入");

        } finally {

            setLoading(false);
        }
    };

    // 關閉 modal
    const handleCloseModal = () => {
        setIsModalOpen(false);

        setTimeout(() => {
            setSelectedBook(null);
        }, 300);
    };

    return (
        <section className="add-book-page">
            <h2>➕ 新增書籍</h2>

            {/* === 搜尋區塊 (這裡確保絕對只有兩排！) === */}
            <div className="search-container">
                {/* 第一排：ISBN 搜尋 */}
                <div className="isbn-section">
                    <input
                        type="text"
                        placeholder="輸入 ISBN..."
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        className="isbn-input"
                    />
                    <button className="isbn-button" onClick={handleISBNImport}>
                        {loading ? "搜尋中..." : "ISBN 匯入"}
                    </button>
                </div>

                {/* 第二排：Google 書名搜尋 */}
                <div className="isbn-section">
                    <input
                        type="text"
                        placeholder="輸入書名..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="isbn-input"
                    />
                    <button className="isbn-button" onClick={handleGoogleSearch}>
                        {loading ? "搜尋中..." : "書名搜尋"}
                    </button>
                </div>
            </div>

            {/* 錯誤訊息 */}
            {error && (
                <p className="isbn-error" style={{ textAlign: "center", color: "red" }}>
                    {error}
                </p>
            )}

            {/* === 🌟 解答：什麼是手動加入？ === */}
            {/* 這裡我們做一個大大的按鈕，這就是「手動加入」的入口！ */}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
                <button
                    className="isbn-button"
                    style={{ backgroundColor: "#8b5a2b", padding: "10px 20px" }}
                    onClick={() => {
                        // 點擊後，我們塞給 Modal 一個「完全空白」的書本物件
                        setSelectedBook({
                            id: Date.now(), // 給它一個隨機 ID
                            title: "",      // 書名留白讓你填
                            author: "",
                            publisher: "",
                            language: "",
                            version: "",
                            binding: "",
                            grade: "",
                            isbn: "",
                            description: "",
                            status: "未讀",
                            source: "其他",
                            category: "其他"
                        });
                        setIsModalOpen(true); // 打開 Modal
                    }}
                >
                    ✍️ 找不到書？點此完全手動輸入
                </button>
            </div>

            {/* === Google 搜尋結果 === */}
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

            {/* Modal */}
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