import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import AddBook from "./pages/AddBook";
import Search from "./pages/Search";
import Collections from "./pages/Collections";
import Settings from "./pages/Setting";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header>
          <h1>我的書籍紀錄網站</h1>

          <nav>
            <Link to="/">首頁</Link> |{" "}
            <Link to="/add">新增書籍</Link> |{" "}
            <Link to="/search">搜尋</Link> |{" "}
            <Link to="/collections">我的收藏</Link> |{" "}
            <Link to="/setting">設定</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddBook />} />
            <Route path="/search" element={<Search />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}