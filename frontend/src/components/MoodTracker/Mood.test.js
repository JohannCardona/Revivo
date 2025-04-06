import axios from "axios";
import { get_moods, storeUserMoods } from "./MoodAPI";

jest.mock("axios");

describe("fetch mood function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("store tip for specific category", async () => {
    const token = "abc123";
    const userMoods = {
      mood: "Joy",
      timestamp: "2025-04-06T16:32:15.548Z",
      user: "johann",
      userNote: "what's up broski!",
    };
    const response = {
      data: { result: "User mood stored successfully" },
    };
    localStorage.setItem("token", token);
    axios.post.mockResolvedValue(response);
    const result = await storeUserMoods(userMoods);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/store_user_moods",
      userMoods,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    expect(result).toEqual(response);
  });

  it("fetch user moods", async () => {
    const token = "abc123";
    const userMoodData = {
      result: [
        {
          mood: "Joy",
          timestamp: "2025-01-14T16:32:15.548Z",
          user: "johann",
          userNote: "regreg",
        },
      ],
    };
    localStorage.setItem("token", token);
    axios.get.mockResolvedValue(userMoodData);

    const result = await get_moods();

    expect(result).toEqual(userMoodData);
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/fetch_user_moods",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  });

  it("check empty user moods", async () => {
    const token = "abc123";
    const userMoodData = {};
    localStorage.setItem("token", token);
    axios.get.mockResolvedValue(userMoodData);

    const result = await get_moods();

    expect(result).toEqual(userMoodData);
  });
});
