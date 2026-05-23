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

        {/* ===== 卡片1：基本資訊 ===== */}
        <div className="card info-card">

          <div className="top-section">

            <img
              src={book.coverImage}
              className="panel-cover"
            />

            <div className="info-section">

              {/* 作者 + 出版社（主資訊） */}
              <div className="line strong">
                {book.author}
              </div>

              <div className="line">
                {book.publisher}
              </div>

              {/* 時間 */}
              <div className="line">
                {book.publishDate
                  .replace("年", "-")
                  .replace("月", "-")
                  .replace("日", "")
                }
              </div>

              {/* 地區 + 語言 */}
              <div className="line">
                {book.publishPlace} ｜ {book.language}
              </div>

              {/* 版本 + 裝訂 + 分級 */}
              <div className="line">
                {book.version} ｜ {book.binding} ｜ {book.grade}
              </div>

              {/* ISBN */}
              <div className="line isbn">
                ISBN {book.isbn}
              </div>

            </div>

          </div>
        </div>

        {/* ===== 卡片2：Tags ===== */}
        <div className="card tag-card">
          <span className="tag">{book.status}</span>
          <span className="tag">{book.source}</span>
          <span className="tag">{book.category}</span>
          <span className="tag">{book.serialStatus}</span>
        </div>

        {/* ===== 卡片3：簡介 ===== */}
        <div className="card desc-card">
          <div className="desc-title">簡介</div>
          <p className="desc-text">{book.description}</p>
        </div>

      </div>
    </div>
  );
}