import express from "express";
import Book from "../models/Book.js";
import multer from "multer";
import path from "path";

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

// ➜ 新增書籍
router.post("/", upload.single("coverImage"), async (req, res) => {
    try {

        const { title, author, isbn } = req.body;

        // ========================
        // ✅ 1. 必填驗證（最前面）
        // ========================
        if (!title?.trim()) {
            return res.status(400).json({ message: "請輸入書名" });
        }

        if (!author?.trim()) {
            return res.status(400).json({ message: "請輸入作者" });
        }

        // ========================
        // ✅ 2. 重複書名 + 作者
        // ========================
        const existingBook = await Book.findOne({
            title: title.trim(),
            author: author.trim()
        });

        if (existingBook) {
            return res.status(409).json({
                message: "書庫中已存在相同書名與作者"
            });
        }

        // ========================
        // ✅ 3. ISBN 檢查
        // ========================
        if (isbn?.trim() && isbn.trim() !== "未知") {
            // ISBN 必須是 10 或 13 位數字
            const isValidFormat =
                /^(?:\d{10}|\d{13})$/.test(isbn?.trim());

            if (!isValidFormat) {
                return res.status(400).json({
                    message: "ISBN 必須是 10 或 13 位數字"
                });
            }

            // 檢查是否已存在相同 ISBN
            const existingIsbn = await Book.findOne({
                isbn: isbn.trim()
            });

            if (existingIsbn) {
                return res.status(409).json({
                    message: `ISBN (${isbn}) 已存在`
                });
            }
        }

        // ========================
        // ✅ 4. 組資料
        // ========================
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

        // ========================
        // ✅ 5. 存資料（只做一次）
        // ========================
        const book = new Book(bookData);
        const saved = await book.save();

        return res.status(201).json(saved);

    } catch (err) {
        console.error("🔥 CREATE BOOK ERROR:", err);

        return res.status(500).json({
            message: "新增書籍失敗",
            error: String(err)
        });
    }
});

// ➜ 取得所有書籍
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 更新書籍
// PUT API：根據 _id 更新書籍資料 (備註、收藏狀態、閱讀狀態等)
router.put("/:id", async (req, res) => {
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

// ➜ 刪除書籍
router.delete("/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({
                message: "找不到要刪除的書籍"
            });
        }

        return res.json({
            message: "刪除成功",
            deletedId: req.params.id
        });

    } catch (err) {
        console.error("DELETE ERROR:", err);

        return res.status(500).json({
            message: "刪除失敗",
            error: String(err)
        });
    }
});

export default router;