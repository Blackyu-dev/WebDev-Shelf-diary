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
        const bookData = {
            ...req.body,
        };

        if (req.file) {
            bookData.coverImage = `/uploads/${req.file.filename}`;
        } else if (req.body.coverImage) {
            bookData.coverImage = req.body.coverImage;
        }
        
        const book = new Book(bookData);
        const saved = await book.save();

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
router.put("/:id", upload.single("coverImage"), async (req, res) => {
    try {
        const updateData = {
            ...req.body,
        };

        if (req.file) {
            updateData.coverImage = `/uploads/${req.file.filename}`;
        }

        const updated = await Book.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;