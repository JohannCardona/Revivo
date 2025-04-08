import React, { useEffect, useState } from "react";
import tipsContent from "../json/categories.json";
import "../../styles/banner/banner.css";
import Info from "../About/Info";

const Banner = () => {
  const [tipText, setTipText] = useState("");
  // Fetch tip categories JSON Object
  // Get random index from category list
  // From category list, get random index - tip text
  useEffect(() => {
    const tipCategories = Object.keys(tipsContent.tips);
    const todayDate = new Date().getDate();
    const tipTopicIndex = todayDate % tipCategories.length;
    const selectedTipTopic = tipCategories[tipTopicIndex];
    const tipsFromSelectedTopic = tipsContent.tips[selectedTipTopic];
    const tipIndex = todayDate % tipsFromSelectedTopic.length;
    const selectedTipText = tipsFromSelectedTopic[tipIndex];

    setTipText(selectedTipTopic + ": " + selectedTipText);
  }, []);

  return (
    <div className="banner-container">
      <h1 className="banner-title">
        <svg
          style={{ width: "14px", marginRight: "7px" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z" />
        </svg>
        Tip of the Day
      </h1>
      <p className="banner-text">{tipText}</p>
      <div className="info">
        <Info />
      </div>
    </div>
  );
};

export default Banner;
