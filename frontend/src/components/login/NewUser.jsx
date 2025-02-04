import React, { useState } from "react";
import login from "../../images/signup4.svg";
import "../../styles/login/ChangePassword.css";
import "../../styles/login/RegisterLogin.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewUser() {
  const [newUser, setNewUser] = useState("");
  const navigate = useNavigate();

  const fireAlert = (response, type, color) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    });
  };

  const fireAlert1 = (response, type, color) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    }).then(() => {
      navigateToLogin();
    });
  };

  const handleUserRegister = (e) => {
    e.preventDefault();
    if (newUser.trim() === "") {
      fireAlert("Username must not be empty", "error", "red");
      return;
    }
    axios
      .post("http://localhost:5000/register", {
        newUser,
      })
      .then((response) => {
        if (response.status === 201) {
          fireAlert1(
            "That was easy. Let's head to the login.",
            "success",
            "green"
          );
        }
      })
      .catch((error) => {
        Swal.fire({
          title: error.response.data.result,
          confirmButtonText: "OK",
          confirmButtonColor: "#ff0055",
          icon: "error",
        });
      });
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="registerlogin-container">
      <div className="account-forms">
        <div className="new">
          {/* Form that contains new password and confirm password fields */}
          <form className="login" noValidate>
            <h2 className="form-title">Sign up</h2>
            <div className="input">
              <input
                type="text"
                className="username"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            {/* Redirect to login form */}
            <input
              value="Sign up"
              type="submit"
              className="mood-submit"
              onClick={handleUserRegister}
            />
          </form>
        </div>
      </div>

      <div className="new-panels-container">
        <div className="new-panel new-left-panel">
          <div className="new-panel-content">
            <h3>Welcome, let's get started!</h3>
            <p>
              No passwords, no hassle. Just enter a username to start your
              journey.
            </p>
            <p style={{ fontWeight: "bold", fontStyle: "italic", fontSize: 16, color: "white" }}>
              Click here if you are an existing user?{" "}
              <button
                style={{ marginLeft: 20 }}
                className="image-button"
                id="sign-in-btn"
                onClick={navigateToLogin}
              >
                Sign in
              </button>
            </p>
          </div>
          <img
            src={login}
            style={{ width: "60%", marginTop: 20 }}
            className="image"
            alt="register logo"
          />
        </div>
      </div>
    </div>
  );
}

export default NewUser;
