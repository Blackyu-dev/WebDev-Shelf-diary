
import mongoose from "mongoose";
const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },// 書名
        author: { type: String, required: true, trim: true },// 作者

        status: { type: String, default: "未讀" },         // 閱讀狀態
        source: { type: String, default: "未知" },         // 書籍來源
        category: { type: String, default: "未分類" },     // 類型
        serialStatus: { type: String, default: "連載中" }, // 連載狀態
        publisher: { type: String, default: "" },         // 出版社
        publishDate: { type: String, default: "" },       // 出版日期
        publishPlace: { type: String, default: "" },      // 出版地點
        isbn: { type: String, default: "" },              // ISBN
        coverImage: { type: String, default: "" },        // 封面圖片 URL
        description: { type: String, default: "" },       // 書籍描述

        favorite: { type: Boolean, default: false }, // 是否收藏
        language: { type: String, default: "未知" }, // 語言
        version: { type: String, default: "未知" },  // 版本
        binding: { type: String, default: "未知" },  // 裝訂
        grade: { type: String, default: "未知" },    // 分級
        rating: { type: Number, default: 0 },        // 星號評分 (預設為 0 分)

        // 閱讀筆記
        note: {
            text: { type: String, default: "" },
            updatedAt: { type: String, default: "" }
        }
    },
    { timestamps: true } // 自動添加 createdAt 和 updatedAt 欄位
);

const Book = mongoose.model("Book", bookSchema);
export default Book; // 匯出 Model 給 server.js 使用