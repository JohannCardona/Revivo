import React, { useEffect, useState } from "react";
import VideoLibrary from "./VideoLibrary";
import axios from "axios";

function VideoMain() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideoCollection = async () => {
      await axios
        .get("http://localhost:5000/videos", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setVideos(response.data);
        });
    };
    fetchVideoCollection();
  }, []);

  return (
    <div>
      <VideoLibrary videoCollection={videos} />
    </div>
  );
}

export default VideoMain;
