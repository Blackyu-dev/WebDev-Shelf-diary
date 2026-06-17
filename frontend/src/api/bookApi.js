/**
 * 儲存或更新書籍資料
 * @param {string} bookId - 書籍 ID (如果沒有 ID 代表是新增)
 * @param {FormData} formData - 表單資料 (包含圖片與文字)
 * @returns {Promise<Object>} - 後端回傳的書籍資料
 */
export const saveBookApi = async (bookId, formData) => {
    // 判斷是新增還是更新
    const url = bookId
        ? `http://localhost:3000/api/books/${bookId}`
        : "http://localhost:3000/api/books";

    const method = bookId ? "PUT" : "POST";

    // 發送請求到後端
    const response = await fetch(url, {
        method,
        body: formData, 
    });

    if (!response.ok) {
        // 解析後端傳來的錯誤訊息
        const err = await response.json();
        throw new Error(err.message || "伺服器錯誤");
    }

    return await response.json();
};


// 匯出所有書籍資料 (轉為 JSON 下載)
export const exportBooksApi = async () => {
    const response = await fetch("http://localhost:3000/api/books/export");

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "匯出失敗");
    }

    const data = await response.json();

    // 將 JSON 轉成文字，並建立一個可以下載的 Blob 物件
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    // 建立隱藏的下載連結並觸發點擊
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // 加上時間戳記讓檔名不重複 (例如：shelf_diary_backup_2026-06-17.json)
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `shelf_diary_backup_${dateStr}.json`;

    document.body.appendChild(link);
    link.click();

    // 清理 DOM 與記憶體
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


//清空所有書籍資料
export const clearAllBooksApi = async () => {
    const response = await fetch("http://localhost:3000/api/books/clear", {
        method: "DELETE",
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "清空失敗");
    }

    return await response.json();
};