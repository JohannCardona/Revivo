import React, { useEffect, useState } from "react";
import VideoLibrary from "./VideoLibrary";
import { fetchVideoCollection } from "./VideosApi";

function VideoMain() {
  const [videos, setVideos] = useState([]);

  const get_videos = async () => {
    const fetched_videos = await fetchVideoCollection();
    setVideos(fetched_videos.data);
  }

  useEffect(() => {
    get_videos();
  }, []);

  return (
    <div>
      <VideoLibrary videoCollection={videos} />
    </div>
  );
}

export default VideoMain;
