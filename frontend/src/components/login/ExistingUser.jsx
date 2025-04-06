import React, { useState } from "react";
import login from "../../images/secure_login.svg";
import "../../styles/login/InputForms.css";
import "../../styles/login/RegisterLogin.css";
import { useNavigate } from "react-router-dom";
import Banner from "../Banner/MainBanner";
import { handleUserSignIn } from "./account_api";

function ExistingUser() {
  const [existingUser, setExistingUser] = useState("");
  const navigate = useNavigate();

  const goBackToRegister = () => {
    navigate("/");
  };

  const navigateToChat = () => {
    navigate("/chat");
  };

  return (
    <>
      <Banner />
      <div className="registerlogin-container">
        <div className="account-forms">
          <div className="new">
            {/* Form that contains sign in field */}
            <form className="login" noValidate>
              <h2 style={{ color: "var(--text)" }} className="form-title">
                Sign in
              </h2>
              <div className="input">
                <input
                  type="text"
                  className="username"
                  value={existingUser}
                  onChange={(e) => setExistingUser(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              {/* Redirect to chatbot interface */}
              <input
                value="Sign in"
                type="button"
                className="mood-submit"
                onClick={() => handleUserSignIn(existingUser, navigateToChat)}
              />
            </form>
          </div>
        </div>

        <div className="new-panels-container">
          <div className="new-panel new-left-panel">
            <div className="new-panel-content">
              <h3>Good to see you again!</h3>
              <p>Enter your username to connect with your chatbot.</p>
              <p
                style={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "white",
                }}
              >
                Click here if you are a new user?{" "}
                <button
                  style={{ marginLeft: 20 }}
                  className="image-button"
                  id="sign-up-btn"
                  onClick={goBackToRegister}
                >
                  Sign up
                </button>
              </p>
            </div>
            <img
              style={{ width: "100%", marginTop: 1 }}
              src={login}
              className="image"
              alt="sign in logo"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ExistingUser;
