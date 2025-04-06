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
  localStorage.setItem("mood", emotion.data[0]);
  return emotion.data[0];
};

export const dynamic_mood_tracking = (prompt, conversations) => {
  if (
    conversations.length === 2 &&
    conversations[1].response !== "" &&
    (prompt.includes("recommend song") ||
      prompt.includes("recommend songs") ||
      prompt.includes("recommend a song") ||
      prompt.includes("songs") ||
      prompt.includes("music") ||
      prompt.includes("another song") ||
      prompt.includes("other songs") ||
      prompt.includes("create") ||
      prompt.includes("generate") ||
      prompt.includes("image") ||
      prompt.includes("hello") ||
      prompt.includes("hi")) &&
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
