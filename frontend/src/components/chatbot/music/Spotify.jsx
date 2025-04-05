import React from "react";

function Spotify({ conversation }) {
  return (
    <div>
      <>
        <iframe
          title="recommender"
          style={{ borderRadius: "12px" }}
          src={conversation.response}
          width="100%"
          height="352"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </>
    </div>
  );
}

export default Spotify;
