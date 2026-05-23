import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../data/booksStorage";
import Card from "../components/Card";
import BookModal from "../components/BookModal";
import "./AddBook.css";

export default function AddBook() {
    const navigate = useNavigate();
    const [isbn, setIsbn] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedBook, setSelectedBook] =
        useState(null);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    // ISBN 搜尋
    const handleISBNImport = async () => {
        if (!isbn.trim()) return;

        try {
            setLoading(true);

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
                doc.querySelector("h1")?.innerText?.trim() ||
                "未知書名";

            // 圖片
            const cover = `https://isbn.tw/${isbn}.jpg`;

            // 預設欄位
            let author = "未知作者";
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
            addBook(bookData);

        } catch (error) {
            console.error(error);

            alert("ISBN 匯入失敗");
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

            {/* ISBN 區塊 */}
            <div className="isbn-section">
                <input
                    type="text"
                    placeholder="輸入 ISBN..."
                    value={isbn}
                    onChange={(e) =>
                        setIsbn(
                            e.target.value
                        )
                    }
                    className="isbn-input"
                />

                <button
                    className="isbn-button"
                    onClick={
                        handleISBNImport
                    }
                >
                    {loading
                        ? "搜尋中..."
                        : "ISBN 匯入"}
                </button>
            </div>

            {/* 卡片 */}
            <div className="add-book-grid">
                <Card
                    book={{
                        title: "ISBN 匯入",
                        description:
                            "輸入 ISBN 自動抓取書籍資訊",
                    }}
                />

                <Card
                    book={{
                        title: "手動輸入",
                        description:
                            "自行輸入書籍資料",
                    }}
                />
            </div>

            {/* Modal */}
            {selectedBook && (
                <BookModal
                    book={selectedBook}
                    isOpen={isModalOpen}
                    onClose={
                        handleCloseModal
                    }
                />
            )}
        </section>
    );
}