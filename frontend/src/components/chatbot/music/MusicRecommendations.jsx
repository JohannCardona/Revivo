import axios from "axios";

// List of songs available in spotify
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

// Music genres linked to different emotions
export const genreEmotions = {
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

// Request call to Spotify API - music genre as input
export const recommend_songs = (genre) => {
  return axios.get(`http://localhost:5000/music_recommendations/${genre}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const getRandomSongGenres = (songArray, songCount) => {
  // Extract elements from songArray
  const randomArray = [...songArray];
  // Iterate through the array in reverse order
  // Get number of random indexes based on songCount
  for (let i = randomArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [randomArray[i], randomArray[randomIndex]] = [
      randomArray[randomIndex],
      randomArray[i],
    ];
  }
  return randomArray.slice(0, songCount);
};

export const fetching_songs_array = () => {
  // Chatbot message for genre recommendations
  let genre_list = "";
  const promptStart = "🎵 Here are some music genres you might enjoy:\n\n";
  // Get five random genres from the array
  const randomFive = getRandomSongGenres(songGenreArray, 5);
  localStorage.setItem("randomFive", JSON.stringify(randomFive));
  // Convert the array to a string by concatenating each genre
  const songs = randomFive
    .map((item, key) => `${key + 1}. ${item}`)
    .join("\n\n");
  const promptEnd = "\n\n💡Simply reply with a number of your choice.";
  // Concatenate the three parts of the message
  genre_list = promptStart + songs + promptEnd;
  return genre_list;
};

export const fetching_recommending_songs_response = (response) => {
  let song_list = "";
  // Check if song suggestions were fetched from Spotify API
  if (response.length !== 0) {
    const promptStart =
      "🎵 Here are some song recommendations for you for " +
      localStorage.getItem("chosenGenre") +
      " genre:\n\n";
    // Concatenate each of the songs into a string containing the song metadata
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
    // Concatenate all the parts of the message
    song_list = promptStart + songs + promptEnd;
  }
  return song_list;
};

export const fetch_song_genre_selection = async (song_genre) => {
  // Store name of selected music genre
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

// chatbotDummyResponse - variable name for chatbot messages
export const setSpotifyResponse = (
  setConversations,
  botMessageIndex,
  chatbotDummyResponse,
  setSelectedSong
) => {
  // Store the selected song Spotify ID to conversations array
  setConversations((prev) => {
    const currentMessage = [...prev];
    currentMessage[
      botMessageIndex
    ].response = `https://open.spotify.com/embed/track/${chatbotDummyResponse.songId}`;
    return currentMessage;
  });
  setSelectedSong(true);
};

// songData - string containing the metadata for the Spotify songs
export const get_song_data = (
  songData,
  setConversations,
  botMessageIndex,
  chatbotResponseId,
  chatbotTypingResponse
) => {
  // Store song recommendations message to conversations array
  setConversations((prev) => {
    const currentMessage = [...prev];
    currentMessage[botMessageIndex].response = songData;
    return currentMessage;
  });
  // Display message on the screen
  setTimeout(() => {
    const element = document.getElementById(chatbotResponseId);
    if (element) {
      chatbotTypingResponse(element, songData);
    } else {
    }
  }, 0);
};

export const music_options_recommender_message = (
  setConversations,
  botMessageIndex,
  chatbotDummyResponse,
  chatbotResponseId,
  chatbotTypingResponse
) => {
  // Store music genre suggestions message to the conversations array
  setConversations((prev) => {
    const currentMessage = [...prev];
    currentMessage[botMessageIndex].response = chatbotDummyResponse;
    return currentMessage;
  });
  // Display the suggestions message
  setTimeout(() => {
    const element = document.getElementById(chatbotResponseId);
    if (element) {
      chatbotTypingResponse(element, chatbotDummyResponse);
    } else {
    }
  }, 0);
};

export const music_recommendations_from_emotions = (
  setSelectedSongGenre,
  setConversations,
  botMessageIndex,
  chatbotResponseId,
  chatbotTypingResponse,
  setDynamicChoice,
  setSelectedDynamicSongChoice
) => {
  const storedEmotion = localStorage.getItem("mood");
  if (genreEmotions[storedEmotion]) {
    const availableGenres = genreEmotions[storedEmotion];
    setSelectedSongGenre(true);
    const genreSuggestions =
      `🎵 ${
        storedEmotion === "joy" || storedEmotion === "love"
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
};
