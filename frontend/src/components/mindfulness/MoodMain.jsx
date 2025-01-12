import React, { useState, useEffect } from "react";
import MoodGraph from "./MoodGraph";
import MoodTracker from "./MoodTracker";

function MoodMain() {
  const [userMoods, setUserMoods] = useState([]);
  const addUserMood = (userMood) => {
    setUserMoods([...userMoods, userMood]);
  };
  useEffect(() => {
    localStorage.setItem("userMoods", JSON.stringify(userMoods));
  }, [userMoods]);
  useEffect(() => {
    const UserMoods = JSON.parse(localStorage.getItem("userMoods"));
    setUserMoods(UserMoods);
  }, []);

  console.log(userMoods);

  return (
    <div>
      <h2>Mood Tracker</h2>
      <MoodTracker addUserMood={addUserMood} />
      <MoodGraph data={userMoods} />
    </div>
  );
}

export default MoodMain;
