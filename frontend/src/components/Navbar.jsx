import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import revivo from "../images/Logo1.png";

function Navbar() {
  const navigate = useNavigate();
  const buttons = [
    { text: "Chatbot", to: "/chat" },
    { text: "Dashboard", to: "/dashboard" },
    { text: "ArtStyling", to: "/art_styling" },
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
      navigate("/");
    });
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: "#50a081" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <NavLink to="/">
              <img
                style={{
                  width: 110,
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
          {buttons.map((button) => {
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
          })}
          {localStorage.getItem("token") ? (
            <Button color="inherit" data-testid={"logout-btn"} onClick={logout}>
              Logout
            </Button>
          ) : (
            ""
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
