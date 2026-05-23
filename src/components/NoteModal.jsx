import { useState } from "react";
import "./NoteModal.css";

export default function NoteModal({ onClose, onSave, notesHistory }) {
    const [text, setText] = useState("");

    const handleSave = () => {
        if (text.trim() === "") return;
        onSave(text);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="note-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="note-modal-header">
                    <h3>新增與歷史備註</h3>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                {/* 歷史備註列表區塊 */}
                <div className="notes-history-list">
                    {notesHistory.length > 0 ? (
                        notesHistory.map((note) => (
                            <div key={note.id} className="history-item">
                                <span className="history-date">{note.date}</span>
                                <p className="history-text">{note.text}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-history">尚無歷史備註</p>
                    )}
                </div>

                {/* 新增輸入區 */}
                <textarea
                    className="note-textarea"
                    placeholder="寫下您對這本書的想法..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                />

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>取消</button>
                    <button className="save-btn" onClick={handleSave}>儲存備註</button>
                </div>
            </div>
        </div>
    );
}