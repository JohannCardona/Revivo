import React, { useState } from "react";
import "../../styles/dashboard/tracker.css";
import Swal from "sweetalert2";

const MoodTracker = ({ addUserMood }) => {
  const [mood, setMood] = useState("");
  const [userNote, setUserNote] = useState("");
  const handleMoodSelection = (selectedMood) => {
    setMood(selectedMood);
  };
  const fireAlert = (response, type, color) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    });
  };
  const handleMoodSubmit = (e) => {
    e.preventDefault();
    if (!mood) {
      fireAlert("Please choose a mood.", "error", "red");
      return;
    }
    addUserMood({
      mood,
      userNote,
      timestamp: new Date().toISOString(),
    });
    setMood("");
    setUserNote("");
  };
  const moodEmojis = [
    { emoji: "😄", label: "Joy" },
    { emoji: "🥰", label: "Love" },
    { emoji: "😮", label: "Surprise" },
    { emoji: "😨", label: "Fear" },
    { emoji: "😡", label: "Anger" },
    { emoji: "😔", label: "Sadness" },
  ];

  return (
    <div className="emotion-container">
      <div>
        <h3>How are you feeling?</h3>
        <div className="emotion-buttons-section">
          {moodEmojis.map((emoji) => (
            <input
              key={emoji.label}
              type="button"
              className={`mood-emoji-button ${
                mood === emoji.label ? "selected" : ""
              } `}
              value={emoji.emoji}
              title={emoji.label}
              onClick={() => handleMoodSelection(emoji.label)}
            />
          ))}
        </div>
      </div>
      <label className="notes-section" htmlFor="user-notes">
        <input
          type="text"
          value={userNote}
          name="user-notes"
          id="user-notes"
          placeholder="Optional notes..."
          onChange={(e) => setUserNote(e.target.value)}
        />
      </label>
      <button type="submit" className="mood-submit" onClick={handleMoodSubmit}>
        Insert Mood
      </button>
    </div>
  );
};

export default MoodTracker;
