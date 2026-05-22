import { useState } from "react";
import Card from "../components/Card";
import BookModal from "../components/BookModal";
import "./AddBook.css";

export default function AddBook() {
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

            // 書名
            const title =
                doc.querySelector("h1")?.innerText?.trim() ||
                "未知書名";

            // 作者（精準抓 dl dt=作者）
            let author = "未知作者";

            const dts = doc.querySelectorAll("dt");

            dts.forEach((dt) => {
                if (dt.innerText.trim() === "作者") {
                    const dd = dt.nextElementSibling;
                    author = dd?.innerText?.trim() || "未知作者";
                }
            });

            // 出版社
            let publisher = "";

            dts.forEach((dt) => {
                if (dt.innerText.trim() === "出版社") {
                    const dd = dt.nextElementSibling;
                    publisher = dd?.innerText?.trim() || "";
                }
            });


            let isbnValue = "";

            dts.forEach((dt) => {
                if (dt.innerText.trim() === "ISBN") {
                    const dd = dt.nextElementSibling;
                    isbnValue =
                        dd?.innerText?.trim() || "";
                }
            });

            // 封面圖（重點：要補 domain）
            const img =
                doc.querySelector(".card-body img");

            const cover = img
                ? "https://isbn.tw" + img.getAttribute("src")
                : "";

            const bookData = {
                id: Date.now(),
                title,
                author,
                publisher,
                isbn,
                cover,
            };

            setSelectedBook(bookData);

            setIsModalOpen(true);
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