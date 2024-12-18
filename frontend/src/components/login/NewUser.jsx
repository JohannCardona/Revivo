import React, { useState } from "react";
import login from "../../images/secure_login.svg";
import "../../styles/login/ChangePassword.css";
import "../../styles/login/RegisterLogin.css";
import Swal from "sweetalert2";

function NewUser({ onRegister, switchToSignIn }) {
  const [newUser, setNewUser] = useState("");

  const fireAlert = (response, type, color) => {
    Swal.fire({
      title: response,
      confirmButtonText: "OK",
      confirmButtonColor: color,
      icon: type,
    });
  };

  const handleUserRegister = (e) => {
    e.preventDefault();
    if (newUser.trim() === "") {
      fireAlert("Username must not be empty", "error", "red");
      return;
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
          <p>
            Existing user?{" "}
            <button onClick={switchToSignIn}>Sign in</button>
          </p>
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
          </div>
          <img src={login} className="image" alt="sign in logo" />
        </div>
      </div>
    </div>
  );
}

export default NewUser;
