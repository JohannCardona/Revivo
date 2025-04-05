import axios from "axios";

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

export const recommend_songs = async (genre) => {
  const response = await axios.get(
    `http://localhost:5000/music_recommendations/${genre}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
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

export const fetching_songs_array = () => {
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

export const fetching_recommending_songs_response = (response) => {
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

export const fetch_song_genre_selection = async (song_genre) => {
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
