import "./BookDetailPanel.css";

export default function BookDetailPanel({ book, onClose }) {
  if (!book) return null;

  return (
    <div className={`side-panel ${book ? "open" : ""}`}>

      {/* Header */}
      <div className="panel-header">

        <button className="back-btn" onClick={onClose}>→</button>

        <h3 className="panel-title">{book.title}</h3>

      </div>

      {/*----------- 內容區 -----------*/}
      <div className="panel-body">

        {/* ===== 上半部：左圖 + 右資訊 ===== */}
        <div className="top-section">

          {/* 左：封面 */}
          <img
            src={book.coverImage}
            alt={book.title}
            className="panel-cover"
          />

          {/* 右：資訊 */}
          <div className="info-section">
            <p><strong>作者：</strong>{book.author}</p>
            <p><strong>出版社：</strong>{book.publisher}</p>
            <p><strong>語言：</strong> {book.language}</p>
            <p><strong>版本：</strong> {book.version}</p>
            <p><strong>裝訂：</strong> {book.binding}</p>
            <p><strong>分級：</strong> {book.grade}</p>
            <p><strong>ISBN：</strong> {book.isbn}</p>
          </div>

        </div>

        {/* ===== TAG 區 ===== */}
        <div className="tag-container">
          <span className="status-tag">{book.status}</span>
          <span className="source-tag">{book.source}</span>
          <span className="category-tag">{book.category}</span>
          <span className="serial-tag">{book.serialStatus}</span>
        </div>

        {/* ===== 簡介 ===== */}
        <div className="desc-section">
          <h4>簡介</h4>
          <p className="desc">{book.description}</p>
        </div>

      </div>
    </div>
  );
}