import axios from "axios";
import { store_tip } from "./TipAPI";

jest.mock("axios");

describe("store tip function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("store tip for specific category", async () => {
    const token = "abc123";
    const user = "testuser";
    const currentTip = "Hello world";
    const tipCategory = "motivation";
    const response = {
      data: { result: `Tip stored successfully for category: ${tipCategory}` },
    };
    localStorage.setItem("token", token);
    axios.post.mockResolvedValue(response);
    const result = await store_tip(user, currentTip, tipCategory);

    expect(axios.post).toHaveBeenCalledWith(
      `http://localhost:5000/store_tip/${tipCategory}`,
      { user, currentTip },
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
