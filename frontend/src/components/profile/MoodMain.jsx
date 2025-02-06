import React from "react";
import MoodGraph from "../profile/MoodGraph";
import MoodTracker from "./MoodTracker";
import axios from "axios";
import "../../styles/mood/mood.css";

function MoodMain() {
  const storeUserMoods = async (userMoods) => {
    axios.post("http://localhost:5000/store_user_moods", userMoods);
  };

  return (
    <div
      className="mood-container"
    >
      <h1 id="mood_tracker">Mood Tracker</h1>
      <MoodTracker addUserMood={storeUserMoods} />
      <MoodGraph />
    </div>
  );
}

export default MoodMain;
