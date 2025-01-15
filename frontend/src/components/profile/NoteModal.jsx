import React from "react";
import "../../styles/dashboard/noteModal.css";

function NoteModal({ selectUserNote, setOpenModal }) {
  return (
    <div>
      <div className="note-modal-container">
        <div className="inner-note-modal-container">
          <h2>Mood Note</h2>
          <p>{selectUserNote}</p>
          <button
            className="registerlogin-btn"
            onClick={() => setOpenModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
