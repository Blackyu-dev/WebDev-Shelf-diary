import Card from "../components/Card";

export default function Collections() {
    return (
        <section>
            <h2>📖 我的收藏</h2>

            <Card
                title="已讀清單"
                description="紀錄已看過的書籍"
            />

            <Card
                title="想讀清單"
                description="紀錄想看的書籍"
            />
        </section>
    );
}