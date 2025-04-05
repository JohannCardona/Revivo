import axios from "axios";

export const dynamic_mood_tracking = (conversations) => {
  if (
    conversations.length === 2 &&
    conversations[1].response !== "" &&
    localStorage.getItem("mood")
  ) {
    const mood_tracking = {
      user: localStorage.getItem("user"),
      mood:
        localStorage.getItem("mood").charAt(0).toUpperCase() +
        localStorage.getItem("mood").slice(1),
      userNote: localStorage.getItem("user_message"),
      timestamp: new Date().toISOString(),
    };
    axios.post(`http://localhost:5000/store_user_moods`, mood_tracking, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
};
