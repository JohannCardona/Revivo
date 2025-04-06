import React from "react";
import MoodGraph from "../MoodTracker/MoodGraph";
import MoodTracker from "./MoodTracker";
import "../../styles/mood/mood.css";
import { storeUserMoods } from "./MoodAPI";

function MoodMain() {
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
