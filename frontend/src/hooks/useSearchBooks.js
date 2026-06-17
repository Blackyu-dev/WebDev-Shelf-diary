import { useState, useEffect, useCallback } from "react";
import { fetchBookByISBN, fetchBooksByGoogle } from "../api/searchBookApi";
// 原本地的 getBooks
// import { getBooks } from "../data/booksStorage";

export default function useSearchBooks() {

    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isbn, setIsbn] = useState("");
    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Modal 與選中書籍狀態
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleISBNImport = async () => {
        if (!isbn.trim()) return;
        const isbnDigits = isbn.replace(/-/g, "");
        if (isbnDigits.length !== 10 && isbnDigits.length !== 13) {
            setError("請輸入有效的 ISBN (10 或 13 碼)");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const bookData = await fetchBookByISBN(isbn);
            setSelectedBook(bookData);
            setIsModalOpen(true);
        } catch (err) {
            console.error(err);
            setError(err.message || "ISBN 匯入失敗");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSearch = async () => {
        if (!keyword.trim()) return;
        try {
            setLoading(true);
            setError("");
            const books = await fetchBooksByGoogle(keyword);
            setSearchResults(books);
        } catch (err) {
            console.error(err);
            setError(err.message || "找不到相關書籍，請改用ISBN或手動輸入");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedBook(null), 300);
    };

    // 提供手動新增空白書籍的功能
    const openManualAdd = () => {
        setSelectedBook({
            id: Date.now(), title: "", author: "", publisher: "", language: "",
            version: "", binding: "", grade: "", isbn: "", description: "",
            status: "未讀", source: "其他", category: "其他"
        });
        setIsModalOpen(true);
    };

    // 篩選條件
    const [selectedFilters, setSelectedFilters] = useState({
        status: [],       // 閱讀狀態
        source: [],       // 書籍來源
        category: [],     // 類型
        serialStatus: []  // 連載狀態
    });

    // 向 Express API 發送 GET 請求取得所有書籍
    const fetchBooks = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3000/api/books");
            if (response.ok) {
                const data = await response.json();
                setBooks(data);
            } else {
                console.error("無法取得書籍資料");
            }
        } catch (error) {
            console.error("伺服器連線錯誤:", error);
        }
    }, []);

    //  把 fetchBooks 放進依賴陣列中，滿足 Linter 的安全規範
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBooks();
    }, [fetchBooks]);

    const toggleFilter = (filterKey, option) => {
        setSelectedFilters(prev => {
            const currentSelected = prev[filterKey];
            const isSelected = currentSelected.includes(option);
            return {
                ...prev,
                [filterKey]: isSelected
                    ? currentSelected.filter(item => item !== option)
                    : [...currentSelected, option]
            };
        });
    };

    const getFilterStats = () => {
        const stats = { status: {}, source: {}, category: {}, serialStatus: {} };

        books.forEach(book => {
            if (book.status) stats.status[book.status] = (stats.status[book.status] || 0) + 1;
            if (book.source) stats.source[book.source] = (stats.source[book.source] || 0) + 1;
            if (book.category) stats.category[book.category] = (stats.category[book.category] || 0) + 1;
            if (book.serialStatus) stats.serialStatus[book.serialStatus] = (stats.serialStatus[book.serialStatus] || 0) + 1;
        });
        return stats;
    };

    const filterStats = getFilterStats();

    const filteredBooks = books.filter((book) => {
        const t = searchTerm.toLowerCase();
        const matchSearch = book.title?.toLowerCase().includes(t) || book.author?.toLowerCase().includes(t);
        const matchStatus = selectedFilters.status.length === 0 || selectedFilters.status.includes(book.status);
        const matchSource = selectedFilters.source.length === 0 || selectedFilters.source.includes(book.source);
        const matchCategory = selectedFilters.category.length === 0 || selectedFilters.category.includes(book.category);
        const matchSerialStatus = selectedFilters.serialStatus.length === 0 || selectedFilters.serialStatus.includes(book.serialStatus);

        return matchSearch && matchStatus && matchSource && matchCategory && matchSerialStatus;
    });

    return {
        searchTerm,
        setSearchTerm,
        filteredBooks,
        refreshBooks: fetchBooks,
        totalBooks: books.length,
        selectedFilters,
        toggleFilter,
        filterStats,
        isbn, setIsbn, keyword, setKeyword,
        searchResults, loading, error,
        selectedBook, setSelectedBook,
        isModalOpen, setIsModalOpen,
        handleISBNImport, handleGoogleSearch, handleCloseModal, openManualAdd
    };
}