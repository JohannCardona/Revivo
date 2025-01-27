import React, { useState, useRef, useEffect } from "react";
import { Button, Tooltip } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Comment } from "react-loader-spinner";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import AddIcon from "@mui/icons-material/Add";
import chaticon from "../../images/chatbot.svg";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import "../../styles/chatbot/ChatbotInterface.css";
import Swal from "sweetalert2";
import axios from "axios";
import Banner from "../Banner/Banner";
import { IoCloudDownloadOutline } from "react-icons/io5";

function ChatbotInterface() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const [prompt, setPrompt] = useState("");
  const [listening, setListening] = useState(false);
  const [close, setClose] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isNewChat, setIsNewChat] = useState(false);
  const conversationRef = useRef(null);
  const previousMessageRef = useRef(null);
  const chatbotTypingSpeed = 30;
  const [loadingChatbotResponse, setLoadingChatbotResponse] = useState(false);
  const song_genres = ["latin", "happy", "calm", "rock", "pop"];
  const song_genre = "latino";
  const [recommended_songs, setRecommendedSongs] = useState([]);
  const [conversationTitle, setConversationTitle] = useState([]);
  const [mood, setMood] = useState("");

  useEffect(() => {
    if (recognition) {
      recognition.continues = false;
      recognition.lang = "en-US";
      recognition.interimResults = true;

      recognition.onStart = () => {
        setListening(true);
      };

      recognition.onEnd = () => {
        setListening(false);
      };

      recognition.onresult = (e) => {
        let completeText = "";
        let textParts = "";
        for (let i = 0; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            completeText = completeText + transcript;
          } else {
            textParts = textParts + transcript;
          }
        }
        setPrompt(completeText || textParts);
      };
    }
  }, []);

  const handleAudioScript = () => {
    if (recognition) {
      setPrompt("");
      recognition.start();
    } else {
      Swal.fire({
        title: "The web browser does support Web Speech API",
        confirmButtonText: "OK",
        confirmButtonColor: "#ff0055",
        icon: "error",
      }).then(() => {});
    }
  };

  const fetch_conversation_title = async (prompt) => {
    const response = await fetch(
      "http://localhost:5000/fetch_conversation_title/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      }
    );
    if (response.status === 200) {
    }
  };

  const store_user_conversations = async () => {
    if (conversations.length !== 0) {
      const exit_conversation = conversations.some((obj) =>
        obj.response.toLowerCase().includes("exit")
      );
      if (exit_conversation) {
        await axios
          .post("http://localhost:5000/conversations", conversations)
          .then((response) => {
            if (response.status === 200) {
            }
          });
      } else {
      }
    }
  };

  const recommend_songs = async () => {
    const response = await axios.get(
      `http://localhost:5000/music_recommendations/${song_genre}`
    );
    return await fetching_recommending_songs_response(response.data);
  };

  const generate_image = async () => {
    const response = await axios.post(
      `http://localhost:5000/image_generation`,
      { prompt }
    );
    const genImage = `data:image/jpeg;base64,${response.data[0].result}`;
    return genImage;
  };

  const [clickedImage, setClickedImage] = useState(null);
  const handleImageModal = (image) => {
    setClickedImage(image);
  };
  const modalClose = () => {
    setClickedImage(null);
  };

  const time = new Date().getHours();
  let day_time = "";
  if (time >= 5 && time < 12) {
    day_time = "morning";
  } else if (time >= 12 && time < 17) {
    day_time = "afternoon";
  } else if (time >= 17 && time < 21) {
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
      chatbot: chatbot,
      response: response,
    };
  };

  const fetching_recommending_songs_response = async (response) => {
    let song_list = "";
    if (response.length !== 0) {
      const promptStart =
        "Here are some song recommendations for you for " +
        song_genre +
        " genre:\n\n";
      const songs = response
        .map(
          (item, key) =>
            `${key + 1}.  Album: ${item.album}\n     Artist: ${
              item.artist
            }\n     Song: ${item.name}\n     Album date: ${item.albumDate}\n`
        )
        .join("\n\n");
      const promptEnd =
        "\n\nPlease let me know which one you would like to play by picking a number.";
      song_list = promptStart + songs + promptEnd;
    }
    return song_list;
  };

  const handleConversationSubmit = async () => {
    if (prompt.trim() === "") {
      fireAlert("Input a question before asking the chatbot.", "error", "red");
      setPrompt("");
      return;
    }
    const userResponse = conversationList(false, prompt);
    setConversations((prevConversations) => [
      ...prevConversations,
      userResponse,
    ]);
    localStorage.setItem("user_message", prompt);
    setPrompt("");

    const chatbotResponseId = generateChatbotResponseId();
    const chatbotResponse = conversationList(true, "", chatbotResponseId);
    setConversations((prevConversations) => [
      ...prevConversations,
      chatbotResponse,
    ]);
    setLoadingChatbotResponse(true);
    const botMessageIndex = conversations.length + 1;
    previousMessageRef.current = chatbotResponseId;

    const message = localStorage.getItem("user_message");
    // await fetch_emotion_from_text(message);

    const chatbotDummyResponse = await handleChatbotResponseType(message);
    // console.log(chatbotDummyResponse);

    try {
      if (chatbotDummyResponse) {
        setLoadingChatbotResponse(false);
        const conversationDiv = document.getElementById(chatbotResponseId);
        if (chatbotDummyResponse.includes("data:image")) {
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = chatbotDummyResponse;
            return currentMessage;
          });
        } 
        if (chatbotDummyResponse.includes("recommendations")) {
          chatbotTypingResponse(conversationDiv, chatbotDummyResponse);
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = chatbotDummyResponse;
            return currentMessage;
          });
        }
        // else if (conversationDiv) {
        //   chatbotTypingResponse(conversationDiv, chatbotDummyResponse);
        //   setConversations((prev) => {
        //     const currentMessage = [...prev];
        //     currentMessage[botMessageIndex].response = chatbotDummyResponse;
        //     return currentMessage;
        //   });
        // }
      }
    } catch (err) {
      setLoadingChatbotResponse(false);
      setConversations((prev) => {
        const currentMessage = [...prev];
        currentMessage[botMessageIndex].response = "Error";
        return currentMessage;
      });
    }
  };

  const fireAlert = (response, type, color) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    });
  };

  const fetch_emotion_from_text = async (prompt) => {
    await axios
      .get(`http://localhost:5000/emotion_classifier/${prompt}`)
      .then((response) => {
        setMood(response.data);
      });
  };

  const fetch_chatbot_response = async (prompt) => {
    const res = await axios.post(`http://localhost:5000/chat`, { prompt });
    return res;
  };

  const handleChatbotResponse = async () => {
    const response = await fetch_chatbot_response();
    return response.data.result;
  };

  useEffect(() => {
    localStorage.setItem("mood", mood);
  }, [mood]);

  const handleChatbotResponseType = async (prompt) => {
    if (
      prompt.includes("song") ||
      prompt.includes("songs") ||
      prompt.includes("music")
    ) {
      console.log("recommend songs");
      return await recommend_songs();
    } else if (
      prompt.includes("create") ||
      prompt.includes("generate") ||
      prompt.includes("image")
    ) {
      console.log("generate image");
      return await generate_image();
    } else {
      console.log("prompt: ", prompt);
      console.log("normal chatbot response");
      return await handleChatbotResponse();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.includes("song")) {
      recommend_songs();
      handleConversationSubmit(prompt);
    } else if (
      prompt.includes("create") ||
      prompt.includes("generate") ||
      prompt.includes("image")
    ) {
      generate_image(prompt);
    } else {
      // fetch_emotion_from_text();
      // fetch_conversation_title();
      handleConversationSubmit(prompt);
      // if (conversations.length === 2) {
      //   fetch_conversation_title(conversations[0].response);
      // }
      // store_user_conversations();
    }
  };

  const downloadDALLEImage = (imgURL) => {
    if (!imgURL) return;
    const imageLink = document.createElement("a");
    imageLink.href = imgURL;
    imageLink.download = "dalle_image.jpeg";
    document.body.appendChild(imageLink);
    imageLink.click();
    document.body.removeChild(imageLink);
  };

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversations]);

  useEffect(() => {
    const fetch_conversation_titles = async () => {
      await axios
        .get(`http://localhost:5000/fetch_conversation_titles/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setConversationTitle(response.data.titles);
          }
        });
    };
    fetch_conversation_titles();
  }, []);

  const newChat = () => {
    setIsNewChat(true);
    setTimeout(() => {
      setConversations("");
    }, 1000);
  };

  console.log(conversations);

  return (
    <div className="chatbot-container">
      <aside className={`sidemenu ${close ? "close" : "open"}`}>
        {!close ? (
          <>
            <div className="new-chatbot-container">
              <div className="sidemenu-button" onClick={newChat}>
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
              {conversationTitle.length === 0 ? (
                <div className="sidemenu-chat">New conversation</div>
              ) : (
                conversationTitle.map((item, index) => (
                  <div key={index} className="sidemenu-chat">
                    {item.title}
                  </div>
                ))
              )}
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
        <Banner />
        <div ref={conversationRef} className="chat item-1">
          {conversations.length === 0 ? (
            <>
              <div className="no-conversations">
                <p>
                  Good {day_time}, {localStorage.getItem("user")}. How are you
                  feeling today?
                </p>
                <img src={chaticon} alt="chat icon" />
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
                <div
                  className="conversations"
                  id={conversation.id}
                >
                  {loadingChatbotResponse &&
                  index === conversations.length - 1 &&
                  conversation.chatbot &&
                  conversation.response === "" ? (
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
                  ) : conversation.chatbot &&
                    conversation.response.startsWith("data:image") ? (
                    <>
                      <img
                        key={conversation.id}
                        src={conversation.response}
                        onClick={() => handleImageModal(conversation.response)}
                        alt="chat icon"
                      />
                      {clickedImage && (
                        <div className="modal-container">
                          <div className="modal-image">
                            <CloseIcon
                              sx={{ fontSize: 40 }}
                              onClick={() => modalClose(conversation.response)}
                            />
                          </div>
                          <div className="download-container">
                            <button
                              onClick={() =>
                                downloadDALLEImage(conversation.response)
                              }
                            >
                              <IoCloudDownloadOutline sx={{ fontSize: 50 }} />
                            </button>
                            <img
                              key={conversation.id}
                              src={conversation.response}
                              alt="enlarged"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : conversation.chatbot && conversation.response.includes("recommendations") ? (
                    ""
                  ) : (
                    conversation.response
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="chat item-2">
          <div className="user-item user-text-container">
            <textarea
              rows="1"
              placeholder="Message Revivo bot"
              className="text-box"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConversationSubmit(e);
              }}
            />
            <div className="mic">
              <Tooltip title="Record your voice">
                <Button
                  style={{
                    backgroundColor: "var(--bg-navbar)",
                    marginRight: 6,
                    marginLeft: -4,
                    paddingRight: 3,
                  }}
                  variant="contained"
                  startIcon={<MicRoundedIcon />}
                  onClick={handleAudioScript}
                  disabled={listening}
                ></Button>
              </Tooltip>
            </div>
          </div>
          <div className="user-item">
            <Button
              style={{ backgroundColor: "var(--bg-navbar)" }}
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
