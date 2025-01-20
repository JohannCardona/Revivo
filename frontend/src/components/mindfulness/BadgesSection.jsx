import React, { useState } from "react";
import "../../styles/motivation/mainbadges.css";

function BadgesSection() {
  const badgesInfo = [
    { id: 1, title: "Generated First Tip", unlocked: true },
    { id: 2, title: "Visit Mindfulness tips", unlocked: false },
    { id: 3, title: "Visit Acceptance tips", unlocked: false },
    { id: 4, title: "Stored 10 Tips", unlocked: true },
    { id: 5, title: "Visit Life tips", unlocked: false },
    { id: 6, title: "Visit Motivation tips", unlocked: false },
    { id: 7, title: "Stored 50 Tips", unlocked: true },
    { id: 8, title: "Visit Healing tips", unlocked: false },
    { id: 8, title: "Visit Love tips", unlocked: false },
  ];
  const [achievementBadges] = useState(badgesInfo);
  const badgesCompleted = achievementBadges.filter(
    (achievementBadge) => achievementBadge.unlocked
  ).length;
  const progress = (badgesCompleted / achievementBadges.length) * 100;
  return (
    <div style={{ padding: 20 }}>
      <h2
        style={{ borderBottom: "2px solid black", width: 245, marginTop: 20 }}
      >
        Achievement Badges
      </h2>
      <div className="achievement-badge-container">
        {achievementBadges.map((achievementBadge) => (
          <div
            key={achievementBadge.id}
            className={`badge-box ${
              achievementBadge.unlocked ? "badgeUnlocked" : "badgeLocked"
            }`}
          >
            <div className="badge-status-icon">
              {achievementBadge.unlocked ? "🏅" : "🔒"}
            </div>
            <p className="badge-name">{achievementBadge.title}</p>
          </div>
        ))}
      </div>
      <div className="badge-completion-progress">
        <p>
          {badgesCompleted} of {achievementBadges.length} Badges Unlocked
        </p>
      </div>
      <div>
        <p>
          Progress to Completing All Badges:{" "}
          {Math.min(progress, 100).toFixed(0)}%
        </p>
        <div
          style={{ width: "100%", backgroundColor: "#eee", borderRadius: "8px" }}
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
        {badgesCompleted.length > 0 ? (
          <ul>
            {badgesCompleted.map((unlockedBadge) => (
              <li key={unlockedBadge.id}>{unlockedBadge.title}</li>
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
