import axios from "axios";
import { fetch_chatbot_response } from "./ResponseType";
import { recommend_songs } from "./music/MusicRecommendations";
import { generate_image } from "./images/ArtisticImages";
jest.mock("axios");

describe("chatbot res function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("fetch normal chatbot response", async () => {
    const token = "abc123";
    const prompt = "I am feeling happy";
    const response =
      "That's great to hear! Do you want to talk about what's making you happy today?";
    localStorage.setItem("token", token);
    axios.post.mockResolvedValue(response);
    const result = await fetch_chatbot_response(prompt);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/chat",
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    expect(result).toEqual(response);
  });
});

describe("music recommendations res function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("fetch music recommendations response", async () => {
    const token = "abc123";
    const genre = "latino";
    const response = [
      {
        album: "House of Pleasure",
        albumDate: "2010-07-20",
        artist: "Plan B",
        name: "Por Que Te Demoras?",
        songId: "6URNgz911jj10KXTFtevcS",
        spotifyURL: "https://open.spotify.com/track/6URNgz911jj10KXTFtevcS",
      },
    ];
    localStorage.setItem("token", token);
    axios.get.mockResolvedValue(response);

    const result = await recommend_songs(genre);

    expect(result).toEqual(response);
    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:5000/music_recommendations/${genre}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  });
});

describe("image generation res function", () => {
  it("fetch generated image response", async () => {
    const token = "abc123";
    const prompt = "generate an image of a university building in a sunny day";
    const response = [
      {
        result:
          "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAQABAADASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAAECAwQFBgf/xABJEAABAwIEAwUHAwIFAwIFAgcBAAIRAyEEEjFBBVFhEyJxgZEUMqGxwdHwQlLhI2IGFTNy8YKSwiSyNENTY6I1RFRzg8PS0+L/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAUG/8QAKREBAQACAgIDAAMBAQACAwEAAAECERIhAzETQVEEIjJhcULwBSOBkf",
      },
    ];
    localStorage.setItem("token", token);
    axios.post.mockResolvedValue(response);

    const result = await generate_image(prompt);
    expect(result).toEqual(response);
    expect(axios.post).toHaveBeenCalledWith(
      `http://localhost:5000/image_generation`,
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  });
});
