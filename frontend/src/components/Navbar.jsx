import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import revivo from "../images/revivo_logo.png";
import { ThemeContext } from "./Theme/Theme";
import "../styles/navbar/Navbar.css";
import DropDownMenu from "./DropDownMenu";
import DropDownMenu1 from "./DropDownMenu1";

function Navbar() {
  const { toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const buttons = [
    { text: "Chatbot", to: "/chat" },
    { text: "Mood Tracker", to: "/mood" },
  ];

  const logout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "You have successfully logged out of the application",
      confirmButtonText: "OK",
      confirmButtonColor: "#5995fd",
      icon: "success",
    }).then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    });
  };

  const user = localStorage.getItem("token");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isDropdownVisible1, setDropdownVisible1] = useState(false);

  return (
    <div className="navigation-bar">
      <AppBar position="static">
        <Toolbar
          style={{
            backgroundColor: "var(--navbar)",
            borderBottom: "2px solid white",
            boxShadow: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <NavLink to={user ? "/chat" : "/"}>
              <img
                style={{
                  width: 110,
                  height: 80,
                  margin: "-3px 0 0 -20px",
                  display: "flex",
                  cursor: "pointer",
                }}
                src={revivo}
                alt="revivo icon"
              />
            </NavLink>
          </Typography>
          <Button
            component={Link}
            to={"/about"}
            color="inherit"
            style={{ cursor: "pointer" }}
            sx={{
              "&:hover": {
                backgroundColor: "var(--navbar)",
              },
            }}
          >
            About
          </Button>
          {user &&
            buttons.map((button) => (
              <Button
                key={button.text}
                component={Link}
                to={button.to}
                color="inherit"
                sx={{
                  "&:hover": {
                    backgroundColor: "var(--navbar)",
                  },
                }}
              >
                {button.text}
              </Button>
            ))}
          {user && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{ position: "relative" }}
                className="menu"
                onMouseEnter={() => setDropdownVisible(true)}
                onMouseLeave={() => setDropdownVisible(false)}
              >
                <button className="button-nav">Usage</button>
                {isDropdownVisible && <DropDownMenu />}
              </div>
              <div
                style={{ position: "relative" }}
                className="menu"
                onMouseEnter={() => setDropdownVisible1(true)}
                onMouseLeave={() => setDropdownVisible1(false)}
              >
                <button className="button-nav">Library</button>
                {isDropdownVisible1 && <DropDownMenu1 />}
              </div>
            </div>
          )}
          {user && (
            <Button
              sx={{
                "&:hover": {
                  backgroundColor: "var(--navbar)",
                },
              }}
              color="inherit"
              data-testid={"logout-btn"}
              onClick={logout}
            >
              Logout
            </Button>
          )}
          <nav>
            <input
              type="checkbox"
              id="theme-toggle"
              onChange={toggleTheme}
              hidden
            />
            <label htmlFor="theme-toggle" className="theme-toggle"></label>
          </nav>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
