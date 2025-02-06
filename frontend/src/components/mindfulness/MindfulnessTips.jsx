import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tipsData from "../json/categories.json";
import Mindfulness from "../../images/mindfulness.webp";
import Acceptance from "../../images/acceptance.webp";
import Life from "../../images/life.webp";
import Motivation from "../../images/motivation.webp";
import Healing from "../../images/healing.webp";
import Love from "../../images/love.webp";
import "../../styles/motivation/mindfulnesstips.css";
import axios from "axios";

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
  const [visitedCategories, setVisitedCategories] = useState([]);

  useEffect(() => {
    const fetch_visited_categories = async () => {
      axios
        .get(`http://localhost:5000/fetch_visited_categories`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          const categories = response.data.result.map(
            (item) => item.tipCategory
          );
          setVisitedCategories(categories);
        });
    };
    fetch_visited_categories();
  }, []);

  const user = localStorage.getItem("user");
  const handleTipCategorySelect = (tipCategory) => {
    if (visitedCategories.includes(tipCategory)) {
      alert(`${tipCategory} already visited!`);
      navigate(`/tips/${tipCategory}`);
    } else {
      axios
        .post(`http://localhost:5000/category_click_count`, {
          user,
          tipCategory,
        })
        .then((response) => {
          console.log(response.data.result);
        });
      navigate(`/tips/${tipCategory}`);
    }
  };

  return (
    <div className="tips-container">
      <div className="inner-container">
        <h1
          style={{
            borderBottom: "2px solid var(--sidebar-text)",
          }}
        >
          Discover Tips for a Better You
        </h1>
        <h3
          style={{
            color: "var(--text)",
          }}
        >
          Life, Motivation, Mindfulness, Acceptance, and More - Your Guide
          Awaits
        </h3>
        <p
          style={{
            color: "var(--text)",
          }}
        >
          Explore insightful tips on motivation and mindfulness to help you
          grow. Click on a box below for actionable steps toward
          self-improvement, with even more to explore beyond these core areas.
        </p>
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
              <h2 style={{ color: "white" }}>{tipCategory}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MindfulnessTips;
