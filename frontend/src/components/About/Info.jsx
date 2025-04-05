import React, { useState } from "react";
import "../../styles/about/info.css";

const Info = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="tooltip-container">
      <div className="tooltip" onClick={openModal}>
        Chatbot Tips
        <span className="tooltiptext">
          Learn what you can do with the chatbot
        </span>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
              &times;
            </button>
            <h2>Chatbot Capabilities</h2>
            <p style={{ color: "var(--text)" }}>
              Here's how you can interact with the chatbot:
            </p>
            <ul>
              <li>
                <strong style={{ marginRight: "5px" }}>
                  General Conversation:{" "}
                </strong>{" "}
                Enjoy a normal chat with the bot.
              </li>
              <li>
                <strong style={{ marginRight: "5px" }}>
                  Artistic Image Generation:{" "}
                </strong>{" "}
                To create artistic images using DALL-E, include both{" "}
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  generate
                </code>{" "}
                and{" "}
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  image
                </code>{" "}
                in your message.
              </li>
              <li>
                <strong style={{ marginRight: "5px" }}>
                  Music Recommendations:{" "}
                </strong>{" "}
                For music suggestions from Spotify, include keywords such as{" "}
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  songs
                </code>
                ,{" "}
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  music
                </code>
                ,
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  recommend song
                </code>
                , or <code style={{ marginLeft: "4px" }}>other songs</code>.
              </li>
              <li>
                <strong style={{ marginRight: "5px" }}>
                  Ending the Conversation:{" "}
                </strong>{" "}
                Use{" "}
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  goodbye
                </code>
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  bye
                </code>
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  bye bye
                </code>
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  see you
                </code>
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  see ya
                </code>{" "}
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  end
                </code>
                or
                <code style={{ marginRight: "4px", marginLeft: "4px" }}>
                  exit
                </code>{" "}
                when you want to end the chat.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Info;
