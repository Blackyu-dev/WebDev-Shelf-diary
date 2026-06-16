import "./BookInfoCard.css";

export default function BookInfoCard({
  book,
  onChange
}) {

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
        <img
          src={book.coverImage}
          className="panel-cover"
          alt="封面"
        />

        <div className="info-section">
          <div className="info-inner">
            <div className="line strong">
              {book.author}
            </div>

            <div className="line">
              {book.publisher}
            </div>

            {/* // 出版日期、出版地點、語言、版本、裝幀、分級等資訊 */}
            <div className="line">
              {book.publishDate
                ?.replace("年", "-")
                .replace("月", "-")
                .replace("日", "")}
            </div>

            <div className="line">
              {[book.publishPlace, book.language]
                .filter(Boolean)
                .join(" ｜ ")}
            </div>

            <div className="line">
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