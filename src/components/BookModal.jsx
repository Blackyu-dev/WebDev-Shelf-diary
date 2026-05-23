import './BookModal.css';
import { useState } from 'react';
import { addBook } from "../data/booksStorage";

export default function BookModal({ book, isOpen, onClose }) {
    // 控制「詳細內容」是否展開的狀態
    const [isExpanded, setIsExpanded] = useState(false);
    const [status, setStatus] = useState(book?.status || "未讀");

    // 設定來源選項 (如果書本本身的來源不在預設內，自動加進去)
    const defaultSources = ["博客來", "讀冊", "Kindle", "其他"];
    const initSources = book && book.source && !defaultSources.includes(book.source)
        ? [book.source, ...defaultSources]
        : defaultSources;
    const [sourceOptions, setSourceOptions] = useState(initSources);
    const [source, setSource] = useState(book?.source || "博客來");

    // 設定分類選項
    const defaultCategories = ["文學小說", "漫畫", "輕小說", "其他"];
    const initCategories = book && book.category && !defaultCategories.includes(book.category)
        ? [book.category, ...defaultCategories]
        : defaultCategories;
    const [categoryOptions, setCategoryOptions] = useState(initCategories);
    const [category, setCategory] = useState(book?.category || "文學小說");

    const [customSource, setCustomSource] = useState("");
    const [customCategory, setCustomCategory] = useState("");

    // 新增自訂來源並確認
    const handleConfirmSource = () => {
        if (customSource.trim() !== "") {
            if (!sourceOptions.includes(customSource)) {
                // 將新選項加在 "其他" 前面
                const newOpts = sourceOptions.filter(o => o !== "其他");
                setSourceOptions([...newOpts, customSource, "其他"]);
            }
            setSource(customSource);
            setCustomSource(""); // 清空輸入框
        }
    };

    // 新增自訂分類並確認
    const handleConfirmCategory = () => {
        if (customCategory.trim() !== "") {
            if (!categoryOptions.includes(customCategory)) {
                const newOpts = categoryOptions.filter(o => o !== "其他");
                setCategoryOptions([...newOpts, customCategory, "其他"]);
            }
            setCategory(customCategory);
            setCustomCategory("");
        }
    };

    const handleSave = () => {
        const updatedBook = {
            ...book,
            status,
            source,
            category,
        };
        addBook(updatedBook);
        onClose();
    };

    if (!isOpen || !book) return null;

    return (
        <div
            className={`modal-overlay ${isExpanded ? 'expanded' : ''}`}
            onClick={onClose}
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{book.title}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-main-layout">
                    {/* ===================== 左側：書本基本資訊 ===================== */}
                    <div className="modal-body-left">
                        <div className="modal-image-container">
                            <img
                                className="modal-cover"
                                src={book.coverImage}
                                alt={book.title}
                            />
                        </div>

                        <div className="modal-info">
                            <p><strong>作者：</strong> {book.author}</p>
                            <p><strong>出版社：</strong> {book.publisher}</p>
                            <p><strong>語言：</strong> {book.language}</p>
                            <p><strong>版本：</strong> {book.version}</p>
                            <p><strong>裝訂：</strong> {book.binding}</p>
                            <p><strong>分級：</strong> {book.grade}</p>
                            <p><strong>ISBN：</strong> {book.isbn}</p>

                            {/* 閱讀狀態、來源、分類 (橫向並排) */}
                            <div className="tag-container">
                                {/* 閱讀狀態 */}
                                <div className="select-group">
                                    <label>閱讀狀態</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="未讀">未讀</option>
                                        <option value="閱讀中">閱讀中</option>
                                        <option value="已讀">已讀</option>
                                    </select>
                                </div>

                                {/* 來源 */}
                                <div className="select-group">
                                    <label>來源</label>
                                    <select
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                    >
                                        {sourceOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>

                                    {source === "其他" && (
                                        <div className="custom-input-group">
                                            <input
                                                type="text"
                                                placeholder="輸入來源..."
                                                value={customSource}
                                                onChange={(e) => setCustomSource(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleConfirmSource()}
                                            />
                                            <button className="custom-confirm-btn" onClick={handleConfirmSource}>確認</button>
                                        </div>
                                    )}
                                </div>

                                {/* 分類 */}
                                <div className="select-group">
                                    <label>分類</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {categoryOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>

                                    {category === "其他" && (
                                        <div className="custom-input-group">
                                            <input
                                                type="text"
                                                placeholder="輸入分類..."
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleConfirmCategory()}
                                            />
                                            <button className="custom-confirm-btn" onClick={handleConfirmCategory}>確認</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="save-btn" onClick={handleSave}>
                                加入書庫
                            </button>

                            <button
                                className="expand-btn"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? '收起詳細資料 ' : '查看詳細資料 '}
                            </button>
                        </div>
                    </div>

                    {/* ===================== 右側：條件渲染的詳細描述 ===================== */}
                    {isExpanded && (
                        <div className="modal-body-right scrollable">
                            <hr className="modal-divider" />
                            <p className="modal-description">{book.description || "暫無詳細資料。"}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// TODO:架構圖
// BookModal（彈窗）
// │
// ├── modal-overlay（背景遮罩）
// │
// └── modal-content（主要視窗）
//     │
//     ├── modal-header（標題列）
//     │   ├── 書名 book.title
//     │   └── 關閉按鈕 ×
//     │
//     └── modal-main-layout（左右分欄）
//         │
//         ├── 左側 modal-body-left（基本資訊）
//         │   │
//         │   ├── 圖片區 modal-image-container
//         │   │   └── 書封面 book.cover
//         │   │
//         │   ├── info 區 modal-info
//         │   │   ├── 作者 author
//         │   │   ├── 出版社 publisher
//         │   │   ├── 出版日期 publishDate
//         │   │   ├── 出版地 publishPlace
//         │   │   ├── 語言 language
//         │   │   ├── 版本 version
//         │   │   ├── 裝訂 binding
//         │   │   ├── 分級 grade
//         │   │   ├── ISBN isbn
//         │   │   │
//         │   │   ├── tag-container
//         │   │   │   ├── status-tag（已讀 / 閱讀中）
//         │   │   │   └── source-tag（來源）
//         │   │   │
//         │   │   └── expand-btn（展開詳細資料）
//         │
//         └── 右側 modal-body-right（條件顯示）
//             │
//             ├── modal-divider（分隔線）
//             └── modal-description（書籍簡介）
//                 （只有 isExpanded = true 才顯示）