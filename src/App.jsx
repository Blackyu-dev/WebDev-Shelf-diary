import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import "./App.css";

import Home from "./pages/Home";
import AddBook from "./pages/AddBook";
import Search from "./pages/Search";
import Collections from "./pages/Collections";
import Settings from "./pages/Setting";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { path: "/", icon: "🏠", label: "首頁" },
    { path: "/add", icon: "➕", label: "新增書籍" },
    { path: "/search", icon: "🔍", label: "搜尋" },
    { path: "/collections", icon: "📚", label: "我的收藏" },
    { path: "/settings", icon: "⚙️", label: "設定" },
  ];

  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* 側邊欄 */}
        <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <button
              className="toggle-btn"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "☰" : "☰"}
            </button>

            {isOpen && <h2>書籍網站</h2>}
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} className="nav-item">
                <span className="icon">{item.icon}</span>

                {isOpen && <span className="label">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 主內容 */}
        <div className="main-content">
          <header className="topbar">
            <h1>我的書籍紀錄網站</h1>
          </header>

          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<AddBook />} />
              <Route path="/search" element={<Search />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}