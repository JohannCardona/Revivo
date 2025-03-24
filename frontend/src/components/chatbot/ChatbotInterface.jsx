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
  const [fetchedConversations, setFetchedConversations] = useState([]);
  const [fetchedConversation, setFetchedConversation] = useState(false);
  const [conversationTitle, setConversationTitle] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const conversationRef = useRef(null);
  const chatbotTypingSpeed = 10;
  const [loadingChatbotResponse, setLoadingChatbotResponse] = useState(false);
  const [recommended_songs, setRecommendedSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(false);
  const [songSelection, setSongSelection] = useState(false);
  const [selectedSongGenre, setSelectedSongGenre] = useState(false);
  const [dynamicChoice, setDynamicChoice] = useState(false);
  const [selectedDynamicSongChoice, setSelectedDynamicSongChoice] =
    useState(false);
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
    "chill",
    "calm",
  ];
  const genreEmotions = {
    joy: [
      "dance",
      "latino",
      "rock",
      "pop",
      "edm",
      "rap",
      "r&b",
      "heavy metal",
      "hard rock",
    ],
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
    anger: ["rap", "metal", "rock", "heavy metal", "hard rock", "classical"],
    fear: ["ambient", "classical", "chill", "calm", "rain", "sleep", "waves"],
  };
  const [conversationTitles, setConversationTitles] = useState([]);

  const recommend_songs = async (genre) => {
    const response = await axios.get(
      `http://localhost:5000/music_recommendations/${genre}`
    );
    return response.data;
  };

  const generate_image = async (prompt) => {
    const response = await axios.post(
      `http://localhost:5000/image_generation`,
      { prompt }
    );
    const genImage = `data:image/jpeg;base64,${response.data[0].result}`;
    return genImage;
  };

  const [clickedImage, setClickedImage] = useState(null);
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

  const getRandomSongGenres = (songArray, songCount) => {
    const randomArray = [...songArray];
    for (let i = randomArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [randomArray[i], randomArray[randomIndex]] = [
        randomArray[randomIndex],
        randomArray[i],
      ];
    }
    return randomArray.slice(0, songCount);
  };

  const fetching_songs_array = () => {
    let genre_list = "";
    const promptStart = "🎵 Here are some music genres you might enjoy:\n\n";
    const randomFive = getRandomSongGenres(songGenreArray, 5);
    localStorage.setItem("randomFive", JSON.stringify(randomFive));
    const songs = randomFive
      .map((item, key) => `${key + 1}. ${item}`)
      .join("\n\n");
    const promptEnd = "\n\n💡Simply reply with a number of your choice.";
    genre_list = promptStart + songs + promptEnd;
    return genre_list;
  };

  const fetching_recommending_songs_response = (response) => {
    let song_list = "";
    if (response.length !== 0) {
      const promptStart =
        "🎵 Here are some song recommendations for you for " +
        localStorage.getItem("chosenGenre") +
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

  const fetch_song_genre_selection = async (song_genre) => {
    await axios
      .post(
        `http://localhost:5000/post_song_genre_selection`,
        { song_genre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.result);
        }
      });
  };

  const handleConversationSubmit = async () => {
    prompt = prompt.toLowerCase();
    if (prompt.trim() === "") {
      fireAlert("Input a question before asking the chatbot.", "error", "red");
      setPrompt("");
      return;
    }
    if (!conversationTitle) {
      try {
        await fetch_conversation_title(prompt);
      } catch (error) {
        console.error("Error generating conversation title:", error);
      }
    }
    console.log("CREATE USER OBJECT...");
    const userResponse = conversationList(false, prompt, null);
    console.log("ADD USER TO ARRAY...");
    setConversations((prevConversations) => [
      ...prevConversations,
      userResponse,
    ]);
    localStorage.setItem("user_message", prompt);
    if (
      prompt.includes("bye") ||
      prompt.includes("exit") ||
      prompt.includes("bye bye") ||
      prompt.includes("goodbye") ||
      prompt.includes("see you") ||
      prompt.includes("see ya")
    ) {
      setPrompt("");
      return;
    }
    setPrompt("");

    console.log("CREATE CHATBOT OBJECT...");
    const chatbotResponseId = generateChatbotResponseId();
    console.log(chatbotResponseId);
    const chatbotResponse = conversationList(true, "", chatbotResponseId);
    console.log("ADD CHATBOT TO ARRAY...");
    setConversations((prevConversations) => [
      ...prevConversations,
      chatbotResponse,
    ]);

    setLoadingChatbotResponse(true);
    const botMessageIndex = conversations.length + 1;
    const message = localStorage.getItem("user_message");
    try {
      if (dynamicChoice) {
        const suggestionChoice = message;
        console.log(suggestionChoice);
        const conversationDiv = document.getElementById(chatbotResponseId);
        console.log(conversationDiv);
        if (suggestionChoice === "music") {
          const storedEmotion = localStorage.getItem("mood");
          if (genreEmotions[storedEmotion]) {
            const availableGenres = genreEmotions[storedEmotion];
            setSelectedSongGenre(true);
            const genreSuggestions =
              `🎵 ${
                storedEmotion === "happiness" || storedEmotion === "love"
                  ? "Here are some genres you might like"
                  : "Here are some genres you might like to make you feel better"
              }:\n\n` +
              availableGenres.map((g, i) => `${i + 1}. ${g}`).join("\n") +
              "\n\n💡Simply reply with a number of your choice.";
            localStorage.setItem(
              "availableDynamicGenres",
              JSON.stringify(availableGenres)
            );
            setConversations((prev) => {
              const currentMessage = [...prev];
              currentMessage[botMessageIndex].response = genreSuggestions;
              return currentMessage;
            });
            setTimeout(() => {
              const element = document.getElementById(chatbotResponseId);
              if (element) {
                chatbotTypingResponse(element, genreSuggestions);
              } else {
              }
            }, 0);
          }
          setDynamicChoice(false);
          setSelectedDynamicSongChoice(true);
        } else if ("image") {
          const storedEmotion = localStorage.getItem("mood");
          const dallePrompt = `An abstract artistic interpretation of the ${storedEmotion} mood in a creative, modern style.`;
          const imageUrl = await generate_image(dallePrompt);
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = imageUrl;
            return currentMessage;
          });
          setDynamicChoice(false);
        }
      } else {
        const chatbotDummyResponse = await handleChatbotResponseType(message);
        console.log(chatbotDummyResponse);

        const conversationDiv = document.getElementById(chatbotResponseId);
        console.log(conversationDiv);
        if (chatbotDummyResponse.album) {
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[
              botMessageIndex
            ].response = `https://open.spotify.com/embed/track/${chatbotDummyResponse.songId}`;
            return currentMessage;
          });
          setSelectedSong(true);
        } else if (chatbotDummyResponse.includes("Simply reply")) {
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = chatbotDummyResponse;
            return currentMessage;
          });
          setTimeout(() => {
            const element = document.getElementById(chatbotResponseId);
            if (element) {
              chatbotTypingResponse(element, chatbotDummyResponse);
            } else {
            }
          }, 0);
        } else if (chatbotDummyResponse > 0 && chatbotDummyResponse < 6) {
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = chatbotDummyResponse;
            return currentMessage;
          });
          setTimeout(() => {
            const element = document.getElementById(chatbotResponseId);
            if (element) {
              chatbotTypingResponse(element, chatbotDummyResponse);
            } else {
            }
          }, 0);
        } else if (
          chatbotDummyResponse.includes(
            "Please choose a number from the song list"
          )
        ) {
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = chatbotDummyResponse;
            return currentMessage;
          });
          setTimeout(() => {
            const element = document.getElementById(chatbotResponseId);
            if (element) {
              chatbotTypingResponse(element, chatbotDummyResponse);
            } else {
            }
          }, 0);
        } else if (
          chatbotDummyResponse.includes(
            "Please choose a number from the genre list"
          )
        ) {
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = chatbotDummyResponse;
            return currentMessage;
          });
          setTimeout(() => {
            const element = document.getElementById(chatbotResponseId);
            if (element) {
              chatbotTypingResponse(element, chatbotDummyResponse);
            } else {
            }
          }, 0);
        } else if (Array.isArray(chatbotDummyResponse)) {
          const songData =
            fetching_recommending_songs_response(chatbotDummyResponse);
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = songData;
            return currentMessage;
          });
          setTimeout(() => {
            const element = document.getElementById(chatbotResponseId);
            if (element) {
              chatbotTypingResponse(element, songData);
            } else {
            }
          }, 0);
        } else if (chatbotDummyResponse.includes("data:image")) {
          setConversations((prev) => {
            const currentMessage = [...prev];
            currentMessage[botMessageIndex].response = chatbotDummyResponse;
            return currentMessage;
          });
        } else {
          console.log("chatbot responded...");
          const extractedEmotion = await fetch_emotion_from_text(message);
          const randomiser = Math.random();
          console.log(randomiser);
          if (
            randomiser > 0.7 &&
            genreEmotions[extractedEmotion] &&
            conversations.length !== 0
          ) {
            console.log("DYNAMIC...");
            const dynamicChoiceMessage =
              `Would you like some music suggestions or an artistic image to help you relax? \n` +
              `Please type "music" for music suggestions or "image" for an artistic image.`;
            setConversations((prev) => {
              const currentMessage = [...prev];
              currentMessage[botMessageIndex].response = dynamicChoiceMessage;
              return currentMessage;
            });
            setTimeout(() => {
              const element = document.getElementById(chatbotResponseId);
              if (element) {
                chatbotTypingResponse(element, dynamicChoiceMessage);
              } else {
              }
            }, 0);
            setDynamicChoice(true);
          } else {
            console.log("YAY...");
            const chatbot_response = await handleChatbotResponse(message);
            setConversations((prev) => {
              const currentMessage = [...prev];
              currentMessage[botMessageIndex].response = chatbot_response;
              return currentMessage;
            });
            setTimeout(() => {
              const element = document.getElementById(chatbotResponseId);
              if (element) {
                chatbotTypingResponse(element, chatbot_response);
              } else {
              }
            }, 0);
          }
        }
      }
    } catch (err) {
      console.log(err);
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
      prompt.includes("bye") ||
      prompt.includes("exit") ||
      prompt.includes("bye bye") ||
      prompt.includes("goodbye") ||
      prompt.includes("see you") ||
      prompt.includes("see ya")
    ) {
      return;
    } else if (
      prompt.includes("recommend song") ||
      prompt.includes("recommend songs") ||
      prompt.includes("recommend a song") ||
      prompt.includes("songs") ||
      prompt.includes("music") ||
      prompt.includes("another song") ||
      prompt.includes("other songs")
    ) {
      const random_song_genres = fetching_songs_array();
      setSelectedSongGenre(true);
      return random_song_genres;
    } else if (
      selectedSongGenre === true &&
      selectedDynamicSongChoice === true &&
      !isNaN(prompt)
    ) {
      const selectedGenreNumber = parseInt(prompt) - 1;
      console.log(selectedGenreNumber);
      const dynamicArray = JSON.parse(
        localStorage.getItem("availableDynamicGenres")
      );
      console.log(dynamicArray);
      if (
        selectedGenreNumber >= 0 &&
        selectedGenreNumber < dynamicArray.length
      ) {
        const chosenRecommendedGenre = dynamicArray[selectedGenreNumber];
        await fetch_song_genre_selection(chosenRecommendedGenre);
        localStorage.setItem("chosenGenre", chosenRecommendedGenre);
        setSelectedSongGenre(false);
        const songRecommendations = await recommend_songs(
          chosenRecommendedGenre
        );
        setRecommendedSongs(songRecommendations);
        setSongSelection(true);
        return songRecommendations;
      } else {
        setSelectedSongGenre(true);
        return "💡Please choose a number from the song list.";
      }
    } else if (selectedSongGenre === true && !isNaN(prompt)) {
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
        await fetch_song_genre_selection(chosenRecommendedGenre);
        setSelectedSongGenre(false);
        const songRecommendations = await recommend_songs(
          chosenRecommendedGenre
        );
        setRecommendedSongs(songRecommendations);
        setSongSelection(true);
        return songRecommendations;
      } else {
        setSelectedSongGenre(true);
        return "💡Please choose a number from the genre list.";
      }
    } else if (songSelection && !isNaN(prompt)) {
      const selectedSongNumber = parseInt(prompt) - 1;
      if (
        selectedSongNumber >= 0 &&
        selectedSongNumber < recommended_songs.length
      ) {
        const chosenRecommendedSong = recommended_songs[selectedSongNumber];
        setSongSelection(false);
        return chosenRecommendedSong;
      } else {
        setSongSelection(true);
        return "💡Please choose a number from the song list.";
      }
    } else if (
      prompt.includes("create") ||
      prompt.includes("generate") ||
      prompt.includes("image")
    ) {
      return await generate_image(prompt);
    } else {
      console.log("normal chatbot response");
      return await prompt;
    }
  };

  const fetch_conversation_title = async (prompt) => {
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
            setConversationTitles(response.data.titles);
          }
        });
    };
    fetch_conversation_titles();
  }, [conversationTitles]);

  useEffect(() => {
    const dynamic_mood_tracking = () => {
      if (
        conversations.length === 2 &&
        conversations[1].response !== "" &&
        localStorage.getItem("mood")
      ) {
        const mood_tracking = {
          user: localStorage.getItem("user"),
          mood:
            localStorage.getItem("mood").charAt(0).toUpperCase() +
            localStorage.getItem("mood").slice(1),
          userNote: localStorage.getItem("user_message"),
          timestamp: new Date().toISOString(),
        };
        console.log("MOOD TRACKING: ", mood_tracking);
        axios.post(`http://localhost:5000/store_user_moods`, mood_tracking);
      }
    };
    dynamic_mood_tracking();
  }, [conversations]);

  useEffect(() => {
    const store_user_conversations = async () => {
      const user = localStorage.getItem("user");
      if (conversations.length !== 0) {
        if (
          localStorage.getItem("user_message").includes("bye") ||
          localStorage.getItem("user_message").includes("exit") ||
          localStorage.getItem("user_message").includes("bye bye") ||
          localStorage.getItem("user_message").includes("goodbye") ||
          localStorage.getItem("user_message").includes("see you") ||
          localStorage.getItem("user_message").includes("see ya") ||
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
    store_user_conversations();
  }, [conversations, isNewChat, conversationTitle]);

  const fetching_user_conversations = async (chat_title) => {
    await axios
      .get(`http://localhost:5000/fetching_user_conversations/${chat_title}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.result === null) {
        } else {
          setFetchedConversation(true);
          setFetchedConversations(response?.data?.result?.conversations);
        }
      });
  };

  const newChat = () => {
    setIsNewChat(true);
    if (!fetchedConversation) {
      setTimeout(() => {
        setConversations("");
      }, 500);
    } else {
      setFetchedConversation(false);
      setFetchedConversations("");
    }
    setIsNewChat(false);
  };

  return (
    <div className="chatbot-container">
      <aside className={`sidemenu ${close ? "close" : "open"}`}>
        {!close ? (
          <>
            <div className="new-chatbot-container">
              <div className="sidemenu-button" onClick={() => newChat()}>
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
              {conversationTitles.length === 0 ? (
                <div className="sidemenu-chat">New conversation</div>
              ) : (
                conversationTitles.map((item, index) => (
                  <div
                    key={index}
                    className="sidemenu-chat"
                    onClick={() => fetching_user_conversations(item.title)}
                  >
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
          {fetchedConversations.length === 0 && conversations.length === 0 ? (
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
            <>
              {fetchedConversation === true
                ? fetchedConversations.map((conversation, index) => (
                    <div
                      key={index}
                      className={`wrapper ${
                        conversation.chatbot ? "chatbot" : "user"
                      }`}
                    >
                      <div className="conversations" id={conversation.id}>
                        {loadingChatbotResponse &&
                        index === fetchedConversations.length - 1 &&
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
                          <div key={conversation.id} id={conversation.id}>
                            <img
                              id={conversation.id}
                              src={conversation.response}
                              onClick={() =>
                                setClickedImage(conversation.response)
                              }
                              alt="chat icon"
                            />
                            {clickedImage && (
                              <div
                                key={conversation.id}
                                id={conversation.id}
                                className="modal-container"
                              >
                                <div className="modal-image">
                                  <CloseIcon
                                    sx={{ fontSize: 40 }}
                                    onClick={() =>
                                      modalClose(conversation.response)
                                    }
                                  />
                                </div>
                                <div
                                  key={conversation.id}
                                  id={conversation.id}
                                  className="download-container"
                                >
                                  <button
                                    onClick={() =>
                                      downloadDALLEImage(clickedImage)
                                    }
                                  >
                                    <IoCloudDownloadOutline
                                      sx={{ fontSize: 50 }}
                                    />
                                  </button>
                                  <img
                                    id={conversation.id}
                                    src={clickedImage}
                                    alt="enlarged"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : conversation.chatbot &&
                          conversation.response.includes("recommendations") ? (
                          conversation.response
                        ) : conversation.chatbot &&
                          conversation.response.includes(
                            "https://open.spotify.com/embed"
                          ) ? (
                          <>
                            <iframe
                              title="recommender"
                              style={{ borderRadius: "12px" }}
                              src={conversation.response}
                              width="100%"
                              height="352"
                              frameBorder="0"
                              allowFullScreen=""
                              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                              loading="lazy"
                            ></iframe>
                          </>
                        ) : (conversation.chatbot &&
                            conversation.response.includes(
                              "Here are some genres you might like"
                            )) ||
                          (conversation.chatbot &&
                            conversation.response.includes(
                              "Here are some music genres you might enjoy"
                            )) ||
                          (conversation.chatbot &&
                            conversation.response.includes(
                              "Here are some song recommendations for you "
                            )) ? (
                          conversation.response
                        ) : conversation.chatbot &&
                          selectedSong !== true &&
                          !conversation.response.includes("recommendations") &&
                          !conversation.response.includes("data:image") ? (
                          conversation.response
                        ) : !conversation.chatbot ? (
                          conversation.response
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))
                : conversations.map((conversation, index) => (
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
                          <div key={conversation.id} id={conversation.id}>
                            <img
                              id={conversation.id}
                              src={conversation.response}
                              onClick={() =>
                                setClickedImage(conversation.response)
                              }
                              alt="chat icon"
                            />
                            {clickedImage && (
                              <div
                                key={conversation.id}
                                id={conversation.id}
                                className="modal-container"
                              >
                                <div className="modal-image">
                                  <CloseIcon
                                    sx={{ fontSize: 40 }}
                                    onClick={() =>
                                      modalClose(conversation.response)
                                    }
                                  />
                                </div>
                                <div
                                  key={conversation.id}
                                  id={conversation.id}
                                  className="download-container"
                                >
                                  <button
                                    onClick={() =>
                                      downloadDALLEImage(clickedImage)
                                    }
                                  >
                                    <IoCloudDownloadOutline
                                      sx={{ fontSize: 50 }}
                                    />
                                  </button>
                                  <img
                                    id={conversation.id}
                                    src={clickedImage}
                                    alt="enlarged"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : conversation.chatbot &&
                          conversation.response.includes("recommendations") ? (
                          ""
                        ) : conversation.chatbot &&
                          conversation.response.includes(
                            "https://open.spotify.com/embed"
                          ) ? (
                          <>
                            <iframe
                              title="recommender"
                              style={{ borderRadius: "12px" }}
                              src={conversation.response}
                              width="100%"
                              height="352"
                              frameBorder="0"
                              allowFullScreen=""
                              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                              loading="lazy"
                            ></iframe>
                          </>
                        ) : (conversation.chatbot &&
                            conversation.response.includes(
                              "Here are some genres you might like"
                            )) ||
                          (conversation.chatbot &&
                            conversation.response.includes(
                              "Here are some music genres you might enjoy"
                            )) ||
                          (conversation.chatbot &&
                            conversation.response.includes(
                              "Here are some song recommendations for you "
                            )) ? (
                          ""
                        ) : conversation.chatbot &&
                          selectedSong !== true &&
                          !conversation.response.includes("recommendations") &&
                          !conversation.response.includes("data:image") ? (
                          ""
                        ) : !conversation.chatbot ? (
                          conversation.response
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))}
            </>
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
          </div>
          <div className="user-item">
            <Tooltip title="Send">
              <Button
                style={{
                  backgroundColor: "var(--image-button)",
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
