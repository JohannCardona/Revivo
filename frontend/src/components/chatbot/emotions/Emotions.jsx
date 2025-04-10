import axios from "axios";

export const fetch_emotion_from_text = async (prompt) => {
  const emotion = await axios.get(
    `http://localhost:5000/emotion_classifier/${prompt}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  // Extract emotion value from list and store in local storage
  localStorage.setItem("mood", emotion.data[0]);
  return emotion.data[0];
};
