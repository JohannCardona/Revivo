import React, { useState, useEffect } from "react";
import tips from "../json/categories.json";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/motivation/motivation.css";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../../images/meditation.svg";

const CategoryTips = () => {
  const fireAlert = (response, type, color) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    });
  };
  const fireAlertConfirm = (response, type, color) => {};
  const user = localStorage.getItem("user");
  const [currentTip, setCurrentTip] = useState("");
  const [favouriteTips, setFavouriteTips] = useState([]);
  const [tipTrack, setTipTrack] = useState(0);
  const { tipCategory } = useParams();
  const tipsData =
    tips.tips[tipCategory.charAt(0).toUpperCase() + tipCategory.slice(1)];

  const generateRandomTip = () => {
    const randomTip = Math.floor(Math.random() * tipsData.length);
    setCurrentTip(tipsData[randomTip]);
    setTipTrack(tipTrack + 1);
    const count = tipTrack + 1;
    axios.post(`http://localhost:5000/generate_tip_count`, {
      user,
      count,
    });
  };

  useEffect(() => {
    const fetch_category_tips = async () => {
      axios
        .get(`http://localhost:5000/fetch_category_tips/${tipCategory}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response.data.result);
          setFavouriteTips(response.data.result);
        });
    };
    fetch_category_tips();
  }, [tipCategory, currentTip, favouriteTips]);

  const store_category_tip = () => {
    if (currentTip && !favouriteTips.includes(currentTip)) {
      axios
        .post(`http://localhost:5000/store_tip/${tipCategory}`, {
          user,
          currentTip,
        })
        .then((response) => {
          console.log(response.data.result);
          fireAlert(response.data.result, "success", "green");
        });
    } else if (!currentTip) {
      fireAlert(
        `Please generate a tip before clicking on Add to Favourites`,
        "warning",
        "#50a081"
      );
    } else {
      fireAlert(`Tip is already stored: ${currentTip}`, "warning", "#50a081");
    }
  };

  const remove_category_tip = async (categoryTip) => {
    Swal.fire({
      title: `Do you want to remove: ${categoryTip}?`,
      confirmButtonText: "REMOVE",
      confirmButtonColor: "red",
      showCancelButton: true,
      cancelButtonText: "No",
      icon: "info",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/remove_favourite_tip/${tipCategory}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(categoryTip),
          })
          .then((response) => {
            if (response.status === 200) {
              fireAlert(response.data.result, "success", "green");
              setFavouriteTips(
                favouriteTips.filter((tip) => tip !== categoryTip)
              );
            }
          });
      } else if (result.isDismissed) {
      }
    });
  };

  return (
    <div className="category-tips-container">
      {favouriteTips.length === 0 ? (
        <>
          <div className="no-favourites-container">
            <div className="tips">
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
                  className="mood-submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={generateRandomTip}
                >
                  {tipTrack === 0 ? "Generate Tip" : "Generate Next Tip"}
                </motion.button>
                <motion.button
                  className="mood-submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={store_category_tip}
                >
                  Add to Favourites
                </motion.button>
              </div>
            </div>
            <img className="no-favourites" src={logo} alt="Tips Logo" />
          </div>
        </>
      ) : (
        <>
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
              className="mood-submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={generateRandomTip}
            >
              {tipTrack === 0 ? "Generate Tip" : "Generate Next Tip"}
            </motion.button>
            <motion.button
              className="mood-submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={store_category_tip}
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
                        onClick={() => remove_category_tip(favouriteTip)}
                      >
                        Remove
                      </motion.button>
                    </li>
                  </>
                ))}
              </ul>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryTips;
