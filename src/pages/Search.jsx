import { useState } from "react";
import { getBooks } from "../data/booksStorage";
import Card from "../components/Card";
import BookModal from "../components/BookModal";

const Search = () => {
    const [booksData] = useState(getBooks());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredBooks = booksData.filter((book) => {
        const t = searchTerm.toLowerCase();
        return (
            book.title?.toLowerCase().includes(t) ||
            book.author?.toLowerCase().includes(t)
        );
    });

    return (
        <div className="search-page">

            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜尋書名或作者..."
            />

            {filteredBooks.map((book) => (
                <Card
                    key={book.id}
                    book={book}
                    onClick={() => {
                        setSelectedBook(book);
                        setIsModalOpen(true);
                    }}
                />
            ))}

            {selectedBook && (
                <BookModal
                    book={selectedBook}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Search;