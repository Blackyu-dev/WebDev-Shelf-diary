
import './BookModalDesc.css';
export default function BookModalDesc({ states, setters }) {
    return (
        <div className="modal-body-right">
            <hr className="modal-divider" />

            {states.isEditingDesc || states.description.trim() === "" ? (
                <textarea
                    className="modal-description"
                    value={states.description}
                    autoFocus
                    placeholder="輸入書籍簡介..."
                    onChange={(e) => setters.setDescription(e.target.value)}
                    onBlur={() => setters.setIsEditingDesc(false)}
                />
            ) : (
                <p
                    className="modal-description"
                    onClick={() => setters.setIsEditingDesc(true)}
                    style={{ cursor: "pointer" }}
                >
                    {states.description || "暫無簡介（點擊編輯）"}
                </p>
            )}
        </div>
    );
}