import "./BookTagCard.css";
import { useState } from "react";

export default function BookTagCard({ book, onChange }) {
  const [customSource, setCustomSource] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const defaultSources = ["博客來", "讀墨", "Play圖書", "誠品", "Hyread", "Kobo", "BOOKWALKER", "其他"];
  const displaySources = book.source && !defaultSources.includes(book.source)
    ? [book.source, ...defaultSources]
    : defaultSources;

  const defaultCategories = ["文學小說", "漫畫", "輕小說", "技術/學習", "雜誌", "其他"];
  const displayCategories = book.category && !defaultCategories.includes(book.category)
    ? [book.category, ...defaultCategories]
    : defaultCategories;

  // 來源確認：如果空白就退回預設值，避免卡在輸入框
  const handleConfirmSource = () => {
    if (customSource.trim() !== "") {
      onChange("source", customSource.trim());
    } else {
      onChange("source", "博客來");
    }
    setCustomSource("");
  };

  // 分類確認
  const handleConfirmCategory = () => {
    if (customCategory.trim() !== "") {
      onChange("category", customCategory.trim());
    } else {
      onChange("category", "文學小說");
    }
    setCustomCategory("");
  };

  return (
    <div className="card tag-card">

      {/* 閱讀狀態 */}
      <select
        className="tag-select"
        value={book.status || "未讀"}
        onChange={(e) => onChange("status", e.target.value)}
      >
        <option value="未讀">未讀</option>
        <option value="想讀">想讀</option>
        <option value="閱讀中">閱讀中</option>
        <option value="已讀">已讀</option>
      </select>

      {/* 來源：選「其他」時切換成輸入框 */}
      {book.source === "其他" ? (
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
          className="tag-select"
          value={book.source || "其他"}
          onChange={(e) => onChange("source", e.target.value)}
        >
          {displaySources.map(src => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>
      )}

      {/* 分類：選「其他」時切換成輸入框 */}
      {book.category === "其他" ? (
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
          className="tag-select"
          value={book.category || "其他"}
          onChange={(e) => onChange("category", e.target.value)}
        >
          {displayCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}

      {/* 連載狀態 */}
      <select
        className="tag-select"
        value={book.serialStatus || "完結"}
        onChange={(e) => onChange("serialStatus", e.target.value)}
      >
        <option value="連載中">連載中</option>
        <option value="已完結">已完結</option>
      </select>

      {/* 收藏 */}
      <label className="favorite-heart">
        <input
          type="checkbox"
          checked={book.favorite || false}
          onChange={(e) => onChange("favorite", e.target.checked)}
        />

        <span className="heart">
          {book.favorite ? "❤️" : "🤍"}
        </span>收藏
      </label>

    </div>
  );
}