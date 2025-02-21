import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../../styles/about/about.css";
import chatbot from "../../images/chatbot.jpg";
import mood from "../../images/mood.jpg";
import dashboard from "../../images/dashboard.jpg";
import badges from "../../images/badges.jpg";
import tips from "../../images/tips.jpg";
import audios from "../../images/audios.jpg";
import videos from "../../images/videos.jpg";

function About() {
  const [clickedImage, setClickedImage] = useState(null);
  const modalClose = () => {
    setClickedImage(null);
  };
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Revivo</h1>
        <p>Your journey to better mental well-being starts here.</p>
      </header>

      <section className="feature-section">
        <img
          src={chatbot}
          alt="Chatbot Support"
          className="feature-image"
          onClick={() => setClickedImage(chatbot)}
        />
        {clickedImage && (
          <div className="modal-container">
            <div className="modal-image">
              <CloseIcon
                sx={{ fontSize: 40 }}
                onClick={() => modalClose(chatbot)}
              />
            </div>
            <div className="download-container">
              <img src={clickedImage} alt="enlarged" />
            </div>
          </div>
        )}
        <div className="feature-content">
          <h2>Chatbot</h2>
          <p>
            Our interactive chatbot is designed to provide support whenever you
            need it. Whether you're feeling overwhelmed or simply need someone
            to talk to, our bot offers guidance and a compassionate ear.
          </p>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-content">
          <h2>Mood Tracking</h2>
          <p>
            Track your daily mood and gain insights over time. Our mood tracker
            helps you record and analyze your feelings, making it easier to
            recognize patterns and manage your emotional well-being.
          </p>
        </div>
        <img
          src={mood}
          alt="Mood Tracking"
          className="feature-image"
          onClick={() => setClickedImage(mood)}
        />
        {clickedImage && (
          <div className="modal-container">
            <div className="modal-image">
              <CloseIcon
                sx={{ fontSize: 40 }}
                onClick={() => modalClose(mood)}
              />
            </div>
            <div className="download-container">
              <img src={clickedImage} alt="enlarged" />
            </div>
          </div>
        )}
      </section>

      <section className="feature-section">
        <img
          src={dashboard}
          alt="Dashboard Overview"
          className="feature-image"
          onClick={() => setClickedImage(dashboard)}
        />
        {clickedImage && (
          <div className="modal-container">
            <div className="modal-image">
              <CloseIcon
                sx={{ fontSize: 40 }}
                onClick={() => modalClose(dashboard)}
              />
            </div>
            <div className="download-container">
              <img src={clickedImage} alt="enlarged" />
            </div>
          </div>
        )}
        <div className="feature-content">
          <h2>Dashboard</h2>
          <p>
            Get a comprehensive overview of your progress and app features with
            our modern dashboard. Monitor your mood trends, access the latest
            advice, and navigate through all the tools with ease.
          </p>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-content">
          <h2>Achievement Badges</h2>
          <p>
            Celebrate your progress with our Achievements page. Earn badges and
            track milestones as you complete tasks, maintain healthy habits, and
            advance on your journey towards improved mental health.
          </p>
        </div>
        <img
          src={badges}
          alt="Achievements"
          className="feature-image"
          onClick={() => setClickedImage(badges)}
        />
        {clickedImage && (
          <div className="modal-container">
            <div className="modal-image">
              <CloseIcon
                sx={{ fontSize: 40 }}
                onClick={() => modalClose(badges)}
              />
            </div>
            <div className="download-container">
              <img src={clickedImage} alt="enlarged" />
            </div>
          </div>
        )}
      </section>

      <section className="feature-section">
        <img
          src={tips}
          alt="Advice"
          className="feature-image"
          onClick={() => setClickedImage(tips)}
        />
        {clickedImage && (
          <div className="modal-container">
            <div className="modal-image">
              <CloseIcon
                sx={{ fontSize: 40 }}
                onClick={() => modalClose(tips)}
              />
            </div>
            <div className="download-container">
              <img src={clickedImage} alt="enlarged" />
            </div>
          </div>
        )}
        <div className="feature-content">
          <h2>Tips</h2>
          <p>
            Explore practical advice and tips curated by mental health
            professionals. Our advice section is designed to empower you with
            useful strategies and information for daily well-being.
          </p>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-content">
          <h2>Audios</h2>
          <p>
            Relax and rejuvenate with our collection of soothing audio tracks.
            From guided meditations to calming soundscapes, discover the perfect
            audio to help center your mind.
          </p>
        </div>
        <img
          src={audios}
          alt="Audios"
          className="feature-image"
          onClick={() => setClickedImage(audios)}
        />
        {clickedImage && (
          <div className="modal-container">
            <div className="modal-image">
              <CloseIcon
                sx={{ fontSize: 40 }}
                onClick={() => modalClose(audios)}
              />
            </div>
            <div className="download-container">
              <img src={clickedImage} alt="enlarged" />
            </div>
          </div>
        )}
      </section>

      <section className="feature-section">
        <img
          src={videos}
          alt="Videos"
          className="feature-image"
          onClick={() => setClickedImage(videos)}
        />
        {clickedImage && (
          <div className="modal-container">
            <div className="modal-image">
              <CloseIcon
                sx={{ fontSize: 40 }}
                onClick={() => modalClose(videos)}
              />
            </div>
            <div className="download-container">
              <img src={clickedImage} alt="enlarged" />
            </div>
          </div>
        )}
        <div className="feature-content">
          <h2>Videos</h2>
          <p>
            Engage with expert advice and inspiring content through our video
            library. Watch insightful videos that provide tips, strategies, and
            personal stories to support your mental health journey.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
