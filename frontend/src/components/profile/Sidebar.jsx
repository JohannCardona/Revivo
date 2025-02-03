import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{ height: "100%", borderRight: "2px solid white", width: 200 }}>
      <div className="side-menu">
        <li className="active">
          <Link to="/dashboard#mood_tracker">Mood Tracker</Link>
        </li>
        <li>
          <Link to="/dashboard#statistics">User Statistics</Link>
        </li>
      </div>
    </div>
  );
}

export default Sidebar;
