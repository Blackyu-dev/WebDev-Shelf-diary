# Shelf Diary - 個人藏書管理系統

## 一、專案簡介

本專案是一個使用 React、Express 與 MongoDB 打造的「個人化書櫃管理系統」。使用者可以輕鬆記錄自己的閱讀狀態、書籍來源與分類。系統最大的特色在於整合了 Google Books API 與 ISBN 查詢，讓使用者能一鍵快速匯入書籍詳細資訊，大幅減少手動輸入的時間。同時具備完整的個人備註與評分功能，打造專屬於使用者的閱讀日記。

## 二、使用技術

* **前端:** React, Vite, 原生 CSS
* **後端:** Node.js, Express, cors
* **資料庫:** MongoDB, Mongoose
* **外部資源:** Google Books API, ISBN API

## 三、主要功能與特色

* **基礎核心功能 (CRUD):** 支援書籍的讀取 (GET)、新增 (POST)、更新 (PUT) 與刪除 (DELETE)。
* **特色功能 1：智慧書籍資料匯入 (外部 API 串接)**
  * 支援透過輸入 ISBN 碼，自動爬取書籍詳細資訊。
  * 支援透過 Google Books API 進行書名關鍵字搜尋，一鍵帶入封面、作者、出版社等欄位。
* **特色功能 2：多維度動態篩選與管理**
  * 支援以「閱讀狀態」、「書籍來源」、「類型」、「連載狀態」等多重條件進行交叉篩選。
  * 提供自訂「來源」與「分類」的擴充功能，不受限於預設選項。
* **特色功能 3：個人化閱讀日記**
  * 內建 1~5 星評分系統。
  * 每本書皆擁有獨立的「備註」功能，並會自動記錄最後更新時間，方便追蹤閱讀進度與心得。
* **特色功能 4：我的收藏**
  * 提供「愛心收藏」功能，可將特別喜歡的書籍獨立集中至收藏頁面快速瀏覽。

## 四、後端執行方式

cd backend

npm install multer

npm install

npm run dev

## 五、前端執行方式

cd frontend

npm install

npm run dev

## 六、環境變數設定方式

### 後端環境

在 backend 資料夾下建立 .env 檔案，參考 .env.example 填入連線資訊

### 前端

因為有使用 Google Books API Key，也需在 frontend 資料夾設置對應的 .env 同樣參考.env.example

## 七、API 路由表

| Method           | Path               | 功能說明                                       |
| :--------------- | :----------------- | :--------------------------------------------- |
| **GET**    | `/api/books`     | 取得書櫃中所有書籍資料                         |
| **POST**   | `/api/books`     | 新增一筆書籍資料                               |
| **PUT**    | `/api/books/:id` | 更新特定書籍資料（含狀態、備註、評分、收藏等） |
| **DELETE** | `/api/books/:id` | 將特定書籍從書櫃中移除                         |

## 八、MongoDB Schema 說明

| 欄位名稱           | 型態    | 預設值    | 說明                                       |
| ------------------ | ------- | --------- | ------------------------------------------ |
| `title`          | String  | 無 (必填) | 書名                                       |
| `author`         | String  | 無 (必填) | 作者                                       |
| `status`         | String  | 未讀      | 閱讀狀態 (特色欄位：未讀/想讀/閱讀中/已讀) |
| `source`         | String  | 未知      | 購買/借閱來源 (特色欄位：可自訂)           |
| `category`       | String  | 未分類    | 書籍分類 (特色欄位：可自訂)                |
| `serialStatus`   | String  | 連載中    | 連載狀態 (連載中/已完結)                   |
| `publisher`      | String  | 空字串    | 出版社                                     |
| `publishDate`    | String  | 空字串    | 出版日期                                   |
| `publishPlace`   | String  | 空字串    | 出版地點                                   |
| `isbn`           | String  | 空字串    | 國際標準書號                               |
| `coverImage`     | String  | 空字串    | 封面圖片 URL                               |
| `description`    | String  | 空字串    | 書籍簡介                                   |
| `favorite`       | Boolean | false     | 是否加入我的收藏                           |
| `language`       | String  | 未知      | 語言 (例如：繁體中文、日文)                |
| `version`        | String  | 未知      | 版本 (例如：初版、二版)                    |
| `binding`        | String  | 未知      | 裝訂 (例如：平裝、精裝)                    |
| `grade`          | String  | 未知      | 分級 (例如：普通級、限制級)                |
| `rating`         | Number  | 0         | 星號評分 (0 ~ 5 分)                        |
| `note.text`      | String  | 空字串    | 個人閱讀備註內容                           |
| `note.updatedAt` | String  | 空字串    | 備註最後更新時間                           |

## 九、系統截圖

## 十、組員分工

* CBE111031　：
* CBE111033　：

## 十一、學習心得
