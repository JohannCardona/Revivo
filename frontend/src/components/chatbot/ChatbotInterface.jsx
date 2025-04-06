import React, { useState, useRef, useEffect } from "react";
import { Comment } from "react-loader-spinner";
import chaticon from "../../images/chatbot.svg";
import "../../styles/chatbot/ChatbotInterface.css";
import Swal from "sweetalert2";
import axios from "axios";
import Banner from "../Banner/Banner";
import DisplayImages from "./images/DisplayImages";
import { generate_image, downloadDALLEImage } from "./images/ArtisticImages";
import Sidebar from "./Sidebar";
import {
  genreEmotions,
  fetch_song_genre_selection,
  recommend_songs,
  fetching_songs_array,
  fetching_recommending_songs_response,
  setSpotifyResponse,
} from "./music/MusicRecommendations";
import { fetch_emotion_from_text } from "./emotions/Emotions";
import {
  error_message,
  fetch_conversation_title,
  fetch_conversation_titles,
} from "./chats/UserConversations";
import UserInputs from "./UserInputs";
import Spotify from "./music/Spotify";
import {
  handleChatbotResponse,
  chatbotTypingResponse,
  conversationList,
  generateChatbotResponseId,
  day_time,
} from "./ResponseType";

function ChatbotInterface() {
  let [prompt, setPrompt] = useState("");
  const [close, setClose] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [fetchedConversations, setFetchedConversations] = useState([]);
  const [fetchedConversation, setFetchedConversation] = useState(false);
  const [conversationTitle, setConversationTitle] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const conversationRef = useRef(null);
  const [loadingChatbotResponse, setLoadingChatbotResponse] = useState(false);
  const [recommended_songs, setRecommendedSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(false);
  const [songSelection, setSongSelection] = useState(false);
  const [selectedSongGenre, setSelectedSongGenre] = useState(false);
  const [dynamicChoice, setDynamicChoice] = useState(false);
  const [selectedDynamicSongChoice, setSelectedDynamicSongChoice] =
    useState(false);
  const [conversationTitles, setConversationTitles] = useState([]);
  const [clickedImage, setClickedImage] = useState(null);
  const modalClose = () => {
    setClickedImage(null);
  };

  const handleConversationSubmit = async () => {
    prompt = prompt.toLowerCase();
    if (prompt.trim() === "") {
      fireAlert("Input a question before asking the chatbot.", "error", "red");
      setPrompt("");
      return;
    }

    localStorage.setItem("user_message", prompt);
    setPrompt("");
    const message = localStorage.getItem("user_message");

    if (!conversationTitle) {
      try {
        await fetch_conversation_title(message, setConversationTitle);
      } catch (error) {
        console.error("Error generating conversation title:", error);
      }
    }

    const userResponse = conversationList(false, message, null);
    setConversations((prevConversations) => [
      ...prevConversations,
      userResponse,
    ]);

    if (
      message.includes("bye") ||
      message.includes("exit") ||
      message.includes("bye bye") ||
      message.includes("goodbye") ||
      message.includes("see you") ||
      message.includes("see ya")
    ) {
      setPrompt("");
      return;
    }

    const chatbotResponseId = generateChatbotResponseId();
    console.log(chatbotResponseId);
    const chatbotResponse = conversationList(true, "", chatbotResponseId);
    setConversations((prevConversations) => [
      ...prevConversations,
      chatbotResponse,
    ]);

    setLoadingChatbotResponse(true);
    const botMessageIndex = conversations.length + 1;
    try {
      if (dynamicChoice) {
        const suggestionChoice = message;
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
        if (chatbotDummyResponse.album) {
          setSpotifyResponse(
            setConversations,
            botMessageIndex,
            chatbotDummyResponse,
            setSelectedSong
          );
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
          const extractedEmotion = await fetch_emotion_from_text(message);
          const randomiser = Math.random();
          if (
            randomiser > 0.7 &&
            genreEmotions[extractedEmotion] &&
            conversations.length !== 0
          ) {
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
      error_message(
        setLoadingChatbotResponse,
        setConversations,
        botMessageIndex,
        chatbotResponseId,
        chatbotTypingResponse
      );
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

  useEffect(() => {
    fetch_conversation_titles(setConversationTitles);
  }, [conversationTitles]);

  useEffect(() => {
    const dynamic_mood_tracking = () => {
      if (
        conversations.length === 2 &&
        conversations[1].response !== "" &&
        (prompt.includes("recommend song") ||
          prompt.includes("recommend songs") ||
          prompt.includes("recommend a song") ||
          prompt.includes("songs") ||
          prompt.includes("music") ||
          prompt.includes("another song") ||
          prompt.includes("other songs") ||
          prompt.includes("create") ||
          prompt.includes("generate") ||
          prompt.includes("image") ||
          prompt.includes("hello") ||
          prompt.includes("hi")) &&
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
        axios.post(`http://localhost:5000/store_user_moods`, mood_tracking, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
            .post(
              "http://localhost:5000/conversations",
              {
                user,
                conversationTitle,
                conversations,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
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

  return (
    <div className="chatbot-container">
      <Sidebar
        setIsNewChat={setIsNewChat}
        close={close}
        setClose={setClose}
        conversationTitles={conversationTitles}
        setFetchedConversation={setFetchedConversation}
        setFetchedConversations={setFetchedConversations}
        fetchedConversation={fetchedConversation}
        setConversations={setConversations}
      />
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
                          <DisplayImages
                            conversation={conversation}
                            setClickedImage={setClickedImage}
                            clickedImage={clickedImage}
                            modalClose={modalClose}
                            downloadDALLEImage={downloadDALLEImage}
                          />
                        ) : conversation.chatbot &&
                          conversation.response.includes("recommendations") ? (
                          conversation.response
                        ) : conversation.chatbot &&
                          conversation.response.includes(
                            "https://open.spotify.com/embed"
                          ) ? (
                          <Spotify conversation={conversation} />
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
                          <DisplayImages
                            conversation={conversation}
                            setClickedImage={setClickedImage}
                            clickedImage={clickedImage}
                            modalClose={modalClose}
                            downloadDALLEImage={downloadDALLEImage}
                          />
                        ) : conversation.chatbot &&
                          conversation.response.includes("recommendations") ? (
                          ""
                        ) : conversation.chatbot &&
                          conversation.response.includes(
                            "https://open.spotify.com/embed"
                          ) ? (
                          <Spotify conversation={conversation} />
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
        <UserInputs
          prompt={prompt}
          setPrompt={setPrompt}
          handleConversationSubmit={handleConversationSubmit}
        />
      </div>
    </div>
  );
}

export default ChatbotInterface;
