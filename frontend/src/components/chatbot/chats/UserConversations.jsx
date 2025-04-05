import axios from "axios";

export const fetch_conversation_title = async (
  prompt,
  setConversationTitle
) => {
  await axios
    .post(
      "http://localhost:5000/fetch_conversation_title/",
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((response) => {
      setConversationTitle(response.data.result);
    });
};

export const store_user_conversations = async (
  conversations,
  isNewChat,
  conversationTitle,
  setConversations
) => {
  const user = localStorage.getItem("user");
  if (conversations.length !== 0) {
    if (
      localStorage.getItem("user_message").includes("bye") ||
      localStorage.getItem("user_message").includes("exit") ||
      localStorage.getItem("user_message").includes("bye bye") ||
      localStorage.getItem("user_message").includes("goodbye") ||
      localStorage.getItem("user_message").includes("see you") ||
      localStorage.getItem("user_message").includes("see ya") ||
      localStorage.getItem("user_message").includes("end") ||
      isNewChat === true
    ) {
      console.log("store conversations");
      await axios
        .post("http://localhost:5000/conversations", {
          user,
          conversationTitle,
          conversations,
        })
        .then((response) => {
          if (response.status === 200) {
            localStorage.removeItem("user_message");
            setConversations("");
          }
        });
    } else {
    }
  }
};

export const fetch_conversation_titles = async (setConversationTitles) => {
  await axios
    .get(`http://localhost:5000/fetch_conversation_titles/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        setConversationTitles(response.data.titles);
      }
    });
};
