// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Book from "./models/Book.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // 自動將前端傳來的 JSON 解析到 req.body

// === MongoDB 連線設定 ===
const LOCAL_MONGODB_URI = "mongodb://127.0.0.1:27017/Shelf-Diary";

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


// 1. GET API
app.get("/api/books", async (req, res) => {
    try {
        // 由新到舊排序，回傳 JSON 給 React 
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "取得書籍資料失敗", error: error.message });
    }
});

// 2. POST API
app.post("/api/books", async (req, res) => {
    try {
        const { title, author, status, source, category, serialStatus, publisher, isbn, coverImage, description } = req.body;


        if (!title || !author) {
            return res.status(400).json({ message: "書名與作者為必填" });
        }


        const newBook = await Book.create({
            title, author, status, source, category, serialStatus, publisher, isbn, coverImage, description
        });

        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: "新增書籍失敗", error: error.message });
    }
});

// 3. DELETE API：用 _id 刪除資料 
app.delete("/api/books/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({ message: "找不到要刪除的書籍" });
        }
        res.json({ message: "刪除成功", deletedId: req.params.id });
    } catch (error) {
        res.status(500).json({ message: "刪除失敗", error: error.message });
    }
});

// === 啟動伺服器 ===
app.listen(PORT, () => {
    console.log(`後端伺服器已啟動：http://localhost:${PORT}`);
});