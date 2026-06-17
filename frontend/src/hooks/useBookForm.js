import { useState } from 'react';
import { saveBookApi } from '../api/bookApi';

export function useBookForm(book, onClose) {
    // ================= 狀態區 =================
    const [isExpanded, setIsExpanded] = useState(true);
    const [status, setStatus] = useState(book?.status || "未讀");
    const [serialStatus, setSerialStatus] = useState(book?.serialStatus || "未連載");

    const defaultSources = ["博客來", "讀墨", "Play圖書", "誠品", "Hyread", "Kobo", "BOOKWALKER", "其他"];
    const initSources = book?.source && !defaultSources.includes(book.source)
        ? [book.source, ...defaultSources]
        : defaultSources;
    const [sourceOptions, setSourceOptions] = useState(initSources);
    const [source, setSource] = useState(book?.source || "博客來");

    const defaultCategories = ["文學小說", "漫畫", "輕小說", "技術/學習", "雜誌", "其他"];
    const initCategories = book?.category && !defaultCategories.includes(book.category)
        ? [book.category, ...defaultCategories]
        : defaultCategories;
    const [categoryOptions, setCategoryOptions] = useState(initCategories);
    const [category, setCategory] = useState(book?.category || "文學小說");

    const [customSource, setCustomSource] = useState("");
    const [customCategory, setCustomCategory] = useState("");

    const [coverFile, setCoverFile] = useState(null);

    // 處理圖片 URL 邏輯
    const getCoverUrl = (url) => {
        if (!url) return "https://placehold.co/300x450?text=No+Image";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        return `http://localhost:3000${url}`;
    };
    const previewUrl = coverFile ? URL.createObjectURL(coverFile) : getCoverUrl(book?.coverImage);


    // 基本欄位
    const [title, setTitle] = useState(book?.title || "");
    const [author, setAuthor] = useState(book?.author || "");
    const [publishDate, setPublishDate] = useState(book?.publishDate || "");
    const [publisher, setPublisher] = useState(book?.publisher || "");
    const [publishPlace, setPublishPlace] = useState(book?.publishPlace || "");
    const [language, setLanguage] = useState(book?.language || "");
    const [isbnState, setIsbnState] = useState(book?.isbn || "");
    const [version, setVersion] = useState(book?.version || "");
    const [binding, setBinding] = useState(book?.binding || "");
    const [grade, setGrade] = useState(book?.grade || "");
    const [description, setDescription] = useState(book?.description || "");
    const [isEditingDesc, setIsEditingDesc] = useState(false);

    // ================= 邏輯區 =================
    const handleConfirmSource = () => {
        if (customSource.trim() !== "") {
            if (!sourceOptions.includes(customSource)) {
                const newOpts = sourceOptions.filter(o => o !== "其他");
                setSourceOptions([...newOpts, customSource, "其他"]);
            }
            setSource(customSource);
        } else {
            setSource("博客來");
        }
        setCustomSource("");
    };

    // 來源確認：如果空白就設為預設值
    const handleConfirmCategory = () => {
        if (customCategory.trim() !== "") {
            if (!categoryOptions.includes(customCategory)) {
                const newOpts = categoryOptions.filter(o => o !== "其他");
                setCategoryOptions([...newOpts, customCategory, "其他"]);
            }
            setCategory(customCategory);
        } else {
            setCategory("文學小說");
        }
        setCustomCategory("");
    };

    const handleSave = async () => {
        const formData = new FormData();

        // 防呆邏輯：如果下拉選單是「其他」，而且輸入框有打字，就優先儲存輸入框的字
        const finalSource = source === "其他" && customSource.trim() !== ""
            ? customSource.trim()
            : (source?.trim() || "博客來");

        const finalCategory = category === "其他" && customCategory.trim() !== ""
            ? customCategory.trim()
            : (category?.trim() || "文學小說");

        // 將所有欄位資料打包到 formData 中，準備送給後端 API
        formData.append("title", title);
        formData.append("author", author);
        formData.append("publishDate", publishDate?.trim() || "出版日期");
        formData.append("publisher", publisher?.trim() || "出版社");
        formData.append("publishPlace", publishPlace?.trim() || "出版地");
        formData.append("language", language?.trim() || "語言");
        formData.append("isbn", isbnState?.trim() || "未知");
        formData.append("status", status?.trim() || "未讀");
        formData.append("source", finalSource);
        formData.append("category", finalCategory);
        formData.append("serialStatus", serialStatus);
        formData.append("version", version?.trim() || "初版");
        formData.append("binding", binding?.trim() || "平裝");
        formData.append("grade", grade?.trim() || "普通級");
        formData.append("description", description);

        if (coverFile) {
            formData.append("coverImage", coverFile);
        } else {
            formData.append("coverImage", book.coverImage || "");
        }

        try {
            // 發送 API 請求，根據是否有 book._id 來決定是新增還是更新
            await saveBookApi(book?._id, formData);
            alert(book?._id ? "更新成功！" : "新增成功！");
            onClose();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // 將所有需要的東西打包回傳
    return {
        states: {
            isExpanded, status, sourceOptions, source, categoryOptions, category,
            customSource, customCategory, previewUrl, title, author, publishDate,
            publisher, publishPlace, language, isbnState, version, binding, grade,
            description, isEditingDesc
        },
        setters: {
            setIsExpanded, setStatus, setSource, setCategory, setCustomSource,
            setCustomCategory, setCoverFile, setTitle, setAuthor, setPublishDate,
            setPublisher, setPublishPlace, setLanguage, setIsbnState, setVersion,
            setSerialStatus,
            setBinding, setGrade, setDescription, setIsEditingDesc
        },
        handlers: {
            handleConfirmSource, handleConfirmCategory, handleSave
        }
    };
}