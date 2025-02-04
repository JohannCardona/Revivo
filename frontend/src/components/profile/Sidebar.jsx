import React from "react";
import { Link } from "react-router-dom";
import "../../styles/dashboard/sidebar.css";

function Sidebar() {
  return (
    <div style={{ height: "100%", borderRight: "2px solid white", width: 200 }}>
      <div style={{ padding: "60px 20px" }} className="side-menu">
        <li>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: 18,
            }}
            to="/dashboard#mood_tracker"
          >
            Mood Tracker
          </Link>
        </li>
        <li>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: 18,
            }}
            to="/dashboard#statistics"
          >
            User Statistics
          </Link>
        </li>
      </div>
    </div>
  );
}

export default Sidebar;
