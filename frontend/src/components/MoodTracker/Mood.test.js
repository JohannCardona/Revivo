import axios from "axios";
import { get_moods } from "./MoodAPI";

jest.mock("axios");

describe("fetch mood function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
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
