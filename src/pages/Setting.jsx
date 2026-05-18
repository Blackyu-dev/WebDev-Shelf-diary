import Card from "../components/Card";

export default function Settings() {
    return (
        <section>
            <h2>⚙️ 設定</h2>

            <Card
                title="匯入/匯出"
                description="備份或還原書籍資料"
            />

            <Card
                title="偏好設定"
                description="調整顯示模式與語言"
            />
        </section>
    );
}