import React from "react";

function DropDownMenu1() {
  return (
    <div className="dropdown-menu">
      <ul
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          background: "white",
          color: "black",
          listStyle: "none",
          padding: "10px 0",
          margin: 0,
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          minWidth: "140px",
        }}
      >
        <a href="/dashboard">
          <li>Dashboard</li>
        </a>
        <a href="/badges">
          <li>Badges</li>
        </a>
      </ul>
    </div>
  );
}

export default DropDownMenu1;
