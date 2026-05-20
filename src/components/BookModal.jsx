
import { useState } from 'react';
export default function BookModal({ book, isOpen, onClose }) {

    // 控制「詳細內容」是否展開的狀態
    const [isExpanded, setIsExpanded] = useState(false);

    // 如果沒有開啟，或是沒有選擇書籍，就不渲染任何東西
    if (!isOpen || !book) return null;

    return (
        <div
            className={`custom-modal-overlay ${isExpanded ? 'expanded' : ''}`}
            onClick={onClose}
        >
            {/* 阻止點擊視窗內部時觸發外層的 onClose */}
            <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="custom-modal-header">
                    <h3 className="custom-modal-title">{book.title}</h3>
                    <button className="custom-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="custom-modal-main-layout">
                    {/* ===================== 左側：書本基本資訊 ===================== */}
                    <div className="custom-modal-body-left">
                        <div className="modal-image-container">
                            <img src={book.coverImage} alt={book.title} className="custom-modal-cover" />
                        </div>
                        <div className="custom-modal-info">
                            <p><strong>作者：</strong> {book.author}</p>
                            <p><strong>分類：</strong> {book.category}</p>
                            <p><strong>ISBN：</strong> {book.isbn}</p>
                            {/* 新增狀態與來源的標籤 */}
                            <div className="tag-container">
                                <span className={`status-tag ${book.status === '已讀' ? 'read' : 'reading'
                                    }`}>
                                    {book.status}
                                </span>
                                <span className="source-tag">{book.source}</span>
                            </div>

                            {/* 展開/收起 按鈕 */}
                            <button
                                className="expand-btn"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? '收起詳細資料 ' : '查看詳細資料 '}
                            </button>
                        </div>
                    </div>
                    {/* ===================== 右側：條件渲染的詳細描述 ===================== */}
                    {/* 條件渲染：當 isExpanded 為 true 時才顯示 description */}
                    {isExpanded && (
                        <div className="custom-modal-body-right">
                            <hr className="modal-divider" />
                            <p className="modal-description">{book.description}</p>
                        </div>
                    )}
                </div>
            </div>

        </div>


    );
}