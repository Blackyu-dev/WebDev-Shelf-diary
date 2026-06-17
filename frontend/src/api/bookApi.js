
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

    const response = await fetch(url, {
        method,
        body: formData, // ❗ 注意：使用 FormData 不要設定 Content-Type
    });

    if (!response.ok) {
        // 解析後端傳來的錯誤訊息
        const err = await response.json();
        throw new Error(err.message || "伺服器錯誤");
    }

    return await response.json();
};