import "./BookTagCard.css";

export default function BookTagCard({
  book,
  onChange
}) {
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
        onChange={(e) =>
          onChange("source", e.target.value)
        }
      >
        <option value="博客來">博客來</option>
        <option value="讀冊">讀冊</option>
        <option value="Kindle">Kindle</option>
        <option value="其他">其他</option>
      </select>

      {/* 分類 */}
      <select
        className="tag-select"
        value={book.category || "其他"}
        onChange={(e) =>
          onChange("category", e.target.value)
        }
      >
        <option value="文學小說">文學小說</option>
        <option value="漫畫">漫畫</option>
        <option value="輕小說">輕小說</option>
        <option value="其他">其他</option>
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