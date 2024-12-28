import React, { useState } from "react";
import login from "../../images/secure_login.svg";
import "../../styles/login/ChangePassword.css";
import "../../styles/login/RegisterLogin.css";
import Swal from "sweetalert2";
import axios from "axios";

function ExistingUser({ newUser, onSignIn, switchToRegister }) {
  const [existingUser, setExistingUser] = useState("");

  const fireAlert = (response, type, color) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    });
  };

  const fireAlert1 = (response, type, color, existingUser) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    }).then(() => {
      onSignIn(existingUser);
    });
  };

  const handleUserSignIn = (e) => {
    e.preventDefault();
    if (existingUser.trim() === "") {
      fireAlert("Username must not be empty", "error", "red");
    }
    // if ((newUser && existingUser === newUser) || localStorage.getItem("user")) {
    else {
      axios
        .post("http://localhost:5000/login", {
          existingUser,
        })
        .then((response) => {
          if (response.status === 200) {
            const jwt_token = response.data.token;
            localStorage.setItem("user", existingUser);
            localStorage.setItem("token", jwt_token);
            fireAlert1(
              "You're in. Let's start the conversation.",
              "success",
              "green",
              existingUser
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
    }
    // }
    // } else {
    //   fireAlert("Username does not match our records", "error", "red");
    // }
  };

  return (
    <div className="registerlogin-container">
      <div className="account-forms">
        <div className="new">
          {/* Form that contains new password and confirm password fields */}
          <form className="login" noValidate>
            <h2 className="form-title">Sign in</h2>
            <div className="input">
              <input
                type="text"
                className="username"
                value={existingUser}
                onChange={(e) => setExistingUser(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            {/* Redirect to login form */}
            <input
              value="Sign in"
              type="submit"
              className="registerlogin-btn"
              onClick={handleUserSignIn}
            />
          </form>
          <p>
            New user? <button onClick={switchToRegister}>Sign up</button>
          </p>
        </div>
      </div>

      <div className="new-panels-container">
        <div className="new-panel new-left-panel">
          <div className="new-panel-content">
            <h3>Good to see you again!</h3>
            <p>Enter your username to connect with your chatbot.</p>
          </div>
          <img src={login} className="image" alt="sign in logo" />
        </div>
      </div>
    </div>
  );
}

export default ExistingUser;
