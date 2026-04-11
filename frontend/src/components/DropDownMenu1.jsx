import React from "react";
import { Link } from "react-router-dom";

function DropDownMenu1() {
  return (
    <div className="dropdown-menu">
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/badges">Badges</Link>
        </li>
      </ul>
    </div>
  );
}

export default DropDownMenu1;
