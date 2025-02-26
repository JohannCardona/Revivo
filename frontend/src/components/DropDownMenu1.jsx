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
        <a href="/tips">
          <li>Thrive Tips</li>
        </a>
        <a href="/audios">
          <li>Soothing Audios</li>
        </a>
        <a href="/videos">
          <li>Videos</li>
        </a>
      </ul>
    </div>
  );
}

export default DropDownMenu1;
