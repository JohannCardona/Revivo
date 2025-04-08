import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../../styles/about/about.css";
import chatbot from "../../images/chat.jpg";
import mood from "../../images/emoji.jpg";
import dashboard from "../../images/stats.jpg";
import badges from "../../images/badges.jpg";
import tips from "../../images/tip.jpg";
import audios from "../../images/audios.jpg";
import videos from "../../images/videos.jpg";

function About() {
  const [clickedImage, setClickedImage] = useState(null);
  const modalClose = () => {
    setClickedImage(null);
  };

  const about_details = [
    {
      id: 1,
      src: chatbot,
      alt: "Chatbot",
      title: "Chatbot",
      text: "Our interactive chatbot is designed to provide support whenever you need it. Whether you're feeling overwhelmed or simply need someone to talk to, our bot offers guidance and a compassionate ear.",
    },
    {
      id: 2,
      src: mood,
      alt: "Mood Tracking",
      title: "Mood Tracking",
      text: "Our interactive chatbot is designed to provide support whenever you need it. Whether you're feeling overwhelmed or simply need someone to talk to, our bot offers guidance and a compassionate ear.",
    },
    {
      id: 3,
      src: dashboard,
      alt: "Dashboard",
      title: "Dashboard",
      text: "Our interactive chatbot is designed to provide support whenever you need it. Whether you're feeling overwhelmed or simply need someone to talk to, our bot offers guidance and a compassionate ear.",
    },
    {
      id: 4,
      src: badges,
      alt: "Achievement Badges",
      title: "Achievement Badges",
      text: "Our interactive chatbot is designed to provide support whenever you need it. Whether you're feeling overwhelmed or simply need someone to talk to, our bot offers guidance and a compassionate ear.",
    },
    {
      id: 5,
      src: tips,
      alt: "Tips",
      title: "Tips",
      text: "Our interactive chatbot is designed to provide support whenever you need it. Whether you're feeling overwhelmed or simply need someone to talk to, our bot offers guidance and a compassionate ear.",
    },
    {
      id: 6,
      src: audios,
      alt: "Audios",
      title: "Audios",
      text: "Our interactive chatbot is designed to provide support whenever you need it. Whether you're feeling overwhelmed or simply need someone to talk to, our bot offers guidance and a compassionate ear.",
    },
    {
      id: 7,
      src: videos,
      alt: "Videos",
      title: "Videos",
      text: "Our interactive chatbot is designed to provide support whenever you need it. Whether you're feeling overwhelmed or simply need someone to talk to, our bot offers guidance and a compassionate ear.",
    },
  ];

  const ab = about_details.map((item) => item.src);
  console.log(ab);

  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Revivo</h1>
        <p>
          Your journey to better mental well-being starts here. Click on the
          preview images to enlarge them and explore the feature in detail.
        </p>
      </header>

      {about_details.map((item) => (
        <section key={item.id} className="feature-section">
          {item.id % 2 !== 0 ? (
            <>
              <img
                src={item.src}
                alt={item.alt}
                className="feature-image"
                onClick={() => setClickedImage(item.src)}
              />
              {clickedImage && (
                <div className="modal-container">
                  <div className="modal-image">
                    <CloseIcon
                      sx={{ fontSize: 40 }}
                      onClick={() => modalClose(item.src)}
                    />
                  </div>
                  <div className="download-container">
                    <img src={clickedImage} alt="enlarged" />
                  </div>
                </div>
              )}
              <div className="feature-content">
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </>
          ) : (
            <>
              <div className="feature-content">
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
              <img
                src={item.src}
                alt={item.alt}
                className="feature-image"
                onClick={() => setClickedImage(item.src)}
              />
              {clickedImage && (
                <div className="modal-container">
                  <div className="modal-image">
                    <CloseIcon
                      sx={{ fontSize: 40 }}
                      onClick={() => modalClose(item.src)}
                    />
                  </div>
                  <div className="download-container">
                    <img src={clickedImage} alt="enlarged" />
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      ))}
    </div>
  );
}

export default About;
