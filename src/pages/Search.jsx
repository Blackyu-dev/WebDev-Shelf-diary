import Card from "../components/Card";

export default function Search() {
    return (
        <section>
            <h2>🔍 搜尋書籍</h2>

            <Card
                title="ISBN 搜尋"
                description="輸入 ISBN 直接查詢"
            />

            <Card
                title="書名/作者搜尋"
                description="用關鍵字搜尋書籍"
            />
        </section>
    );
}