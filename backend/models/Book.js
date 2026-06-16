
import mongoose from "mongoose";
const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        author: { type: String, required: true, trim: true },

        status: { type: String, default: "未讀" },         // 閱讀狀態
        source: { type: String, default: "未知" },         // 書籍來源
        category: { type: String, default: "未分類" },       // 類型
        serialStatus: { type: String, default: "連載中" }, // 連載狀態
        publisher: { type: String, default: "" },
        isbn: { type: String, default: "" },
        coverImage: { type: String, default: "" },
        description: { type: String, default: "" },

        favorite: { type: Boolean, default: false },
        language: { type: String, default: "未知" }, // 語言
        version: { type: String, default: "未知" },  // 版本
        binding: { type: String, default: "未知" },  // 裝訂
        grade: { type: String, default: "未知" },    // 分級
        rating: { type: Number, default: 0 },        // 星號評分 (預設為 0 分)


        note: {
            text: { type: String, default: "" },
            updatedAt: { type: String, default: "" }
        }
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book; // 匯出 Model 給 server.js 使用