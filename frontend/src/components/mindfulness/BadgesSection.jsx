import React, { useState, useEffect } from "react";
import "../../styles/motivation/mainbadges.css";
import axios from "axios";

function BadgesSection() {
  const tipCategories = [
    "Mindfulness",
    "Acceptance",
    "Life",
    "Love",
    "Healing",
    "Motivation",
  ];

  const [badgesInfo, setBadgesInfo] = useState([
    { id: 1, badgeName: "Generated First Tip", badgeUnlocked: false },
    { id: 2, badgeName: "Visit Mindfulness Tips", badgeUnlocked: false },
    { id: 3, badgeName: "Visit Acceptance Tips", badgeUnlocked: false },
    { id: 4, badgeName: "Stored 10 Tips", badgeUnlocked: false },
    { id: 5, badgeName: "Visit Life Tips", badgeUnlocked: false },
    { id: 6, badgeName: "Visit Motivation Tips", badgeUnlocked: false },
    { id: 7, badgeName: "Stored 50 Tips", badgeUnlocked: false },
    { id: 8, badgeName: "Visit Healing Tips", badgeUnlocked: false },
    { id: 9, badgeName: "Visit Love Tips", badgeUnlocked: false },
    { id: 10, badgeName: "Visited All Tip Categories", badgeUnlocked: false },
  ]);

  const [favouriteTips, setFavouriteTips] = useState(0);
  const [visitCategories, setVisitCategories] = useState([]);

  useEffect(() => {
    const fetch_all_favourite_tips = async () => {
      axios
        .get("http://localhost:5000/fetch_favourite_tips", {
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
    fetch_all_favourite_tips();
  }, []);

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
          setVisitCategories(categories);
          setBadgesInfo((badges) =>
            badges.map((badge) => {
              if (
                badge.badgeName === "Visit Mindfulness Tips" &&
                visitCategories.includes("mindfulness")
              ) {
                return { ...badge, badgeUnlocked: true };
              }
              if (
                badge.badgeName === "Visit Acceptance Tips" &&
                visitCategories.includes("acceptance")
              ) {
                return { ...badge, badgeUnlocked: true };
              }
              if (
                badge.badgeName === "Visit Life Tips" &&
                visitCategories.includes("life")
              ) {
                return { ...badge, badgeUnlocked: true };
              }
              if (
                badge.badgeName === "Visit Motivation Tips" &&
                visitCategories.includes("motivation")
              ) {
                return { ...badge, badgeUnlocked: true };
              }
              if (
                badge.badgeName === "Visit Healing Tips" &&
                visitCategories.includes("healing")
              ) {
                return { ...badge, badgeUnlocked: true };
              }
              if (
                badge.badgeName === "Visit Love Tips" &&
                visitCategories.includes("love")
              ) {
                return { ...badge, badgeUnlocked: true };
              }
              return badge;
            })
          );
        });
    };
    fetch_visited_categories();
  }, [visitCategories]);

  useEffect(() => {
    const fetch_tip_count = async () => {
      axios
        .get(`http://localhost:5000/fetch_tip_count`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response.data.result.count);
          const tipCount = response.data.result.count;
          setBadgesInfo((prevBadges) =>
            prevBadges.map((badge) => {
              if (badge.badgeName === "Generated First Tip" && tipCount >= 1) {
                return { ...badge, badgeUnlocked: true };
              }
              if (badge.badgeName === "Stored 10 Tips" && favouriteTips >= 10) {
                return { ...badge, badgeUnlocked: true };
              }
              if (badge.badgeName === "Stored 50 Tips" && favouriteTips >= 50) {
                return { ...badge, badgeUnlocked: true };
              }
              return badge;
            })
          );
        });
    };
    fetch_tip_count();
  }, [favouriteTips]);

  useEffect(() => {
    const test = visitCategories.length === tipCategories.length;
    console.log(test);
    if (visitCategories.length === tipCategories.length) {
      setBadgesInfo((prevBadges) =>
        prevBadges.map((badge) =>
          badge.badgeName === "Visited All Tip Categories"
            ? { ...badge, badgeUnlocked: true }
            : badge
        )
      );
    }
  }, [visitCategories.length, tipCategories.length]);

  console.log(badgesInfo);

  const badgesCompleted = badgesInfo.filter(
    (achievementBadge) => achievementBadge.badgeUnlocked
  ).length;
  const progress = (badgesCompleted / badgesInfo.length) * 100;
  const badgesCompletedList = badgesInfo.filter(
    (achievementBadge) => achievementBadge.badgeUnlocked
  );

  return (
    <div style={{ padding: 20 }}>
      <h2
        style={{ borderBottom: "2px solid black", width: 245, marginTop: 20 }}
      >
        Achievement Badges
      </h2>
      <div className="achievement-badge-container">
        {badgesInfo.map((achievementBadge) => (
          <div
            key={achievementBadge.id}
            className={`badge-box ${
              achievementBadge.badgeUnlocked ? "badgeUnlocked" : "badgeLocked"
            }`}
          >
            <div className="badge-status-icon">
              {achievementBadge.badgeUnlocked ? "🏅" : "🔒"}
            </div>
            <p className="badge-name">{achievementBadge.badgeName}</p>
          </div>
        ))}
      </div>
      <div className="badge-completion-progress">
        <p>
          {badgesCompleted} of {badgesInfo.length} Badges Unlocked
        </p>
      </div>
      <div>
        <p>
          Progress to Completing All Badges:{" "}
          {Math.min(progress, 100).toFixed(0)}%
        </p>
        <div
          style={{
            width: "100%",
            backgroundColor: "#eee",
            borderRadius: "8px",
          }}
          className="main-progress-bar-container"
        >
          <div
            style={{
              width: `${progress}%`,
              height: "10px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-navbar)",
            }}
            className="progress-bar"
          ></div>
        </div>
      </div>
      <div className="unlocked-badges">
        <h3 style={{ marginTop: 30 }}>Unlocked Badges:</h3>
        {badgesCompletedList.length ? (
          <ul>
            {badgesCompletedList.map((unlockedBadge) => (
              <li key={unlockedBadge.id}>{unlockedBadge.badgeName}</li>
            ))}
          </ul>
        ) : (
          <p>No badges unlocked yet.</p>
        )}
      </div>
    </div>
  );
}

export default BadgesSection;
