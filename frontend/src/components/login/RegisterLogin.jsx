import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "../../styles/login/RegisterLogin.css";
import loginLogo from "../../images/secure_login.svg";
// import registerLogo from "../../images/register.svg";


function RegisterLogin() {
  const navigate = useNavigate();

  const [register, setRegister] = useState(false);

  // info for account registration
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  // account login info
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const registerClick = () => {
    setRegister(true);
  };

  const loginClick = () => {
    setRegister(false);
  };

  const userRegister = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/register", {
        firstName,
        lastName,
        username,
        dob,
        phone,
        email,
        password1,
        password2,
      })
      .then((response) => {
        if (response.status === 201) {
          Swal.fire({
            title: response.data.result,
            confirmButtonText: "OK",
            confirmButtonColor: "#5995fd",
            icon: "success",
          }).then(() => {
            localStorage.setItem("email", email);
            navigate("/verify");
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: error.response.data.result,
          confirmButtonText: "OK",
          confirmButtonColor: "#ff0055",
          icon: "error",
        }).then(() => {});
      });
  };

  const userLogin = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", {
        user,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          const jwt_token = response.data.token;
          localStorage.setItem("token", jwt_token);
          Swal.fire({
            title: response.data.result,
            confirmButtonText: "OK",
            confirmButtonColor: "#5995fd",
            icon: "success",
          }).then(() => {
            navigate("/chat");
            setUser("");
            setPassword("");
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: error.response.data.result,
          confirmButtonText: "OK",
          confirmButtonColor: "#ff0055",
          icon: "error",
        }).then(() => {});
      });
  };

  const handleClickEnter = (e) => {
    if (e.key === "Enter") {
      console.log("enter key pressed...");
    }
  };

  return (
    <div
      className={`registerlogin-container ${register ? "sign-up-mode" : ""}`}
    >
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="panel-content">
            <h3>New here ?</h3>
            <p>
              Hello, friend. Please click here to create an account and
              start your journey with us!
            </p>
            <button
              className="registerlogin-btn transparent"
              id="sign-up-btn"
              onClick={registerClick}
            >
              Sign up
            </button>
          </div>
          {/* <img src={registerLogo} className="image" alt="register" /> */}
        </div>

        {/* Panel with link to signin/login form */}
        <div className="panel right-panel">
          <div className="panel-content">
            <h3>Already a member ?</h3>
            <p>
              Welcome back, friend. To keep connected with us please click
              here to login to your account!
            </p>
            <button
              className="registerlogin-btn transparent"
              id="sign-in-btn"
              onClick={loginClick}
            >
              Sign in
            </button>
          </div>
          <img src={loginLogo} className="image" alt="login" />
        </div>
      </div>

      <div className="account-forms">
        <div className="register-login">
          <form noValidate className="login" onKeyDown={handleClickEnter}>
            <h3 className="title">Login</h3>
            <div className="input">
              <input
                type="text"
                className="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Email address..."
              />
            </div>
            <div className="input">
              <input
                type="password"
                className="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..."
              />
            </div>
            <input
              value="Login"
              type="submit"
              className="registerlogin-btn"
              onClick={userLogin}
            />

            <Link to="/forgot_password" className="reset_password">
              Forgot your password?
            </Link>
          </form>

          <form noValidate className="register">
            <h3 className="title">Register</h3>
            <div className="input">
              <input
                type="text"
                className="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name..."
              />
            </div>
            <div className="input">
              <input
                type="text"
                className="surname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name..."
              />
            </div>
            <div className="input">
              <input
                type="text"
                className="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username..."
              />
            </div>
            <div className="input">
              <input
                type="date"
                className="date-of-birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="Date of birth..."
              />
            </div>
            <div className="input">
              <input
                type="text"
                className="telephone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number..."
              />
            </div>
            <div className="input">
              <input
                type="text"
                className="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address..."
              />
            </div>
            <div className="input">
              <input
                type="password"
                className="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                placeholder="Password..."
              />
            </div>
            <div className="input">
              <input
                type="password"
                className="second-password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Confirm password..."
              />
            </div>
            <input
              value="Register"
              type="submit"
              className="registerlogin-btn"
              onClick={userRegister}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterLogin;
