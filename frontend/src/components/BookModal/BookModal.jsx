import './BookModal.css';
import { useBookForm } from '../../hooks/useBookForm.js';
import BookModalInfo from './BookModalInfo.jsx';
import BookModalDesc from './BookModalDesc.jsx';

export default function BookModal({ book, isOpen, onClose }) {
    // 呼叫封裝好的 Hook，一次取得所有的狀態與函式
    const { states, setters, handlers } = useBookForm(book, onClose);

    // 如果 modal 沒有開啟，或是沒有傳入書籍資料，就不渲染任何東西
    if (!isOpen || !book) return null;

    return (
        <div
            className={`modal-overlay ${states.isExpanded ? 'expanded' : ''}`}
            onClick={onClose}
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* 頂部 Header */}
                <div className="modal-header">
                    {book.title ? (
                        <h3 className="modal-title">{book.title}</h3>
                    ) : (
                        <input
                            type="text"
                            placeholder="請輸入書名..."
                            value={states.title}
                            onChange={(e) => setters.setTitle(e.target.value)}
                            style={{ fontSize: "1.2em", fontWeight: "bold", padding: "5px", width: "80%" }}
                        />
                    )}
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {/* 畫面主體：分成左右兩塊 */}
                <div className="modal-main-layout">

                    {/* 左側：基本資訊與輸入框 */}
                    <BookModalInfo
                        book={book}
                        states={states}
                        setters={setters}
                        handlers={handlers}
                    />

                    {/* 右側：簡介編輯區 */}
                    <BookModalDesc
                        states={states}
                        setters={setters}
                    />

                </div>
            </div>
        </div>
    );
}