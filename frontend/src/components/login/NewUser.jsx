import React, { useState } from "react";
import login from "../../images/signup4.svg";
import "../../styles/login/InputForms.css";
import "../../styles/login/RegisterLogin.css";
import { useNavigate } from "react-router-dom";
import Banner from "../Banner/MainBanner";
import { handleUserRegister } from "./account_api";

function NewUser() {
  const [newUser, setNewUser] = useState("");
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Banner />
      <div className="registerlogin-container">
        <div className="account-forms">
          <div className="new">
            {/* Form sign up fields */}
            <form className="login" noValidate>
              <h2 style={{ color: "var(--text)" }} className="form-title">
                Sign up
              </h2>
              <div className="input">
                <input
                  type="text"
                  className="username"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <input
                value="Sign up"
                type="submit"
                className="mood-submit"
                onClick={() => handleUserRegister(newUser, navigateToLogin)}
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
              <p
                style={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "white",
                }}
              >
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
              style={{ width: "54%", marginTop: 1 }}
              className="image"
              alt="register logo"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default NewUser;
