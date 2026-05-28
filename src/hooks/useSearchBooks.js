import { useState } from "react";
import { getBooks } from "../data/booksStorage";

export default function useSearchBooks() {
    const [books, setBooks] = useState(getBooks());
    const [searchTerm, setSearchTerm] = useState("");

    // 把抓資料的邏輯獨立成一個可以被重複呼叫的函式
    const fetchBooks = () => {
        const allBooks = getBooks();
        setBooks(allBooks);
    };


    const filteredBooks = books.filter((book) => {
        const t = searchTerm.toLowerCase();
        return (
            book.title?.toLowerCase().includes(t) ||
            book.author?.toLowerCase().includes(t)
        );
    });

    return {
        searchTerm,
        setSearchTerm,
        filteredBooks,
        refreshBooks: fetchBooks,
        totalBooks: books.length

    };
}