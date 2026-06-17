import { exportBooksApi, clearAllBooksApi } from "../api/bookApi";
import "./Setting.css";

export default function Setting() {
    // 匯出資料 (從後端抓取並下載成 JSON 檔)
    const handleExportData = async () => {
        try {
            await exportBooksApi();
            alert("匯出成功！檔案已開始下載。");
        } catch (error) {
            console.error("匯出失敗:", error);
            alert("匯出時發生錯誤，請稍後再試。");
        }
    };

    // 清除所有資料 (呼叫後端 API 刪除資料庫內容)
    const handleClearData = async () => {
        if (window.confirm("⚠️ 警告：這將會從資料庫刪除你所有的書本與筆記紀錄，且無法復原！確定要繼續嗎？")) {
            if (window.confirm("請再次確認，真的要清空書櫃嗎？")) {
                try {
                    await clearAllBooksApi();
                    alert("所有資料已成功清空！");
                    window.location.reload(); // 重整頁面讓畫面回到初始狀態
                } catch (error) {
                    console.error("清空失敗:", error);
                    alert("清空資料時發生錯誤，請稍後再試。");
                }
            }
        }
    };

    return (
        <div className="setting-container">
            <h2 className="setting-title">設定</h2>

            <section className="setting-section">
                <h3 className="section-title danger-title">資料管理與進階</h3>

                {/* // 資料管理功能：匯出與清除 */}
                <div className="setting-card">
                    <div className="setting-item">
                        <div className="item-info">
                            <h4>備份書櫃資料</h4>
                            <p>將目前所有書本、筆記與標籤匯出成 JSON 檔案。</p>
                        </div>
                        <button className="btn-primary" onClick={handleExportData}>
                            匯出資料
                        </button>
                    </div>

                    <div className="setting-divider"></div>

                    {/* // 清除資料功能：會呼叫後端 API 刪除 MongoDB 中的所有書籍紀錄 */}
                    <div className="setting-item">
                        <div className="item-info">
                            <h4>清空所有資料</h4>
                            <p>刪除系統中的所有書本紀錄。此動作將<strong style={{ color: "#e57373" }}>無法復原</strong>。</p>
                        </div>
                        <button className="btn-danger" onClick={handleClearData}>
                            清除資料
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}