import { useState } from "react";
import "./Setting.css";

export default function Setting() {
    // 🌟 模擬登入狀態 (未來可串接真實的登入系統)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 匯出資料 (下載成 JSON 檔)
    const handleExportData = () => {
        const data = localStorage.getItem("books") || "[]";
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "my_books_backup.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // 清除所有資料
    const handleClearData = () => {
        if (window.confirm("⚠️ 警告：這將會刪除你所有的書本與筆記紀錄，且無法復原！確定要繼續嗎？")) {
            if (window.confirm("請再次確認，真的要清空書櫃嗎？")) {
                localStorage.removeItem("books");
                window.location.reload();
            }
        }
    };

    return (
        <div className="setting-container">
            <h2 className="setting-title">設定</h2>

            {/* ===== 1. 帳號管理 (置頂) ===== */}
            <section className="setting-section">
                <h3 className="section-title">帳號管理</h3>
                <div className="setting-card account-card">
                    {isLoggedIn ? (
                        <div className="account-info-wrapper">
                            <div className="account-profile">
                                <div className="avatar">
                                    {/* 預設頭像，可用首字母代替 */}
                                    <span>U</span>
                                </div>
                                <div className="account-details">
                                    <h4 className="user-name">User_Name</h4>
                                    <p className="user-email">user@example.com</p>
                                </div>
                            </div>
                            <button className="btn-outline" onClick={() => setIsLoggedIn(false)}>
                                登出
                            </button>
                        </div>
                    ) : (
                        <div className="account-info-wrapper logged-out">
                            <div className="account-details">
                                <h4>尚未登入</h4>
                                <p>登入以啟用雲端同步功能</p>
                            </div>
                            <button className="btn-primary" onClick={() => setIsLoggedIn(true)}>
                                登入 / 註冊
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ===== 2. TODO 清單：介面與系統 ===== */}
            <section className="setting-section">
                <h3 className="section-title">介面與系統 (Todo)</h3>
                <div className="setting-card disabled-card">
                    <div className="setting-item">
                        <div className="item-info">
                            <h4>深色模式 (Dark Mode)</h4>
                            <p>切換為深色背景，保護眼睛。</p>
                        </div>
                        <div className="todo-badge">規劃中</div>
                    </div>


                </div>
            </section>

            {/* ===== 3. 資料安全與危險區域 (置底) ===== */}
            <section className="setting-section">
                <h3 className="section-title danger-title">資料管理與進階</h3>

                <div className="setting-card">
                    <div className="setting-item">
                        <div className="item-info">
                            <h4>備份本機書櫃資料</h4>
                            <p>將目前的所有書本、筆記與標籤匯出成 JSON 檔案</p>
                        </div>
                        <button className="btn-primary" onClick={handleExportData}>
                            匯出資料
                        </button>
                    </div>

                    <div className="setting-divider"></div>

                    <div className="setting-item">
                        <div className="item-info">
                            <h4>清空所有資料</h4>
                            <p>刪除本機瀏覽器中的所有書本紀錄。此動作<strong style={{ color: "#e57373" }}>無法復原</strong>。</p>
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