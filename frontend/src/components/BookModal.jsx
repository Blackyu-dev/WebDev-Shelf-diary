import './BookModal.css';
import { useState } from 'react';
// 原本地的儲存邏輯
// import { addBook } from "../data/booksStorage";

export default function BookModal({ book, isOpen, onClose }) {
    // 「簡介內容」是否展開的狀態
    const [isExpanded, setIsExpanded] = useState(true);
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
    // 根據 URL 判斷圖片來源，並返回正確的完整 URL
    const getCoverUrl = (url) => {
        if (!url) return "https://placehold.co/300x450?text=No+Image";

        // 外部圖片
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        // 後端 uploads
        return `http://localhost:3000${url}`;
    };
    // 如果使用者上傳了新圖片，優先使用預覽 URL；否則使用 book.coverImage 的 URL
    const previewUrl = coverFile
        ? URL.createObjectURL(coverFile)
        : getCoverUrl(book.coverImage);

    const safeValue = (value) => {
        return value && value.trim() !== "" ? value : "未知";
    };

    // 所有基本欄位皆可編輯狀態
    const [title, setTitle] = useState(book?.title || "");
    const [author, setAuthor] = useState(book?.author || "");
    const [publishDate, setPublishDate] = useState(book?.publishDate || "");
    const [publisher, setPublisher] = useState(book?.publisher || "");
    const [publishPlace, setPublishPlace] = useState(book?.publishPlace || "");
    const [language, setLanguage] = useState(book?.language || "");
    const [isbnState, setIsbnState] = useState(book?.isbn || "");

    const [version, setVersion] = useState(book?.version || "");
    const [binding, setBinding] = useState(book?.binding || "");
    const [grade, setGrade] = useState(book?.grade || "");
    const [description, setDescription] = useState(
        book?.description || ""
    );
    // 是否正在編輯簡介的狀態（點擊簡介後進入編輯模式）
    const [isEditingDesc, setIsEditingDesc] = useState(false);

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

        formData.append("title", safeValue(title));
        formData.append("author", safeValue(author));
        formData.append("publishDate", safeValue(publishDate));
        formData.append("publisher", safeValue(publisher));
        formData.append("publishPlace", safeValue(publishPlace));
        formData.append("language", safeValue(language));
        formData.append("isbn", safeValue(isbnState));
        formData.append("status", safeValue(status));
        formData.append("source", safeValue(source));
        formData.append("category", safeValue(category));
        formData.append("version", safeValue(version));
        formData.append("binding", safeValue(binding));
        formData.append("grade", safeValue(grade));
        formData.append("description", safeValue(description));

        if (coverFile) {
            formData.append("coverImage", coverFile);
        } else {
            formData.append("coverImage", book.coverImage || "");
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
                const updatedBook = await response.json();
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
                                src={previewUrl}
                                alt={book.title}
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

                            {/* 3. 出版日期 */}
                            {book.publishDate && book.publishDate !== "未知" ? (
                                <p><strong>出版日期：</strong> {book.publishDate}</p>
                            ) : (
                                <div className="input-row">
                                    <label><strong>出版日期：</strong></label>
                                    <input
                                        type="date"
                                        value={publishDate}
                                        onChange={(e) => setPublishDate(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* 4. 出版地 */}
                            {book.publishPlace && book.publishPlace !== "未知" ? (
                                <p><strong>出版地：</strong> {book.publishPlace}</p>
                            ) : (
                                <div className="input-row">
                                    <label><strong>出版地：</strong></label>
                                    <input
                                        type="text"
                                        placeholder="例如：台灣、東京..."
                                        value={publishPlace}
                                        onChange={(e) => setPublishPlace(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* 5. 語言 */}
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

                            {/* 6. ISBN */}
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
                            {/* 7. 版本 */}
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

                            {/* 8. 裝訂 */}
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

                            {/* 9. 分級 */}
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
                                {isExpanded ? '收起簡介 ' : '查看簡介 '}
                            </button>
                        </div>
                    </div>

                    {/* ===================== 右側：條件渲染的簡介 ===================== */}
                    <div className="modal-body-right">
                        <hr className="modal-divider" />

                        {isEditingDesc || description.trim() === "" ? (
                            <textarea
                                className="modal-description"
                                value={description}
                                autoFocus
                                placeholder="輸入書籍簡介..."
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={() => setIsEditingDesc(false)}
                            />
                        ) : (
                            <p
                                className="modal-description"
                                onClick={() => setIsEditingDesc(true)}
                                style={{ cursor: "pointer" }}
                            >
                                {description || "暫無簡介（點擊編輯）"}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}