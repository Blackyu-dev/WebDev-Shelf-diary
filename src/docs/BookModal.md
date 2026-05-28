TODO:
- 設定如果作者、出版社等等那些沒填都預設未知
- 手動加入CSS要調(太高)
- 手動加入的書本詳細資料我沒有開放 Input 可能要新增一下
- 手動加入的書本img功能還沒做
- 如有重複加入的書本要跳出警告訊息




架構圖
BookModal（彈窗）
│
├── modal-overlay（背景遮罩）
│
└── modal-content（主要視窗）
    │
    ├── modal-header（標題列）
    │   ├── 書名 book.title
    │   └── 關閉按鈕 ×
    │
    └── modal-main-layout（左右分欄）
        │
        ├── 左側 modal-body-left（基本資訊）
        │   │
        │   ├── 圖片區 modal-image-container
        │   │   └── 書封面 book.cover
        │   │
        │   ├── info 區 modal-info
        │   │   ├── 作者 author
        │   │   ├── 出版社 publisher
        │   │   ├── 出版日期 publishDate
        │   │   ├── 出版地 publishPlace
        │   │   ├── 語言 language
        │   │   ├── 版本 version
        │   │   ├── 裝訂 binding
        │   │   ├── 分級 grade
        │   │   ├── ISBN isbn
        │   │   │
        │   │   ├── tag-container
        │   │   │   ├── status-tag（已讀 / 閱讀中）
        │   │   │   └── source-tag（來源）
        │   │   │
        │   │   └── expand-btn（展開詳細資料）
        │
        └── 右側 modal-body-right（條件顯示）
            │
            ├── modal-divider（分隔線）
            └── modal-description（書籍簡介）
                （只有 isExpanded = true 才顯示）