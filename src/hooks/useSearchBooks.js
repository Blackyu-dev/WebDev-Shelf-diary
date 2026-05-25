import { useState } from "react";
import { getBooks } from "../data/booksStorage";

export default function useSearchBooks() {
    const [books] = useState(getBooks());
    const [searchTerm, setSearchTerm] = useState("");

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
        filteredBooks
    };
}