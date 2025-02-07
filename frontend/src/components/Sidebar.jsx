import React from "react";
import { Link } from "react-router-dom";
import "../styles/motivation/sidebar.css";

function Sidebar({ sidebar_links }) {
  return (
    <div style={{ height: "100%", borderRight: "2px solid white", width: 250 }}>
      <div style={{ padding: "60px 20px" }} className="side-menu">
        {sidebar_links.map((item, key) => (
          <li key={key}>
            <Link
              style={{
                textDecoration: "none",
                color: "white",
              }}
              to={item.to}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
