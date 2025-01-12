import React, { useState } from "react";
import tips from "../json/categories.json";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/motivation/motivation.css";

const CategoryTips = () => {
  const [currentTip, setCurrentTip] = useState("");
  const [favouriteTips, setFavouriteTips] = useState([]);
  const { tipCategory } = useParams();
  const tipsData =
    tips.tips[tipCategory.charAt(0).toUpperCase() + tipCategory.slice(1)];

  const generateRandomTip = () => {
    const randomTip = Math.floor(Math.random() * tipsData.length);
    setCurrentTip(tipsData[randomTip]);
  };

  const addTipToFavourites = () => {
    if (currentTip && !favouriteTips.includes(currentTip)) {
      setFavouriteTips([...favouriteTips, currentTip]);
    }
  };

  const removeTipFromFavourites = (removeTip) => {
    setFavouriteTips(favouriteTips.filter((tip) => tip !== removeTip));
  };

  return (
    <div className="category-tips-container">
      <h1 className="category-tips-container-heading">
        {tipCategory.toUpperCase()} Tips
      </h1>
      <div className="current-tip-container">
        {!currentTip ? (
          <p>Click the button to generate a tip!</p>
        ) : (
          <p>{currentTip}</p>
        )}
      </div>
      <div className="tips-container-buttons">
        <motion.button
          className="tip-container-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={generateRandomTip}
        >
          Generate Tip
        </motion.button>
        <motion.button
          className="tip-container-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={addTipToFavourites}
        >
          Add to Favourites
        </motion.button>
      </div>
      {favouriteTips.length > 0 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          initial={{ opacity: 0, y: -20 }}
          className="favourite-tips-container"
        >
          <h2 className="favourite-tips-container-heading">
            Your Favourite Tips
          </h2>
          <ul className="favourite-tips-list">
            {favouriteTips.map((favouriteTip, i) => (
              <>
                <li key={i} className="favourite-tip-item">
                  {favouriteTip}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="remove-favourite-tip-button"
                    onClick={() => removeTipFromFavourites(favouriteTip)}
                  >
                    Remove
                  </motion.button>
                </li>
              </>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryTips;
