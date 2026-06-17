// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Book from "./models/Book.js";
import bookRoutes from "./routes/bookRoutes.js";
import path from "path";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer();

app.use(cors());
app.use(express.json()); // 自動將前端傳來的 JSON 解析到 req.body
app.use("/api/books", bookRoutes);



// === MongoDB 連線設定 ===
const LOCAL_MONGODB_URI = "mongodb://127.0.0.1:27017/shelf-diary";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || LOCAL_MONGODB_URI);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}
connectDB();


// // 1. GET API
// app.get("/api/books", async (req, res) => {
//     try {
//         // 由新到舊排序，回傳 JSON 給 React 
//         const books = await Book.find().sort({ createdAt: -1 });
//         res.json(books);
//     } catch (error) {
//         res.status(500).json({ message: "取得書籍資料失敗", error: error.message });
//     }
// });


// 4. PUT API：根據 _id 更新書籍資料 (備註、收藏狀態、閱讀狀態等)
// app.put("/api/books/:id", async (req, res) => {
//     try {

//         const updatedBook = await Book.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );

//         if (!updatedBook) {
//             return res.status(404).json({ message: "找不到要更新的書籍" });
//         }
//         res.json(updatedBook);
//     } catch (error) {
//         res.status(500).json({ message: "更新失敗", error: error.message });
//     }
// });

// === 啟動伺服器 ===
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});