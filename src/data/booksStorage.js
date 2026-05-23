// src/data/booksStorage.js

const STORAGE_KEY = "books";

// 取得所有書
export function getBooks() {
  const data = localStorage.getItem("books");

  return data ? JSON.parse(data) : [];
}

export function addBook(book) {
  const books = getBooks();

  books.push(book);

  localStorage.setItem(
    "books",
    JSON.stringify(books)
  );
}

// 刪除書
export function deleteBook(id) {
  const books = getBooks();

  const newBooks = books.filter(
    (book) => book.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(newBooks)
  );
}

// 更新書
export function updateBook(updatedBook) {
  const books = getBooks();

  const newBooks = books.map((book) =>
    book.id === updatedBook.id
      ? updatedBook
      : book
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(newBooks)
  );
}