
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

// ISBN 爬蟲解析
export const fetchBookByISBN = async (isbn) => {
    const response = await fetch(`/isbn-api/${isbn}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const title = doc.querySelector("h1")?.innerText?.trim();
    if (!title) throw new Error("找不到這本書，請改用書名或手動輸入");

    let author = "", publisher = "", publishDate = "", publishPlace = "";
    let language = "", version = "", binding = "", grade = "", isbnValue = isbn;

    const dts = doc.querySelectorAll("dt");
    if (dts.length === 0) throw new Error("找不到這本書，請改用書名或手動輸入");

    dts.forEach((dt) => {
        const key = dt.innerText.trim();
        const value = dt.nextElementSibling?.innerText?.trim() || "";
        switch (key) {
            case "作者": author = value; break;
            case "出版社": publisher = value; break;
            case "出版日期": publishDate = value; break;
            case "出版地": publishPlace = value; break;
            case "語言": language = value; break;
            case "版本": version = value; break;
            case "裝訂": binding = value; break;
            case "分級": grade = value; break;
            case "ISBN": isbnValue = value; break;
        }
    });

    let description = "";
    const introHeaders = doc.querySelectorAll(".card-header");
    introHeaders.forEach((header) => {
        if (header.innerText.trim() === "簡介") {
            const body = header.nextElementSibling;
            if (!body) return;
            const paragraphs = body.querySelectorAll("p");
            let texts = [];
            paragraphs.forEach((p) => {
                const text = p.innerText?.replace(/\s+/g, " ").trim();
                if (text) texts.push(text);
            });
            description = texts.join("\n\n");
        }
    });

    return {
        id: Date.now(),
        title, author, publisher, publishDate, publishPlace,
        language, version, binding, grade, isbn: isbnValue,
        coverImage: `https://isbn.tw/${isbn}.jpg`,
        description, category: "未分類", serialStatus: "連載中",
        status: "未讀", source: "未知",
    };
};

// Google API 搜尋
export const fetchBooksByGoogle = async (keyword) => {
    const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${keyword}&key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.items) throw new Error("找不到相關書籍，請改用ISBN或手動輸入");

    return data.items.map((item) => {
        const info = item.volumeInfo;
        return {
            id: item.id,
            title: info.title || "未知書名",
            author: info.authors?.join(", ") || "未知作者",
            publisher: info.publisher || "",
            publishDate: info.publishedDate || "",
            language: info.language || "",
            version: "", binding: "", grade: "",
            isbn: info.industryIdentifiers?.[0]?.identifier || "",
            coverImage: info.imageLinks?.thumbnail || "",
            description: info.description || "",
            category: "未分類", serialStatus: "連載中",
            status: "未讀", source: "未知",
        };
    });
};