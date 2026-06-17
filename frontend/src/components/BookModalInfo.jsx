export default function BookModalInfo({ book, states, setters, handlers }) {
    return (
        <div className="modal-body-left">
            <div className="modal-image-container">
                <img className="modal-cover" src={states.previewUrl} alt={book.title} />
                <label className="upload-btn">
                    上傳圖片
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setters.setCoverFile(file);
                        }}
                    />
                </label>
            </div>

            <div className="modal-info">
                {/* 1. 作者 */}
                {book.author && book.author !== "未知" ? (
                    <p><strong>作者：</strong> {book.author}</p>
                ) : (
                    <div className="input-row">
                        <label><strong>作者：</strong></label>
                        <input
                            type="text"
                            placeholder="例如：高森美由紀..."
                            value={states.author}
                            onChange={(e) => setters.setAuthor(e.target.value)}
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
                            value={states.publisher}
                            onChange={(e) => setters.setPublisher(e.target.value)}
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
                            value={states.publishDate}
                            onChange={(e) => setters.setPublishDate(e.target.value)}
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
                            value={states.publishPlace}
                            onChange={(e) => setters.setPublishPlace(e.target.value)}
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
                            value={states.language}
                            onChange={(e) => setters.setLanguage(e.target.value)}
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
                            value={states.isbnState}
                            onChange={(e) => setters.setIsbnState(e.target.value)}
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
                            value={states.version}
                            onChange={(e) => setters.setVersion(e.target.value)}
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
                            value={states.binding}
                            onChange={(e) => setters.setBinding(e.target.value)}
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
                            value={states.grade}
                            onChange={(e) => setters.setGrade(e.target.value)}
                        />
                    </div>
                )}

                {/* 標籤容器 (閱讀狀態、來源、分類) */}
                <div className="tag-container">
                    {/* 閱讀狀態 */}
                    <div className="select-group">
                        <label>閱讀狀態</label>
                        <select value={states.status} onChange={(e) => setters.setStatus(e.target.value)}>
                            <option value="未讀">未讀</option>
                            <option value="閱讀中">閱讀中</option>
                            <option value="已讀">已讀</option>
                            <option value="想讀">想讀</option>
                        </select>
                    </div>

                    {/* 來源 */}
                    <div className="select-group">
                        <label>來源</label>
                        {states.source === "其他" ? (
                            <div className="custom-tag-wrapper">
                                <input
                                    className="custom-tag-input"
                                    autoFocus
                                    type="text"
                                    placeholder="輸入來源..."
                                    value={states.customSource}
                                    onChange={(e) => setters.setCustomSource(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handlers.handleConfirmSource()}
                                />
                                <button className="custom-tag-btn" onClick={handlers.handleConfirmSource}>✓</button>
                            </div>
                        ) : (
                            <select value={states.source} onChange={(e) => setters.setSource(e.target.value)}>
                                {states.sourceOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* 分類 */}
                    <div className="select-group">
                        <label>分類</label>
                        {states.category === "其他" ? (
                            <div className="custom-tag-wrapper">
                                <input
                                    className="custom-tag-input"
                                    autoFocus
                                    type="text"
                                    placeholder="輸入分類..."
                                    value={states.customCategory}
                                    onChange={(e) => setters.setCustomCategory(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handlers.handleConfirmCategory()}
                                />
                                <button className="custom-tag-btn" onClick={handlers.handleConfirmCategory}>✓</button>
                            </div>
                        ) : (
                            <select value={states.category} onChange={(e) => setters.setCategory(e.target.value)}>
                                {states.categoryOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <button className="save-btn" onClick={handlers.handleSave}>
                    加入書庫
                </button>

                <button
                    className="expand-btn"
                    onClick={() => setters.setIsExpanded(!states.isExpanded)}
                >
                    {states.isExpanded ? '收起簡介 ' : '查看簡介 '}
                </button>
            </div>
        </div>
    );
}