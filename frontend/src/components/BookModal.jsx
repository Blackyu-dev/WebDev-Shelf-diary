import './BookModal.css';
import { useState } from 'react';
// 原本地的儲存邏輯
// import { addBook } from "../data/booksStorage";

export default function BookModal({ book, isOpen, onClose }) {
    // 「詳細內容」是否展開的狀態
    const [isExpanded, setIsExpanded] = useState(false);
    const [status, setStatus] = useState(book?.status || "未讀");

    // 設定來源選項 (如果書本本身的來源不在預設內，自動加進去)
    const defaultSources = ["博客來", "讀墨", "Play圖書", "誠品", "Hyread", "Kobo", "BOOKWALKER", "其他"];
    const initSources = book && book.source && !defaultSources.includes(book.source)
        ? [book.source, ...defaultSources]
        : defaultSources;
    const [sourceOptions, setSourceOptions] = useState(initSources);
    const [source, setSource] = useState(book?.source || "博客來");

    // 設定分類選項
    const defaultCategories = ["文學小說", "漫畫", "輕小說", "技術/學習", "雜誌", "其他"];
    const initCategories = book && book.category && !defaultCategories.includes(book.category)
        ? [book.category, ...defaultCategories]
        : defaultCategories;
    const [categoryOptions, setCategoryOptions] = useState(initCategories);
    const [category, setCategory] = useState(book?.category || "文學小說");

    const [customSource, setCustomSource] = useState("");
    const [customCategory, setCustomCategory] = useState("");

    // 封面圖片 URL
    const [coverFile, setCoverFile] = useState(null);

    // 所有基本欄位皆可編輯狀態

    const [title, setTitle] = useState(book?.title || "");
    const [author, setAuthor] = useState(book?.author || "");
    const [publisher, setPublisher] = useState(book?.publisher || "");
    const [language, setLanguage] = useState(book?.language || "");
    const [isbnState, setIsbnState] = useState(book?.isbn || "");

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
        } else {
            setSource("博客來"); // 空白則退回預設
        }
        setCustomSource("");
    };

    // 新增自訂分類並確認
    const handleConfirmCategory = () => {
        if (customCategory.trim() !== "") {
            if (!categoryOptions.includes(customCategory)) {
                const newOpts = categoryOptions.filter(o => o !== "其他");
                setCategoryOptions([...newOpts, customCategory, "其他"]);
            }
            setCategory(customCategory);
        } else {
            setCategory("文學小說"); // 空白則退回預設
        }
        setCustomCategory("");
    };

    // 將資料用 POST 送給 Express API
    const handleSave = async () => {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("author", author);
        formData.append("publisher", publisher);
        formData.append("language", language);
        formData.append("isbn", isbnState);
        formData.append("status", status);
        formData.append("source", source);
        formData.append("category", category);
        formData.append("version", version);
        formData.append("binding", binding);
        formData.append("grade", grade);

        if (coverFile) {
            formData.append("coverImage", coverFile);
        }

        const url = book?._id
            ? `http://localhost:3000/api/books/${book._id}`
            : "http://localhost:3000/api/books";

        const method = book?._id ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                body: formData, // ❗ 不要 Content-Type（瀏覽器會自動處理）
            });

            if (response.ok) {
                alert(book?._id ? "更新成功！" : "新增成功！");
                onClose();
            } else {
                const err = await response.json();
                alert(err.message);
            }
        } catch (error) {
            console.error(error);
            alert("伺服器錯誤");
        }
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
                            {/* 使用 book.coverImage，如果沒有就使用預設圖片 */}
                            <img
                                className="modal-cover"
                                src={
                                    book?.coverImage
                                        ? `http://localhost:3000${book.coverImage}`
                                        : "https://placehold.co/300x450?text=No+Image"
                                }
                            />

                            <label className="upload-btn">
                                上傳圖片
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setCoverFile(file);
                                    }}
                                />
                            </label>
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
                                        <option value="想讀">想讀</option>
                                    </select>
                                </div>

                                {/* 來源 */}
                                <div className="select-group">
                                    <label>來源</label>
                                    {source === "其他" ? (
                                        <div className="custom-tag-wrapper">
                                            <input
                                                className="custom-tag-input"
                                                autoFocus
                                                type="text"
                                                placeholder="輸入來源..."
                                                value={customSource}
                                                onChange={(e) => setCustomSource(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleConfirmSource()}
                                            />
                                            <button className="custom-tag-btn" onClick={handleConfirmSource}>✓</button>
                                        </div>
                                    ) : (
                                        <select
                                            value={source}
                                            onChange={(e) => setSource(e.target.value)}
                                        >
                                            {sourceOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* 分類 */}
                                <div className="select-group">
                                    <label>分類</label>
                                    {category === "其他" ? (
                                        <div className="custom-tag-wrapper">
                                            <input
                                                className="custom-tag-input"
                                                autoFocus
                                                type="text"
                                                placeholder="輸入分類..."
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleConfirmCategory()}
                                            />
                                            <button className="custom-tag-btn" onClick={handleConfirmCategory}>✓</button>
                                        </div>
                                    ) : (
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            {categoryOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
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