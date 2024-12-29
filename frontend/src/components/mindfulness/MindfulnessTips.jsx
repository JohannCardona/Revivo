import React from "react";
import { useNavigate } from "react-router-dom";
import tipsData from "../json/categories.json";
import Mindfulness from "../../images/mindfulness.webp";
import Acceptance from "../../images/acceptance.webp";
import Life from "../../images/life.webp";
import Motivation from "../../images/motivation.webp";
import Healing from "../../images/healing.webp";
import Love from "../../images/love.webp";
import "../../styles/motivation/mindfulnesstips.css";

// Mindfulness: A serene individual meditating by a calm lake at sunrise.
// Motivation: A climber triumphantly reaching the summit of a mountain.
// Life: A grand tree surrounded by diverse life and a nostalgic swing.
// Love: Two hands reaching for each other with a glowing heart in between.
// Healing: A person sitting in a meadow filled with flowers and butterflies, basking in sunlight.
// Acceptance: An open hand holding a blooming lotus flower against a calming background.
const tipCategoryImg = {
  Mindfulness: Mindfulness,
  Acceptance: Acceptance,
  Life: Life,
  Motivation: Motivation,
  Healing: Healing,
  Love: Love,
};

const MindfulnessTips = () => {
  const navigate = useNavigate();
  const handleTipCategorySelect = (tipCategory) => {
    navigate(`/tips/${tipCategory}`);
  };
  return (
    <div className="tips-container">
      <h1>Choose a Category</h1>
      <div className="category-grid">
        {tipsData.category.map((tipCategory) => (
          <div
            className="category-grid-item"
            key={tipCategory}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${tipCategoryImg[tipCategory]})`,
            }}
            onClick={() => handleTipCategorySelect(tipCategory.toLowerCase())}
          >
            <h2>{tipCategory}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MindfulnessTips;
