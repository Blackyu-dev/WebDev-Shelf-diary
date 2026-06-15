// src/data/booksStorage.js

const STORAGE_KEY = "books";

// 取得所有書
export function getBooks() {
  // 統一使用 STORAGE_KEY
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 新增書
export function addBook(book) {
  const books = getBooks();
  books.push(book);

  // 統一使用 STORAGE_KEY
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// 刪除書
export function deleteBook(id) {
  const books = getBooks();
  const newBooks = books.filter((book) => book.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
}

// 更新書
export function updateBook(updatedBook) {
  const books = getBooks();
  const newBooks = books.map((book) =>
    book.id === updatedBook.id ? updatedBook : book
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
}