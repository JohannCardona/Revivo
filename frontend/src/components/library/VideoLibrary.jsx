import React, { useState } from "react";
import "../../styles/library/library.css";
import { ColorRing } from "react-loader-spinner";

const VideoLibrary = ({ videoCollection }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="video-library-container">
      <h1>
        {!selectedVideo ? "Mental Health Video Library" : "Playing for You"}
      </h1>
      {!selectedVideo ? (
        <div className="video-category-container">
          {videoCollection.length === 0 ? (
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#50a081", "#587bda", "#50a081", "#587bda", "#50a081"]}
            />
          ) : (
            videoCollection.map((videoCategory, i) => (
              <div key={i} className="video-category-section">
                <h2>{videoCategory.category}</h2>
                <ul className="video-category-list">
                  {videoCategory.videos.map((video_item, id) => (
                    <li key={id} className="video-category-item">
                      <button
                        onClick={() => setSelectedVideo(video_item.video_url)}
                        className="video-title"
                      >
                        {video_item.video_title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="video-container">
          <div className="video-section">
            <iframe
              title="mental health support video"
              src={selectedVideo}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setSelectedVideo(null)}
              className="video-back-button"
            >
              Back to Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;
