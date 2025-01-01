import React, { useState, useRef, useEffect } from "react";
import { Button, Tooltip } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Comment } from "react-loader-spinner";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import AddIcon from "@mui/icons-material/Add";
import chaticon from "../../images/chatbot.svg";
import MenuIcon from "@mui/icons-material/Menu";
import "../../styles/chatbot/ChatbotInterface.css";
import OpenAI from "openai";
import Swal from "sweetalert2";
import axios from "axios";
import ExistingUser from "../login/ExistingUser";
import NewUser from "../login/NewUser";
import Banner from "../Banner/Banner";

function ChatbotInterface() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const [prompt, setPrompt] = useState("");
  const [listening, setListening] = useState(false);
  const [imgURL, setImgURL] = useState("");
  const [close, setClose] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isNewChat, setIsNewChat] = useState(false);
  const conversationRef = useRef(null);
  const previousMessageRef = useRef(null);
  const chatbotTypingSpeed = 10;
  const [loadingChatbotResponse, setLoadingChatbotResponse] = useState(false);
  const song_genres = ["latino", "happy", "calm", "rock"];
  const song_genre = "latino";
  const [recommended_songs, setRecommendedSongs] = useState([]);
  const [newUser, setNewUser] = useState(null);
  const [existingUser, setExistingUser] = useState(null);
  const [isSignup, setIsSignUp] = useState(true);
  const [conversationTitle, setConversationTitle] = useState([]);
  const [mood, setMood] = useState("");

  useEffect(() => {
    if (recognition) {
      recognition.continues = false;
      recognition.lang = "en-US";
      recognition.interimResults = true;

      recognition.onStart = () => {
        console.log("Listening");
        setListening(true);
      };

      recognition.onEnd = () => {
        console.log("Stop Listening");
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
              // console.log(response.data.result);
            }
          });
      } else {
        console.log("conversation has not ended...");
      }
    }
  };

  const handleRegister = (user) => {
    localStorage.setItem("user", user);
    setNewUser(user);
    setIsSignUp(false);
  };

  const handleSignIn = (user) => {
    setExistingUser(user);
  };

  const recommend_songs = () => {
    axios
      .get(`http://localhost:5000/music_recommendations/${song_genre}`)
      .then((response) => {
        if (response.status === 200) {
          setRecommendedSongs(response.data);
        }
      });
  };

  const client = new OpenAI({
    apiKey:
      "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",
    dangerouslyAllowBrowser: true,
  });

  const generate_image = async (prompt) => {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    setImgURL(response.data[0].url);
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
      chatbot,
      response,
    };
  };

  const handleConversationSubmit = async () => {
    // e.preventDefault();
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

    previousMessageRef.current = chatbotResponseId;

    setTimeout(() => {
      setLoadingChatbotResponse(false);
      const chatbotDummyResponse =
        "Hello, I am ChatGPT, an AI language model developed by OpenAI. Let's bring your creativity to life.";
      const conversationDiv = document.getElementById(chatbotResponseId);
      if (conversationDiv) {
        chatbotTypingResponse(conversationDiv, chatbotDummyResponse);
      }
    }, 2000);
  };

  const fireAlert = (response, type, color) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    });
  };

  const fetch_emotion_from_text = async () => {
    await axios
      .get(`http://localhost:5000/emotion_classifier/${prompt}`)
      .then((response) => {
        setMood(response.data);
      });
  };

  useEffect(() => {
    localStorage.setItem("mood", mood);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() === "") {
      fireAlert("Input a question before asking the chatbot.", "error", "red");
      return;
    }
    if (prompt.includes("song")) {
      // console.log("Spotify API");
      recommend_songs();
    } else if (
      prompt.includes("create") ||
      prompt.includes("generate") ||
      prompt.includes("image")
    ) {
      // console.log("DALL-E");
      generate_image(prompt);
    } else {
      // console.log("conversation");
      // fetch_emotion_from_text();
      // fetch_conversation_title();
      handleConversationSubmit();
      // console.log(conversations);
      if (conversations.length === 2) {
        fetch_conversation_title(conversations[0].response);
      }
      // console.log("store conversation");
      store_user_conversations();
    }
  };

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversations]);

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) {
      setNewUser(user);
      setIsSignUp(false);
    }
  }, []);

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
            // console.log(response.data.titles);
            setConversationTitle(response.data.titles);
          }
        });
    };
    fetch_conversation_titles();
  }, [conversationTitle]);

  if (!existingUser) {
    return isSignup ? (
      <NewUser
        onRegister={handleRegister}
        switchToSignIn={() => setIsSignUp(false)}
      />
    ) : (
      <ExistingUser
        newUser={newUser}
        onSignIn={handleSignIn}
        switchToRegister={() => setIsSignUp(false)}
      />
    );
  }

  const newChat = () => {
    setIsNewChat(true);
    // console.log(isNewChat);
    setTimeout(() => {
      setConversations("");
    }, 2000);
  };

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
                <div className="sidemenu-chat">Eleccion de Opciones SPY</div>
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
                {recommended_songs.length > 0 ? (
                  <iframe
                    title="song embedding"
                    src={`https://open.spotify.com/embed/track/${recommended_songs[0].spotify_id}`}
                    width="40%"
                    height="100%"
                    frameBorder="0"
                    allowtransparency="true"
                    allow="encrypted-media"
                  ></iframe>
                ) : (
                  ""
                )}
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
                    conversation.response
                  )}
                </div>
              </div>
            ))
          )}
          {recommended_songs.map((item, key) => (
            <div key={key}>
              <p>Album: {item.album}</p>
              <p>Album Date: {item.album_date}</p>
              <p>Artist: {item.artist}</p>
              <p>Song Name: {item.name}</p>
              <p>Popularity: {item.popularity}</p>
              <p>Spotify_ID: {item.postify_id}</p>
            </div>
          ))}
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
                if (e.key === "Enter") handleSubmit(e);
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
              onClick={handleSubmit}
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
