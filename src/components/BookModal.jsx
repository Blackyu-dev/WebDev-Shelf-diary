
import './BookModal.css';
import { useState } from 'react';
export default function BookModal({ book, isOpen, onClose }) {

    // 控制「詳細內容」是否展開的狀態
    const [isExpanded, setIsExpanded] = useState(false);

    // 如果沒有開啟，或是沒有選擇書籍，就不渲染任何東西
    if (!isOpen || !book) return null;

    return (
        <div
            className={`modal-overlay ${isExpanded ? 'expanded' : ''}`}
            onClick={onClose}
        >
            {/* 阻止點擊視窗內部時觸發外層的 onClose */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <h3 className="modal-title">{book.title}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-main-layout">
                    {/* ===================== 左側：書本基本資訊 ===================== */}
                    <div className="modal-body-left">
                        <div className="modal-image-container">
                            {/* <img src={book.coverImage} alt={book.title} className="modal-cover" /> */}
                            <img
                                className="modal-cover"
                                src={book.coverImage}
                                alt={book.title}
                            />
                        </div>

                        {/* 書籍基本資訊(顯示) */}
                        <div className="modal-info">
                            <p><strong>作者：</strong> {book.author}</p>
                            <p><strong>出版社：</strong> {book.publisher}</p>
                            {/* <p><strong>出版日期：</strong> {book.publishDate}</p>
                            <p><strong>出版地：</strong> {book.publishPlace}</p> */}
                            <p><strong>語言：</strong> {book.language}</p>
                            <p><strong>版本：</strong> {book.version}</p>
                            <p><strong>裝訂：</strong> {book.binding}</p>
                            <p><strong>分級：</strong> {book.grade}</p>
                            <p><strong>ISBN：</strong> {book.isbn}</p>

                            {/* 新增狀態與來源的標籤 */}
                            <div className="tag-container">

                                <span className={`status-tag ${book.status === '已讀' ? 'read' : 'reading'}`}>
                                    {book.status}
                                </span>

                                <span className="source-tag">
                                    {book.source}
                                </span>

                                <span className="category-tag">
                                    {book.category}
                                </span>

                                <span className="serial-tag">
                                    {book.serialStatus}
                                </span>

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
                        <div className="modal-body-right">
                            <hr className="modal-divider" />
                            <p className="modal-description">{book.description}</p>
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