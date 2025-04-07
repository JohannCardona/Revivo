import axios from "axios";
import { fetch_chatbot_response } from "./ResponseType";
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
