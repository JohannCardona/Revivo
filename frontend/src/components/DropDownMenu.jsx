import React from "react";
import { Link } from "react-router-dom";

function DropDownMenu() {
  return (
    <div className="dropdown-menu">
      <ul>
        <li>
          <Link to="/tips">Thrive Tips</Link>
        </li>
        <li>
          <Link to="/audios">Soothing Audios</Link>
        </li>
        <li>
          <Link to="/videos">Videos</Link>
        </li>
      </ul>
    </div>
  );
}

export default DropDownMenu;
