TODO:
- 新增防呆機制 -> 當詳細資訊 panel 關掉跳出是否儲存提示框

components/
│
├── BookDetailPanel.jsx
│
├── panels/
│   ├── BookInfoCard.jsx (管理書籍基本資訊和評分)
│   ├── BookTagCard.jsx  (管理書籍的閱讀狀態、來源、分類、連載狀態等標籤)
│   ├── BookDescriptionCard.jsx  (顯示書籍簡介)
│   ├── BookNoteCard.jsx  (管理書籍備註)
│   └── BookSeriesCard.jsx  (管理系列書相關資訊，如是否為系列書、系列名稱、系列順序等)