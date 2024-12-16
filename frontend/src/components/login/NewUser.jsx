import React, { useState } from "react";
import login from "../../images/secure_login.svg";
import "../../styles/login/ChangePassword.css";
import "../../styles/login/RegisterLogin.css";
import Swal from "sweetalert2";

function NewUser({ onRegister }) {
  const [newUser, setNewUser] = useState("");

  const fireAlert = (response, type, color) => {
    Swal.fire({
      title: response.data.result,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    });
  };

  const handleUserRegister = (e) => {
    e.preventDefault();
    if (newUser.trim() === "") {
      fireAlert("Username must not be empty", "error", "red");
    }
    onRegister(newUser);
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
              className="registerlogin-btn"
              onClick={handleUserRegister}
            />
          </form>
        </div>
      </div>

      <div className="new-panels-container">
        <div className="new-panel new-left-panel">
          <div className="new-panel-content">
            <h3>Have you forgotten your password?</h3>
            <p>
              No problem. Enter your email address and we'll send you an email
              to reset your password.
            </p>
          </div>
          <img src={login} className="image" alt="sign in logo" />
        </div>
      </div>
    </div>
  );
}

export default NewUser;
