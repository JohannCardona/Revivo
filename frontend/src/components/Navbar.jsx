import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import revivo from "../images/revivo_logo.png";
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
    { text: "Mood Tracker", to: "/mood" },
  ];

  const menus = [
    {
      title: "Usage",
      links: [
        { text: "Dashboard", to: "/dashboard" },
        { text: "Badges", to: "/badges" },
      ],
    },
    {
      title: "Library",
      links: [
        { text: "Thrive Tips", to: "/tips" },
        { text: "Soothing Sounds", to: "/audios" },
        { text: "Videos", to: "/library" },
      ],
    },
  ];

  const [anchor, setAnchor] = useState(null);
  const [active, setActive] = useState(null);

  const menuOpen = (e, menu) => {
    setAnchor(e.currentTarget);
    setActive(menu);
  };

  const menuClose = () => {
    setAnchor(null);
    setActive(null);
  };

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
        <Toolbar style={{ backgroundColor: "var(--navbar)", borderBottom: "2px solid white", boxShadow: "rgba(0, 0, 0, 0.6)" }}>
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
          >
            About
          </Button>
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
          {localStorage.getItem("token")
            ? menus.map((menu) => {
                return (
                  <>
                    <Button
                      onClick={(e) => menuOpen(e, menu.title)}
                      color="inherit"
                      style={{ cursor: "pointer" }}
                    >
                      {menu.title}
                    </Button>
                    <Menu
                      anchorEl={anchor}
                      open={active === menu.title}
                      onClick={menuClose}
                      color="#fff"
                      style={{ cursor: "pointer" }}
                    >
                      {menu.links.map((link) => (
                        <MenuItem
                          key={link.text}
                          component={Link}
                          to={link.to}
                          onClick={menuClose}
                          color="inherit"
                          style={{ cursor: "pointer" }}
                        >
                          {link.text}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
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
