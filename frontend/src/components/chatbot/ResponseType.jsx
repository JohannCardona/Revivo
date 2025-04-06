import axios from "axios";
import { Comment } from "react-loader-spinner";
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

const time = new Date().getHours();
export let day_time = "";
if (time >= 5 && time < 12) {
  day_time = "morning";
} else if (time >= 12 && time < 17) {
  day_time = "afternoon";
} else if (time >= 17 && time < 21) {
  day_time = "evening";
} else {
  day_time = "night";
}

export const loading_message = () => {
  return (
    <Comment
      visible={true}
      height="40"
      width="40"
      ariaLabel="comment-loading"
      wrapperStyle={{}}
      wrapperClass="comment-wrapper"
      color="#fff"
      backgroundColor="#50a081"
    />
  );
};
