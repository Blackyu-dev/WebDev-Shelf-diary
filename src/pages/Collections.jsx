import Card from "../components/Card";

export default function Collections() {

    const books = [
        {
            id: 1779508128063,
            title: "全知讀者視角01",
            author: "sing N song",
            publisher: "深空出版",
            coverImage: "https://isbn.tw/9789860614312.jpg",
            status: "未讀",
        },
        {
            id: 1779511959679,
            title: "獵人只想安靜生活04",
            author: "103",
            publisher: "深空出版",
            coverImage: "https://isbn.tw/9786267412961.jpg",
            status: "未讀",
        }
    ];

    return (
        <section>
            <h2>📖 我的收藏</h2>

            <div className="books-grid">
                {books.map((book) => (
                    <Card
                        key={book.id}
                        book={book}
                    />
                ))}
            </div>
        </section>
    );
}