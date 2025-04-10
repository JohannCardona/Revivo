import axios from "axios";
import { Comment } from "react-loader-spinner";
const chatbotTypingSpeed = 10;

// Main function to get the chatbot message from the fine-tuned LLM/callback to CHATGPT API
export const fetch_chatbot_response = (prompt) => {
  return axios.post(
    `http://localhost:5000/chat`,
    { prompt },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

// Simulate the chatbot typing the message like the LLMs
export const chatbotTypingResponse = (word, chatbotResponse) => {
  let index = 0;
  // Get the message length and display each word from the message in a sequence until it reaches the end
  const chatbotResponseInterval = setInterval(() => {
    if (index < chatbotResponse.length) {
      word.innerHTML += chatbotResponse.charAt(index);
      index++;
    } else {
      clearInterval(chatbotResponseInterval);
    }
    // Speed value for displaying the message
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

// day_time - dynamic value depending on the time of day
// Used in empty chat interface
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

export const get_chosen_number = (
  setConversations,
  botMessageIndex,
  chatbotDummyResponse,
  chatbotResponseId
) => {
  // Store selected number message about music genre or song selections
  setConversations((prev) => {
    const currentMessage = [...prev];
    currentMessage[botMessageIndex].response = chatbotDummyResponse;
    return currentMessage;
  });
  // Display it on the screen
  setTimeout(() => {
    const element = document.getElementById(chatbotResponseId);
    if (element) {
      chatbotTypingResponse(element, chatbotDummyResponse);
    } else {
    }
  }, 0);
};

export const chatbot_response = async (
  setConversations,
  message,
  botMessageIndex,
  chatbotResponseId
) => {
  // Call to model in backend
  const chatbot_response = await fetch_chatbot_response(message);
  // Extract the response from the object
  const response = chatbot_response.data.result;
  // Store the message on the conversations array
  setConversations((prev) => {
    const currentMessage = [...prev];
    currentMessage[botMessageIndex].response = response;
    return currentMessage;
  });
  // Display it on the screen
  setTimeout(() => {
    const element = document.getElementById(chatbotResponseId);
    if (element) {
      chatbotTypingResponse(element, response);
    } else {
    }
  }, 0);
};

export const get_dynamic_chatbot_response = (
  setConversations,
  botMessageIndex,
  chatbotResponseId,
  setDynamicChoice
) => {
  // Message based on random chance (>0.7)
  const dynamicChoiceMessage =
    `Would you like some music suggestions or an artistic image to help you relax? \n` +
    `Please type "music" for music suggestions or "image" for an artistic image.`;
  // Store the message in the conversations array
  setConversations((prev) => {
    const currentMessage = [...prev];
    currentMessage[botMessageIndex].response = dynamicChoiceMessage;
    return currentMessage;
  });
  // Display message on the screen
  setTimeout(() => {
    const element = document.getElementById(chatbotResponseId);
    if (element) {
      chatbotTypingResponse(element, dynamicChoiceMessage);
    } else {
    }
  }, 0);
  setDynamicChoice(true);
};

// Loading spinner object
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
