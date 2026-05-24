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

    // ==========================================
    // 🌟 全面擴充：讓所有基本欄位都變成可編輯狀態
    // ==========================================
    const [title, setTitle] = useState(book?.title || "");
    const [author, setAuthor] = useState(book?.author || "");
    const [publisher, setPublisher] = useState(book?.publisher || "");
    const [language, setLanguage] = useState(book?.language || "");
    const [isbnState, setIsbnState] = useState(book?.isbn || ""); // 避免跟內建變數衝突，取名 isbnState

    const [version, setVersion] = useState(book?.version || "");
    const [binding, setBinding] = useState(book?.binding || "");
    const [grade, setGrade] = useState(book?.grade || "");



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
            title: title || "未命名書籍",
            status,
            source,
            category,
            version: version || "未知",
            binding: binding || "未知",
            grade: grade || "未知"
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
                    {book.title ? (
                        <h3 className="modal-title">{book.title}</h3>
                    ) : (
                        <input
                            type="text"
                            placeholder="請輸入書名..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ fontSize: "1.2em", fontWeight: "bold", padding: "5px", width: "80%" }}
                        />
                    )}
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-main-layout">
                    {/* ===================== 左側：書本基本資訊 ===================== */}
                    <div className="modal-body-left">
                        <div className="modal-image-container">
                            <img
                                className="modal-cover"
                                src={book.coverImage || "https://placehold.co/300x450?text=No+Image"}
                                alt={book.title}
                            />
                        </div>

                        <div className="modal-info">
                            {book.author && book.author !== "未知" ? (
                                <p><strong>作者：</strong> {book.author}</p>
                            ) : (
                                <div className="input-row">
                                    <label><strong>作者：</strong></label>
                                    <input
                                        type="text"
                                        placeholder="例如：高森美由紀..."
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* 2. 出版社 */}
                            {book.publisher && book.publisher !== "未知" && book.publisher !== "" ? (
                                <p><strong>出版社：</strong> {book.publisher}</p>
                            ) : (
                                <div className="input-row">
                                    <label><strong>出版社：</strong></label>
                                    <input
                                        type="text"
                                        placeholder="例如：馬可孛羅..."
                                        value={publisher}
                                        onChange={(e) => setPublisher(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* 3. 語言 */}
                            {book.language && book.language !== "未知" && book.language !== "" ? (
                                <p><strong>語言：</strong> {book.language}</p>
                            ) : (
                                <div className="input-row">
                                    <label><strong>語言：</strong></label>
                                    <input
                                        type="text"
                                        placeholder="例如：繁體中文..."
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* 4. ISBN */}
                            {book.isbn && book.isbn !== "無 ISBN" && book.isbn !== "" ? (
                                <p><strong>ISBN：</strong> {book.isbn}</p>
                            ) : (
                                <div className="input-row">
                                    <label><strong>ISBN：</strong></label>
                                    <input
                                        type="text"
                                        placeholder="例如：978626..."
                                        value={isbnState}
                                        onChange={(e) => setIsbnState(e.target.value)}
                                    />
                                </div>
                            )}
                            {/* 版本 */}
                            {book.version && book.version !== "未知" ? (
                                <p><strong>版本：</strong> {book.version}</p>
                            ) : (
                                <div className="input-row">
                                    <label><strong>版本：</strong></label>
                                    <input
                                        type="text"
                                        placeholder="例如：初版..."
                                        value={version}
                                        onChange={(e) => setVersion(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* 裝訂 */}
                            {book.binding && book.binding !== "未知" ? (
                                <p><strong>裝訂：</strong> {book.binding}</p>
                            ) : (
                                <div className="input-row">
                                    <label><strong>裝訂：</strong></label>
                                    <input
                                        type="text"
                                        placeholder="例如：平裝..."
                                        value={binding}
                                        onChange={(e) => setBinding(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* 分級 */}
                            {book.grade && book.grade !== "未知" ? (
                                <p><strong>分級：</strong> {book.grade}</p>
                            ) : (
                                <div className="input-row">
                                    <label><strong>分級：</strong></label>
                                    <input
                                        type="text"
                                        placeholder="例如：普通級..."
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                    />
                                </div>
                            )}

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