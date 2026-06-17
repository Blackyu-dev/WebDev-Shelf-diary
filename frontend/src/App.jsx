import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import "./App.css";

import Home from "./pages/Home";
import AddBook from "./pages/AddBook";
import Settings from "./pages/Setting";
import Icon1Img from './assets/home.png';
import Icon2Img from './assets/plus.png';
import Icon4Img from './assets/heart.png';
import Icon5Img from './assets/settings.png';

export default function App() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { path: "/", icon: Icon1Img, label: "首頁" },
    { path: "/add", icon: Icon2Img, label: "新增" },
    { path: "/settings", icon: Icon5Img, label: "設定" },
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
                <img src={item.icon} alt={item.label} className="icon" />
                {isOpen && <span className="label">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 主內容 */}
        <div className="main-content">
          {/* <header className="topbar">
            <h1>我的書籍紀錄網站</h1>
          </header> */}

          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<AddBook />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}