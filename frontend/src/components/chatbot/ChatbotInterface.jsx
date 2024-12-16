import React, { useState, useRef, useEffect } from "react";
import { Button, Tooltip } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Comment } from "react-loader-spinner";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import AddIcon from "@mui/icons-material/Add";
import chaticon from "../../images/chatbot.svg";
import MenuIcon from "@mui/icons-material/Menu";
import "../../styles/chatbot/ChatbotInterface.css";

function ChatbotInterface() {
  const [prompt, setPrompt] = useState("");
  const [close, setClose] = useState(false);
  const [conversations, setConversations] = useState([]);
  const conversationRef = useRef(null);
  const previousMessageRef = useState(null);
  const chatbotTypingSpeed = 10;
  const [loadingChatbotResponse, setLoadingChatbotResponse] = useState(false);

  const time = new Date().getHours();
  let day_time = "";
  if (time >= 5 && time < 12) {
    day_time = "morning";
  } else if (time >= 12 && time < 17) {
    day_time = "afternoon";
  } else if (time > 17 && time < 21) {
    day_time = "evening";
  } else {
    day_time = "night";
  }

  const chatbotTypingResponse = (word, chatbotRepsonse) => {
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

  const generateChatbotResponseId = () => {
    const time = Date.now();
    const randNum = Math.random();
    const responseString = randNum.toString(8);
    return `id-${time}-${responseString}`;
  };

  const conversationList = (chatbot, response, responseId) => {
    return {
      id: responseId,
      chatbot,
      response,
    };
  };

  const handleConversationSubmit = async (e) => {
    e.preventDefault();

    if (prompt.trim() === "") return;

    const userResponse = conversationList(false, prompt);
    setConversations((prevConversations) => [
      ...prevConversations,
      userResponse,
    ]);
    setPrompt("");

    const chatbotResponseId = generateChatbotResponseId();
    const chatbotResponse = conversationList(true, " ", chatbotResponseId);
    setConversations((prevConversations) => [
      ...prevConversations,
      chatbotResponse,
    ]);
    setLoadingChatbotResponse(true);

    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }

    previousMessageRef.current = chatbotResponseId;

    setTimeout(() => {
      setLoadingChatbotResponse(false);
      const chatbotDummyResponse =
        "Hello, I am ChatGPT, an AI language model developed by OpenAI. Let's bring your creativity to life.";
      const conversation = document.getElementById(chatbotResponseId);
      if (conversation) {
        chatbotTypingResponse(conversation, chatbotDummyResponse);
      }
    }, 1000);
  };

  useEffect(() => {
    if (loadingChatbotResponse && previousMessageRef.current) {
      const response = document.getElementById(previousMessageRef.current);
      if (response) {
      }
    }
  }, [loadingChatbotResponse, conversations]);

  return (
    <div className="chatbot-container">
      <aside className={`sidemenu ${close ? "close" : "open"}`}>
        {!close ? (
          <>
            <div className="new-chatbot-container">
              <div className="sidemenu-button">
                <span>
                  <AddIcon style={{ fontSize: "1.1rem" }} />
                </span>
                New chat
              </div>
              <span className="close-button">
                <Tooltip title="Close sidebar">
                  <MenuIcon
                    style={{ fontSize: "1.5rem" }}
                    onClick={() => setClose(true)}
                  />
                </Tooltip>
              </span>
            </div>
            <div className="divider"></div>
            <div className="chat-history">
              <div className="sidemenu-chat">Eleccion de Opciones SPY</div>
              <div className="sidemenu-chat">Inversion SPY hoy</div>
              <div className="sidemenu-chat">Iron Man Thanos Moon</div>
              {/* <div className="sidemenu-chat">CSS Flexbox Column Layout</div> */}
              {/* <div className="sidemenu-chat">Centering Text in Grid</div> */}
              {/* <div className="sidemenu-chat">
                Retrieve Specific MongoDB Field
              </div> */}
              {/* <div className="sidemenu-chat">Track User Logins Flask</div> */}
              {/* <div className="sidemenu-chat">Apologizing in Emails</div> */}
              <div className="sidemenu-chat">Function Output Differences</div>
              <div className="sidemenu-chat">Vector Element Modification</div>
              <div className="sidemenu-chat">Vector Processing in Python</div>
              <div className="sidemenu-chat">Plotting Data in R</div>
            </div>
          </>
        ) : (
          <span className="open-button">
            <Tooltip title="Open sidebar">
              <MenuIcon
                style={{ fontSize: "1.5rem" }}
                onClick={() => setClose(false)}
              />
            </Tooltip>
          </span>
        )}
      </aside>
      <div className="chatbot-ui-container">
        <div ref={previousMessageRef} className="conversations item-1">
          {conversations.length === 0 ? (
            <>
              <div className="no-conversations">
                <p>Good {day_time}, Johann</p>
                <img src={chaticon} alt="chat icon" />
                <iframe
                  title="song embedding"
                  src="https://open.spotify.com/embed/track/6WatFBLVB0x077xWeoVc2k"
                  width="40%"
                  height="100%"
                  frameborder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                ></iframe>
              </div>
            </>
          ) : (
            conversations.map((conversation, index) => (
              <div
                key={index}
                className={`wrapper ${
                  conversation.chatbot ? "chatbot" : "user"
                }`}
              >
                <div className="conversations" id={conversation.id}>
                  {conversation.chatbot &&
                  loadingChatbotResponse &&
                  conversation.id === previousMessageRef.current ? (
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
                  ) : (
                    conversation.message
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="conversations item-2">
          <div className="user-item user-text-container">
            <textarea
              rows="1"
              placeholder="Message Revivo bot"
              className="text-box"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="mic">
              <Tooltip title="Record your voice">
                <Button
                  style={{
                    backgroundColor: "rgb(80, 160, 129)",
                    marginRight: 6,
                    marginLeft: -4,
                    paddingRight: 3,
                  }}
                  variant="contained"
                  startIcon={<MicRoundedIcon />}
                ></Button>
              </Tooltip>
            </div>
          </div>
          <div className="user-item">
            <Button
              style={{ backgroundColor: "rgb(80, 160, 129)" }}
              variant="contained"
              endIcon={<SendRoundedIcon />}
              onClick={handleConversationSubmit}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotInterface;
