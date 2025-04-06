import axios from "axios";
import { fetchVideoCollection } from "./VideosApi";

jest.mock("axios");

describe("videos function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("return list of mental health videos", async () => {
    const token = "abc123";
    const videos = [
      {
        category: "Mindfulness and meditation",
        videos: [
          {
            video_title: "5-Minute Meditation You Can Do Anywhere",
            video_url: "https://www.youtube.com/embed/inpok4MKVLM",
          },
          {
            video_title:
              "How Mindfulness Changes The Emotional Life of Our Brains",
            video_url: "https://www.youtube.com/embed/7CBfCW67xT8",
          },
        ],
      },
    ];
    localStorage.setItem("token", token);
    axios.get.mockResolvedValue(videos);

    const result = await fetchVideoCollection();

    expect(result).toEqual(videos);
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/videos", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  });

  it("check empty videos list", async () => {
    const token = "abc123";
    const videos = [];
    localStorage.setItem("token", token);
    axios.get.mockResolvedValue(videos);

    const result = await fetchVideoCollection();

    expect(result).toEqual(videos);
  });
});
