import React, { useState, useEffect } from "react";
import "../../styles/about/info.css";

const Info = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

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
            <p>Here's how you can interact with the chatbot:</p>
            <ul>
              <li>
                <strong>General Conversation:</strong> Enjoy a normal chat with the bot.
              </li>
              <li>
                <strong>Artistic Image Generation:</strong> To create artistic images
                using DALL-E, include both <code>generate</code> and <code>image</code> in
                your message.
              </li>
              <li>
                <strong>Music Recommendations:</strong> For music suggestions from
                Spotify, include keywords such as <code>songs</code>, <code>music</code>,{" "}
                <code>recommend song</code>, or <code>other songs</code>.
              </li>
              <li>
                <strong>Ending the Conversation:</strong> Use <code>goodbye</code>,{" "}
                <code>bye</code>, <code>bye bye</code>, <code>see you</code>,{" "}
                <code>see ya</code>, <code>end</code>, or <code>exit</code> when you
                want to end the chat.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Info;
