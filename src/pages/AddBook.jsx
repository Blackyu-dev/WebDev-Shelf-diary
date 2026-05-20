import Card from "../components/Card";

export default function AddBook() {
    return (
        <section>
            <h2>➕ 新增書籍</h2>

            <Card
                book={{
                    title: "ISBN 匯入",
                    description: "輸入 ISBN 自動抓取書籍資訊"
                }}
            />

            <Card
                book={{
                    title: "手動輸入",
                    description: "自行輸入書籍資料"
                }}
            />
        </section>
    );
}