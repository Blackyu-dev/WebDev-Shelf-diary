import "./BookDescriptionCard.css";

export default function BookDescriptionCard({
  description
}) {
  // 右側：簡介編輯區
  return (
    <div className="card desc-card">
      <div className="desc-title">
        簡介
      </div>

      <p className="desc-text">
        {description}
      </p>
    </div>
  );
}