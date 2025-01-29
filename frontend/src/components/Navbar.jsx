import React, { useContext } from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import revivo from "../images/Logo1.png";
import { ThemeContext } from "./Theme/Theme";
import "../styles/navbar/Navbar.css";

function Navbar() {
  const { toggleTheme } = useContext(ThemeContext);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const navigate = useNavigate();
  const buttons = [
    { text: "Chatbot", to: "/chat" },
    { text: "Dashboard", to: "/dashboard" },
    {text: "Badges", to: "/badges"},
    { text: "Thrive Tips", to: "/tips" },
    { text: "Soothing Sounds", to: "/audios" },
    { text: "Library", to: "/library" },
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

  return (
    <div className="navigation-bar">
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: "var(--bg-navbar)" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <NavLink  to={user ? "/chat" : "/"}>
              <img
                style={{
                  width: 80,
                  height: 64,
                  margin: "0 0 0 -23px",
                  display: "flex",
                  cursor: "pointer",
                }}
                src={revivo}
                alt="revivo icon"
              />
            </NavLink>
          </Typography>
          {localStorage.getItem("token")
            ? buttons.map((button) => {
                return (
                  <Button
                    key={button.text}
                    component={Link}
                    to={button.to}
                    color="inherit"
                  >
                    {button.text}
                  </Button>
                );
              })
            : ""}
          {localStorage.getItem("token") ? (
            <Button color="inherit" data-testid={"logout-btn"} onClick={logout}>
              Logout
            </Button>
          ) : (
            ""
          )}
          <nav>
            <input
              type="checkbox"
              id="theme-toggle"
              onChange={handleThemeToggle}
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
