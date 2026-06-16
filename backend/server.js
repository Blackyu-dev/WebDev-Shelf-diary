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
        const { title, author, status, source, category, serialStatus,
            publisher, isbn, coverImage, description,
            language, version, binding, grade, rating } = req.body;


        if (title=='未命名書籍' || author=='未知') {
            return res.status(400).json({ message: "書名與作者為必填" });
        }

        // 防呆機制 1：檢查「書名」與「作者」是否完全相同
        const existingBook = await Book.findOne({ title, author });
        if (existingBook) {
            return res.status(409).json({ message: "書庫中已經有一本相同「書名」與「作者」的書囉！" });
        }

        // 防呆機制 2：如果使用者有輸入 ISBN，檢查 ISBN 是否重複
        if (isbn && isbn !== "無 ISBN" && isbn !== "") {
            const existingIsbn = await Book.findOne({ isbn });
            if (existingIsbn) {
                return res.status(409).json({ message: `這組 ISBN (${isbn}) 已經存在於書庫中了！` });
            }
        }

        const newBook = await Book.create({
            title, author, status, source, category, serialStatus, publisher, isbn, coverImage, description,
            language, version, binding, grade, rating
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

// 4. PUT API：根據 _id 更新書籍資料 (備註、收藏狀態、閱讀狀態等)
app.put("/api/books/:id", async (req, res) => {
    try {

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "找不到要更新的書籍" });
        }
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "更新失敗", error: error.message });
    }
});

// === 啟動伺服器 ===
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});