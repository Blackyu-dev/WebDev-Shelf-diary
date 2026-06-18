import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Book from "./models/Book.js";
import bookRoutes from "./routes/bookRoutes.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json()); // 將前端傳來的 JSON 解析到 req.body
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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

// === 啟動伺服器 ===
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/api/books`);
});