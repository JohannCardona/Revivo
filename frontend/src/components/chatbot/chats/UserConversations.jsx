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

export const error_message = (
  setLoadingChatbotResponse,
  setConversations,
  botMessageIndex,
  chatbotResponseId,
  chatbotTypingResponse
) => {
  setLoadingChatbotResponse(false);
  setConversations((prev) => {
    const currentMessage = [...prev];
    currentMessage[botMessageIndex].response = "Failed processing response";
    return currentMessage;
  });
  setTimeout(() => {
    const element = document.getElementById(chatbotResponseId);
    if (element) {
      chatbotTypingResponse(element, "Failed processing response");
    } else {
    }
  }, 0);
};
