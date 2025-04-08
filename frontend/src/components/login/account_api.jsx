import Swal from "sweetalert2";
import axios from "axios";

const fireAlert = (response, type, color) => {
  Swal.fire({
    title: response,
    confirmButtonText: "OK",
    confirmButtonColor: color,
    icon: type,
  });
};

const fireAlertSignUp = (response, type, color, navigateToLogin) => {
  Swal.fire({
    title: response,
    confirmButtonText: "OK",
    confirmButtonColor: color,
    icon: type,
  }).then(() => {
    navigateToLogin();
  });
};

const fireAlertSignin = (response, type, color, navigateToChat) => {
  Swal.fire({
    title: response,
    confirmButtonText: "OK",
    confirmButtonColor: color,
    icon: type,
  }).then(() => {
    navigateToChat();
  });
};

export const handleUserRegister = (newUser, navigateToLogin) => {
  if (newUser.trim() === "") {
    fireAlert("Username must not be empty", "error", "red");
    return;
  }
  return axios
    .post(`${process.env.REACT_APP_BASE_URI}/register`, {
      newUser,
    })
    .then((response) => {
      if (response.status === 201) {
        fireAlertSignUp(
          "That was easy. Let's head to the login.",
          "success",
          "green",
          navigateToLogin
        );
      }
    })
    .catch((error) => {
      const error_msg = error.response?.data?.result || error.message;
      Swal.fire({
        title: error_msg,
        confirmButtonText: "OK",
        confirmButtonColor: "#ff0055",
        icon: "error",
      });
    });
};

export const handleUserSignIn = (existingUser, navigateToChat) => {
  if (existingUser.trim() === "") {
    fireAlert("Username must not be empty", "error", "red");
    return;
  }
  return axios
    .post(`${process.env.REACT_APP_BASE_URI}/login`, {
      existingUser,
    })
    .then((response) => {
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("user", existingUser);
        localStorage.setItem("token", token);
        fireAlertSignin(
          "You're in. Let's start the conversation.",
          "success",
          "green",
          navigateToChat
        );
        console.log("Token:", token);
        return token;
      }
    })
    .catch((error) => {
      const error_msg = error.response?.data?.result || error.message;
      Swal.fire({
        title: error_msg,
        confirmButtonText: "OK",
        confirmButtonColor: "#ff0055",
        icon: "error",
      });
    });
};
