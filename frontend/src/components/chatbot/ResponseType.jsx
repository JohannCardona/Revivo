import axios from "axios";
const chatbotTypingSpeed = 10;

const fetch_chatbot_response = async (prompt) => {
  const res = await axios.post(
    `http://localhost:5000/chat`,
    { prompt },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res;
};

export const handleChatbotResponse = async (prompt) => {
  const response = await fetch_chatbot_response(prompt);
  return response.data.result;
};

export const chatbotTypingResponse = (word, chatbotRepsonse) => {
  let index = 0;
  const chatbotResponseInterval = setInterval(() => {
    if (index < chatbotRepsonse.length) {
      word.innerHTML += chatbotRepsonse.charAt(index);
      index++;
    } else {
      clearInterval(chatbotResponseInterval);
    }
  }, chatbotTypingSpeed);
};

export const generateChatbotResponseId = () => {
  const time = Date.now();
  const randNum = Math.random();
  const responseString = randNum.toString(8);
  return `id-${time}-${responseString}`;
};

export const conversationList = (chatbot, response, responseId) => {
  return {
    id: responseId,
    chatbot: chatbot,
    response: response,
  };
};
