import "./BookTagCard.css";

export default function BookTagCard({
  book,
  onChange
}) {
  // 動態產生「來源」選項：如果書本的來源不在預設清單中，就把它加到最前面
  const defaultSources = ["博客來", "讀冊", "Kindle", "其他"];
  const displaySources = book.source && !defaultSources.includes(book.source)
    ? [book.source, ...defaultSources]
    : defaultSources;

  // 動態產生「分類」選項：如果書本的分類不在預設清單中，就把它加到最前面
  const defaultCategories = ["文學小說", "漫畫", "輕小說", "其他"];
  const displayCategories = book.category && !defaultCategories.includes(book.category)
    ? [book.category, ...defaultCategories]
    : defaultCategories;

  return (
    <div className="card tag-card">

      {/* 閱讀狀態 */}
      <select
        className="tag-select"
        value={book.status || "未讀"}
        onChange={(e) =>
          onChange("status", e.target.value)
        }
      >
        <option value="未讀">未讀</option>
        <option value="閱讀中">閱讀中</option>
        <option value="已讀">已讀</option>
        <option value="想讀">想讀</option>
      </select>

      {/* 來源 */}
      <select
        className="tag-select"
        value={book.source || "其他"}
        onChange={(e) => onChange("source", e.target.value)}
      >
        {displaySources.map(src => (
          <option key={src} value={src}>{src}</option>
        ))}
      </select>

      {/* 分類 */}
      <select
        className="tag-select"
        value={book.category || "其他"}
        onChange={(e) => onChange("category", e.target.value)}
      >
        {displayCategories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* 連載狀態 */}
      <select
        className="tag-select"
        value={book.serialStatus || "完結"}
        onChange={(e) =>
          onChange(
            "serialStatus",
            e.target.value
          )
        }
      >
        <option value="連載中">連載中</option>
        <option value="已完結">已完結</option>
      </select>

      {/* 收藏 */}
      <label className="checkbox-tag">
        <input
          type="checkbox"
          checked={book.favorite || false}
          onChange={(e) =>
            onChange(
              "favorite",
              e.target.checked
            )
          }
        />
        收藏
      </label>

      {/* 系列 */}
      <label className="checkbox-tag">
        <input
          type="checkbox"
          checked={book.isSeries || false}
          onChange={(e) =>
            onChange(
              "isSeries",
              e.target.checked
            )
          }
        />
        系列書
      </label>

      {/* 系列名稱輸入框（只有當「系列書」被勾選時才顯示） */}
      {book.isSeries && (
        <input
          className="series-input"
          type="text"
          placeholder="系列名稱"
          value={book.seriesName || ""}
          onChange={(e) =>
            onChange(
              "seriesName",
              e.target.value
            )
          }
        />
      )}
    </div>
  );
}