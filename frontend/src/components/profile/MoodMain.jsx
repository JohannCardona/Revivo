import React, { useState, useEffect } from "react";
import MoodGraph from "../profile/MoodGraph";
import MoodTracker from "./MoodTracker";
import axios from "axios";

function MoodMain() {
  const [userMoods, setUserMoods] = useState([]);

  const storeUserMoods = async (userMoods) => {
    axios.post("http://localhost:5000/store_user_moods", userMoods);
  };

  return (
    <div>
      <h2>Mood Tracker</h2>
      <MoodTracker addUserMood={storeUserMoods} />
      <MoodGraph />
    </div>
  );
}

export default MoodMain;
