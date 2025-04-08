import React, { useState } from "react";
import "../../styles/motivation/audiossidebar.css";

function AudiosSidebar() {
  // Sidebar menus closed by default
  const [menuGroups, setMenuGroups] = useState({
    corePractices: false,
    dailySupport: false,
    ambientInstrumental: false,
  });

  const handleMenuGroupToggle = (group) => {
    setMenuGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const core_practices = [
    { name: "Meditation Audios", link: "meditation" },
    { name: "Mindfulness Audios", link: "mindfulness" },
    { name: "Emotional Regulation Audios", link: "emotional-regulation" },
  ];

  const daily_support = [
    { name: "Anxiety Relief Audios", link: "anxiety-relief" },
    { name: "Stress Management Audios", link: "stress-management" },
    { name: "Sleep Improvement Audios", link: "sleep-improvement" },
    { name: "Focus & Concentration Audios", link: "focus-concentration" },
    { name: "Self-Care & Affirmation Audios", link: "self-care-affirmations" },
    { name: "Resilience & Empowerment Audios", link: "resilience-empowerment" },
    { name: "Emotional Healing Audios", link: "emotional-healing" },
    { name: "Gratitude & Positivity Audios", link: "gratitude-positivity" },
    { name: "Mind-Body Connection Audios", link: "mind-body" },
  ];

  const ambient = [
    { name: "Nature Sounds", link: "nature" },
    { name: "White/Brown/Pink Noise", link: "noise" },
    {
      name: "Meditative & Instrumental Sounds",
      link: "meditative_instrumental",
    },
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
            href={`#${item.link.toLowerCase()}`}
            key={key}
            className="category-list-item"
          >
            {item.name}
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
            href={`#${item.link.toLowerCase()}`}
            key={key}
            className="category-list-item"
          >
            {item.name}
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
            href={`#${item.link.toLowerCase()}`}
            key={key}
            className="category-list-item"
          >
            {item.name}
          </a>
        ))}
      </ul>
    </div>
  );
}

export default AudiosSidebar;
