import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    document.body.style.overflow = clickedImage ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [clickedImage]);

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
      text: "Log how you're feeling each day and build a clearer picture of your emotional patterns over time. Mood Tracking helps you identify triggers, celebrate good days, and notice when you might need extra support.",
    },
    {
      id: 3,
      src: dashboard,
      alt: "Dashboard",
      title: "Dashboard",
      text: "Your personal wellbeing hub. The Dashboard brings together your mood history, activity streaks, and progress insights in one place so you can see how far you've come at a glance.",
    },
    {
      id: 4,
      src: badges,
      alt: "Achievement Badges",
      title: "Achievement Badges",
      text: "Every step forward deserves recognition. Earn badges as you hit milestones — from your first mood log to weeks of consistent check-ins — and stay motivated on your mental wellness journey.",
    },
    {
      id: 5,
      src: tips,
      alt: "Tips",
      title: "Tips",
      text: "Browse a curated library of bite-sized mental health tips covering mindfulness, sleep, stress management, and more. New tips are surfaced regularly so there's always something fresh to try.",
    },
    {
      id: 6,
      src: audios,
      alt: "Audios",
      title: "Audios",
      text: "Unwind with guided meditations, breathing exercises, and calming soundscapes. Our audio collection is designed to help you decompress and find stillness whenever life gets loud.",
    },
    {
      id: 7,
      src: videos,
      alt: "Videos",
      title: "Videos",
      text: "Watch short, expert-led videos on topics like anxiety, self-care, and building healthy habits. Whether you have five minutes or an hour, there's always something meaningful to watch.",
    },
  ];

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
        <section
          key={item.id}
          className={`feature-section${item.id % 2 === 0 ? " feature-section--reverse" : ""}`}
        >
          <img
            src={item.src}
            alt={item.alt}
            className={`feature-image${clickedImage === item.src ? " feature-image--active" : ""}`}
            onClick={() => setClickedImage(item.src)}
          />
          <div className="feature-content">
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </div>
        </section>
      ))}

      {clickedImage && (
        <div className="modal-overlay" onClick={() => setClickedImage(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <CloseIcon
              className="modal-close"
              sx={{ fontSize: 36 }}
              onClick={() => setClickedImage(null)}
            />
            <img src={clickedImage} alt="enlarged" className="modal-img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default About;
