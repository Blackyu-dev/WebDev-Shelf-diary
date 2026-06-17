import "./BookInfoCard.css";

export default function BookInfoCard({
  book,
  onChange
}) {

  // 處理圖片 URL 邏輯 (把魔法加進來╰(*°▽°*)╯)
  const getCoverUrl = (coverImage) => {
    if (!coverImage) return "https://placehold.co/120x180?text=No+Image";

    // 外部圖片（http / https）
    if (coverImage.startsWith("http://") || coverImage.startsWith("https://")) {
      return coverImage;
    }

    // 確保路徑前面有斜線，並拼上後端網址
    const formattedPath = coverImage.startsWith("/") ? coverImage : `/${coverImage}`;
    return `http://localhost:3000${formattedPath}`;
  };

  // ⭐️ 評分星星的渲染函式
  const renderStars = () => {
    const currentRating = book.rating || 0;

    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= currentRating
              ? "filled"
              : ""
              }`}
            onClick={() =>
              onChange("rating", star)
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="card info-card">
      <div className="top-section">
        {/*  書籍封面 */}
        <img
          src={getCoverUrl(book.coverImage)}
          className="panel-cover"
          alt="封面"
        />
        {/*  書籍資訊區 */}
        <div className="info-section">
          <div className="info-inner">
            <div className="line strong" title="作者">
              {book.author}
            </div>

            <div className="line" title="出版社">
              {book.publisher}
            </div>

            {/* // 出版日期、出版地點、語言、版本、裝幀、分級等資訊 */}
            <div className="line" title="出版日期">
              {book.publishDate && book.publishDate !== "出版日期"
                ? book.publishDate
                  .replace("年", "-")
                  .replace("月", "-")
                  .replace("日", "")
                : book.publishDate}
            </div>

            <div className="line" title="出版地點 | 語言">
              {[book.publishPlace, book.language]
                .filter(Boolean)
                .join(" ｜ ")}
            </div>

            <div className="line" title="版本 | 裝訂 | 分級">
              {book.version} ｜ {book.binding} ｜ {book.grade}
            </div>

            <div className="line isbn">
              ISBN {book.isbn}
            </div>

            {renderStars()}
          </div>
        </div>
      </div>
    </div>
  );
}