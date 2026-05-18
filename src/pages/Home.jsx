import Card from "../components/Card";

export default function Home() {
    return (
        <section>
            <h2>📚 首頁 - 書籍清單</h2>

            <div className="card-grid">
                <Card title="書籍 A" description="這是一本測試書籍" />
                <Card title="書籍 B" description="這是第二本測試書籍" />
            </div>
        </section>
    );
}