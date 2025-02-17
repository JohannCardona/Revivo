import React, { useState } from "react";
import "../../styles/motivation/audiossidebar.css";

function AudiosSidebar() {
  const [menuGroups, setMenuGroups] = useState({
    corePractices: false,
    dailySupport: false,
    ambientInstrumental: false,
  });
  const handleMenuGroupToggle = (group) => {
    setMenuGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };
  const core_practices = [
    "Meditation Audios",
    "Mindfulness Audios",
    "EMotional Regulation Audios",
  ];

  const daily_support = [
    "Anxiety Relief Audios",
    "Stress Management Audios",
    "Sleep Improvement Audios",
    "Focus & Concentration Audios",
    "Self-Care & Affirmation Audios",
    "Resilience & Empowerment Audios",
    "Emotional Healing Audios",
    "Gratitude & Positivity Audios",
    "Mind-Body Connection Audios",
  ];

  const ambient = [
    "Nature Sounds",
    "White/Brown/Pink Noise",
    "Meditative & Instrumental Sounds",
  ];

  return (
    <div className="audiossidebar-container">
      <div
        className="group-title"
        onMouseEnter={() => handleMenuGroupToggle("corePractices")}
        onMouseLeave={() => handleMenuGroupToggle("corePractices")}
      >
        Core Practices
        <span
          className={`group-category-list-toggle-icon ${
            menuGroups.corePractices ? "open" : "close"
          }`}
        >
          ▶
        </span>
      </div>
      <ul
        className={`group-category-list ${
          menuGroups.corePractices ? "open" : "close"
        }`}
        onMouseEnter={() => handleMenuGroupToggle("corePractices")}
        onMouseLeave={() => handleMenuGroupToggle("corePractices")}
      >
        {core_practices.map((item, key) => (
          <a
            href={`#${item.toLowerCase()}`}
            key={key}
            className="category-list-item"
          >
            {item}
          </a>
        ))}
      </ul>
      <div
        className="group-title"
        onMouseEnter={() => handleMenuGroupToggle("dailySupport")}
        onMouseLeave={() => handleMenuGroupToggle("dailySupport")}
      >
        Daily Support
        <span
          className={`group-category-list-toggle-icon ${
            menuGroups.dailySupport ? "open" : "close"
          }`}
        >
          ▶
        </span>
      </div>
      <ul
        className={`group-category-list ${
          menuGroups.dailySupport ? "open" : "close"
        }`}
        onMouseEnter={() => handleMenuGroupToggle("dailySupport")}
        onMouseLeave={() => handleMenuGroupToggle("dailySupport")}
      >
        {daily_support.map((item, key) => (
          <a
            href={`#${item.toLowerCase()}`}
            key={key}
            className="category-list-item"
          >
            {item}
          </a>
        ))}
      </ul>
      <div className="group-category-list"></div>
      <div
        className="group-title"
        onMouseEnter={() => handleMenuGroupToggle("ambientInstrumental")}
        onMouseLeave={() => handleMenuGroupToggle("ambientInstrumental")}
      >
        Ambient & Instrumental
        <span
          className={`group-category-list-toggle-icon ${
            menuGroups.ambientInstrumental ? "open" : "close"
          }`}
        >
          ▶
        </span>
      </div>
      <div className="group-category-list"></div>
      <ul
        className={`group-category-list ${
          menuGroups.ambientInstrumental ? "open" : "close"
        }`}
        onMouseEnter={() => handleMenuGroupToggle("ambientInstrumental")}
        onMouseLeave={() => handleMenuGroupToggle("ambientInstrumental")}
      >
        {ambient.map((item, key) => (
          <a
            href={`#${item.toLowerCase()}`}
            key={key}
            className="category-list-item"
          >
            {item}
          </a>
        ))}
      </ul>
    </div>
  );
}

export default AudiosSidebar;
