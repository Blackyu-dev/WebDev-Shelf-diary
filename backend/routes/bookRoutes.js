import express from "express";
import Book from "../models/Book.js";
import multer from "multer";
import path from "path";

// === Multer 圖片上傳設定 ===
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName =
            file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });
const router = express.Router();

// === 1. GET API：取得所有書籍 (加入由新到舊排序) ===
router.get("/", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "取得書籍資料失敗", error: err.message });
    }
});

// === 2. POST API：新增書籍 (結合圖片上傳 + 防呆機制) ===
router.post("/", upload.single("coverImage"), async (req, res) => {
    try {
        const { title, author, isbn } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: "請輸入書名" });
        }
        if (!author?.trim()) {
            return res.status(400).json({ message: "請輸入作者" });
        }

        const existingBook = await Book.findOne({
            title: title.trim(),
            author: author.trim()
        });

        if (existingBook) {
            return res.status(409).json({ message: "書庫中已存在相同書名與作者" });
        }

        if (isbn?.trim() && isbn.trim() !== "未知") {
            const isValidFormat = /^(?:\d{10}|\d{13})$/.test(isbn?.trim());
            if (!isValidFormat) {
                return res.status(400).json({ message: "ISBN 必須是 10 或 13 位數字" });
            }

            const existingIsbn = await Book.findOne({ isbn: isbn.trim() });
            if (existingIsbn) {
                return res.status(409).json({ message: `ISBN (${isbn}) 已存在` });
            }
        }

        const bookData = {
            ...req.body,
            title: title.trim(),
            author: author.trim(),
        };

        if (req.file) {
            bookData.coverImage = `/uploads/${req.file.filename}`;
        } else if (req.body.coverImage) {
            bookData.coverImage = req.body.coverImage;
        }

        const book = new Book(bookData);
        const saved = await book.save();

        return res.status(201).json(saved);

    } catch (err) {
        console.error("🔥 CREATE BOOK ERROR:", err);
        return res.status(500).json({ message: "新增書籍失敗", error: String(err) });
    }
});

// === 3. GET API：匯出所有書籍 (獨立路由供匯出使用) ===
router.get("/export", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "匯出書籍資料失敗", error: err.message });
    }
});

// === 4. DELETE API：清空所有書籍 ===
// ⚠️ 必須放在 /:id 之前，避免 "clear" 被當成 ID 解析
router.delete("/clear", async (req, res) => {
    try {
        await Book.deleteMany({});
        return res.json({ message: "所有書籍已成功清空" });
    } catch (err) {
        console.error("🔥 CLEAR ALL ERROR:", err);
        return res.status(500).json({ message: "清空書籍失敗", error: String(err) });
    }
});

// === 5. PUT API：根據 _id 更新書籍資料 (結合圖片上傳) ===
router.put("/:id", upload.single("coverImage"), async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.coverImage = `/uploads/${req.file.filename}`;
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            updateData,
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

// === 6. DELETE API：用 _id 刪除單筆資料 ===
router.delete("/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({ message: "找不到要刪除的書籍" });
        }

        return res.json({ message: "刪除成功", deletedId: req.params.id });

    } catch (err) {
        console.error("DELETE ERROR:", err);
        return res.status(500).json({ message: "刪除失敗", error: String(err) });
    }
});

export default router;