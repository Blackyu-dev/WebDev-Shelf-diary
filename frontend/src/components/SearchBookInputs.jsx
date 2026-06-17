
export default function SearchBookInputs({
    isbn, setIsbn, handleISBNImport,
    keyword, setKeyword, handleGoogleSearch,
    loading
}) {
    return (
        <div className="search-container">
            {/* ISBN 搜尋 */}
            <div className="isbn-section">
                <input
                    type="text"
                    placeholder="輸入 ISBN..."
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="isbn-input"
                />
                <button className="isbn-button" onClick={handleISBNImport}>
                    {loading ? "搜尋中..." : "ISBN 匯入"}
                </button>
            </div>

            {/* Google 書名搜尋 */}
            <div className="isbn-section">
                <input
                    type="text"
                    placeholder="輸入書名..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="isbn-input"
                />
                <button className="isbn-button" onClick={handleGoogleSearch}>
                    {loading ? "搜尋中..." : "書名搜尋"}
                </button>
            </div>
        </div>
    );
}