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

  let [prompt, setPrompt] = useState("");
  const [listening, setListening] = useState(false);
  const [close, setClose] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isNewChat, setIsNewChat] = useState(false);
  const conversationRef = useRef(null);
  const chatbotTypingSpeed = 10;
  const [loadingChatbotResponse, setLoadingChatbotResponse] = useState(false);
  const [recommended_songs, setRecommendedSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(false);
  const [songSelection, setSongSelection] = useState(false);
  const [songGenres, setSongGenres] = useState([]);
  const [selectedSongGenre, setSelectedSongGenre] = useState(false);
  const [dynamicMusic, setDynamicChoice] = useState(false);
  const songGenreArray = [
    "dance",
    "latino",
    "rock",
    "pop",
    "edm",
    "rap",
    "r&b",
    "classical",
    "acoustic",
    "indie",
    "ambient",
    "rain",
    "sleep",
    "waves",
    "soul",
    "romantic",
    "jazz",
    "indie",
    "ambient",
    "chill",
    "calm",
  ];
  const genreEmotions = {
    joy: ["dance", "latino", "rock", "pop", "edm", "rap", "r&b"],
    sadness: [
      "classical",
      "acoustic",
      "indie",
      "ambient",
      "rain",
      "sleep",
      "waves",
    ],
    love: ["rap", "soul", "r&b", "romantic", "jazz"],
    surprise: ["rock", "indie", "edm"],
    anger: ["rap", "metal", "rock", "heavy metal", "hard rock"],
    fear: ["ambient", "classical", "chill", "calm", "rain", "sleep", "waves"],
  };
  const [conversationTitle, setConversationTitle] = useState([]);
  const songID = localStorage.getItem("songID");

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
    return response.data;
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

  const fetching_recommending_songs_response = (response) => {
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
        "\n\n💡Please let me know which one you would like to play by picking a number.";
      song_list = promptStart + songs + promptEnd;
    }
    return song_list;
  };

  const handleConversationSubmit = async () => {
    prompt = prompt.toLowerCase();
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
    console.log(chatbotResponseId);
    const chatbotResponse = conversationList(true, "", chatbotResponseId);
    setConversations((prevConversations) => [
      ...prevConversations,
      chatbotResponse,
    ]);
    setLoadingChatbotResponse(true);
    const botMessageIndex = conversations.length + 1;
    const message = localStorage.getItem("user_message");
    const chatbotDummyResponse = await handleChatbotResponseType(message);
    console.log(chatbotDummyResponse);
    
    try {
      if (chatbotDummyResponse) {
        setLoadingChatbotResponse(false);
        const conversationDiv = document.getElementById(chatbotResponseId);
        // if (chatbotDummyResponse.includes("data:image")) {
        //   setConversations((prev) => {
        //     const currentMessage = [...prev];
        //     currentMessage[botMessageIndex].response = chatbotDummyResponse;
        //     return currentMessage;
        //   });
        // }
        if (chatbotDummyResponse.album) {
          setSelectedSong(true);
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = chatbotDummyResponse.name;
            return currentMessage;
          });
        }
        if (chatbotDummyResponse.includes("Please choose a number from the list")) {
          chatbotTypingResponse(conversationDiv, chatbotDummyResponse);
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = chatbotDummyResponse;
            return currentMessage;
          });
        }
        if (Array.isArray(chatbotDummyResponse)) {
          const songData =
            fetching_recommending_songs_response(chatbotDummyResponse);
          chatbotTypingResponse(conversationDiv, songData);
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = songData;
            return currentMessage;
          });
        }
        // setConversations((prev) => {
        //   const currentMessage = [...prev];
        //   currentMessage[botMessageIndex].response = chatbotDummyResponse;
        //   return currentMessage;
        // });
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
      console.log(err);
      console.log(chatbotDummyResponse);
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
    const emotion = await axios.get(
      `http://localhost:5000/emotion_classifier/${prompt}`
    );
    localStorage.setItem("mood", emotion.data[0]);
    return emotion.data[0];
  };

  const fetch_chatbot_response = async (prompt) => {
    const res = await axios.post(`http://localhost:5000/chat`, { prompt });
    return res;
  };

  const handleChatbotResponse = async (prompt) => {
    const response = await fetch_chatbot_response(prompt);
    return response.data.result;
  };

  const handleChatbotResponseType = async (prompt) => {
    if (
    } else if (
      prompt.includes("song") ||
      prompt.includes("songs") ||
      prompt.includes("music") ||
      prompt.includes("another song") ||
      prompt.includes("other songs")
    ) {
      console.log("recommend songs");
      const random_song_genres = fetching_songs_array();
      setSelectedSongGenre(true);
      return random_song_genres;
    } else if (selectedSongGenre === true && !isNaN(prompt)) {
      console.log("Choose number...");
      const selectedGenreNumber = parseInt(prompt) - 1;
      console.log(selectedGenreNumber);
      const randomFiveArray = JSON.parse(localStorage.getItem("randomFive"));
      console.log(randomFiveArray);
      if (
        selectedGenreNumber >= 0 &&
        selectedGenreNumber < randomFiveArray.length
      ) {
        const chosenRecommendedGenre = randomFiveArray[selectedGenreNumber];
        localStorage.setItem("chosenGenre", chosenRecommendedGenre);
        setSelectedSongGenre(false);
        console.log(chosenRecommendedGenre);
        const songRecommendations = await recommend_songs(
          chosenRecommendedGenre
        );
        setRecommendedSongs(songRecommendations);
        setSongSelection(true);
        return songRecommendations;
      } else {
        return "💡Please choose a number from the list.";
      }
    } else if (songSelection && !isNaN(prompt)) {
      const selectedSongNumber = parseInt(prompt) - 1;
      if (
        selectedSongNumber >= 0 &&
        selectedSongNumber < recommended_songs.length
      ) {
        const chosenRecommendedSong = recommended_songs[selectedSongNumber];
        setSongSelection(false);
        localStorage.setItem("songID", chosenRecommendedSong.songId);
        return chosenRecommendedSong;
      } else {
        return "💡Please choose a number from the list.";
      }
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

  useEffect(() => {
    if (conversations.length === 10) {
      const fetch_conversation_title = async () => {
        const response = await fetch(
          "http://localhost:5000/fetch_conversation_title/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              prompt: localStorage.getItem("user_message"),
            }),
          }
        );
        if (response.status === 200) {
        }
      };
      fetch_conversation_title();
    }
  }, [conversations.length]);

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

  useEffect(() => {
    const store_user_conversations = async () => {
      if (conversations.length !== 0) {
        const exit_conversation = conversations.some((obj) =>
          obj.response.toLowerCase().includes("exit")
        );
        if (exit_conversation === true) {
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
    store_user_conversations();
  }, [conversations]);

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
                  <AddIcon
                    style={{ fontSize: "1.1rem", color: "var(--sidebar-text)" }}
                  />
                </span>
                New chat
              </div>
              <span className="close-button">
                <Tooltip title="Close sidebar">
                  <MenuIcon
                    style={{ fontSize: "1.5rem", color: "var(--sidebar-text)" }}
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
                style={{ fontSize: "1.5rem", color: "var(--sidebar-text)" }}
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
                <div className="conversations" id={conversation.id}>
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
                    conversation.response.includes("data:image") ? (
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
                  ) : conversation.chatbot &&
                    conversation.response.includes("recommendations") ? (
                    ""
                  ) : conversation.chatbot && selectedSong === true ? (
                    <>
                      <iframe
                        title="recommender"
                        style={{ borderRadius: "12px" }}
                        src={`https://open.spotify.com/embed/track/${songID}`}
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allowFullScreen=""
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      ></iframe>
                    </>
                  ) : conversation.chatbot &&
                    selectedSong !== true &&
                    !conversation.response.includes("recommendations") &&
                    !conversation.response.includes("data:image") ? (
                    ""
                  ) : (
                    conversation.response
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="item-2">
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
          </div>
          <div className="user-item mic">
            <Tooltip title="Record your voice">
              <Button
                style={{
                  backgroundColor: "var(--bg-navbar)",
                  marginRight: 7,
                  marginLeft: -3,
                  paddingRight: 3,
                  height: 44,
                  borderRadius: 8,
                }}
                variant="contained"
                startIcon={<MicRoundedIcon style={{ color: "var(--text)" }} />}
                onClick={handleAudioScript}
                disabled={listening}
              ></Button>
            </Tooltip>
          </div>
          <div className="user-item">
            <Tooltip title="Send">
              <Button
                style={{
                  backgroundColor: "var(--bg-navbar)",
                  padding: "12px 10px",
                  borderRadius: 8,
                  paddingLeft: 3,
                  marginRight: 8,
                }}
                variant="contained"
                endIcon={<SendRoundedIcon style={{ color: "var(--text)" }} />}
                onClick={handleConversationSubmit}
              ></Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotInterface;
