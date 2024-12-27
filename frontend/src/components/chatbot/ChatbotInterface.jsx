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

function ChatbotInterface() {
  const [prompt, setPrompt] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [close, setClose] = useState(false);
  const [conversations, setConversations] = useState([]);
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
  const [conversationTitle, setConversationTitle] = useState("");

  const fetch_conversation_title = async () => {
    axios
      .get(`http://localhost:5000/fetch_conversation_title/${prompt}`)
      .then((response) => {
        if (response.status === 200) {
          setConversationTitle(response.data.result);
        }
      });
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
    console.log("got the prompt");
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    console.log("generated the image");
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
    }, 1000);
  };

  const fireAlert = (response, type, color) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() === "") {
      fireAlert("Input a question before asking the chatbot.", "error", "red");
      return;
    }
    if (prompt.includes("song")) {
      console.log("Spotify API");
      recommend_songs();
    } else if (
      prompt.includes("create") ||
      prompt.includes("generate") ||
      prompt.includes("image")
    ) {
      console.log("DALL-E");
      generate_image(prompt);
    } else {
      console.log("conversation");
      // fetch_conversation_title();
      handleConversationSubmit();
    }
  };

  // useEffect(() => {
  //   if (loadingChatbotResponse && previousMessageRef.current) {
  //     const response = document.getElementById(previousMessageRef.current);
  //     if (response) {
  //     }
  //   }
  // }, [loadingChatbotResponse, conversations]);

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

  console.log(conversations);
  console.log(previousMessageRef);

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
              {!conversationTitle ? (
                <div className="sidemenu-chat">Eleccion de Opciones SPY</div>
              ) : (
                <div className="sidemenu-chat">{conversationTitle}</div>
              )}
              <div className="sidemenu-chat">Inversion SPY hoy</div>
              <div className="sidemenu-chat">Iron Man Thanos Moon</div>
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
          {/* {
            <>
              <br />
              <img src={imgURL} alt="AI generated visual art" />
            </>
          } */}
        </div>
        <div className="chat item-2">
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
                    backgroundColor: "var(--bg-navbar)",
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
