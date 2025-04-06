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

const fireAlert1 = (response, type, color, navigateToLogin) => {
  Swal.fire({
    title: response,
    confirmButtonText: "OK",
    confirmButtonColor: color,
    icon: type,
  }).then(() => {
    navigateToLogin();
  });
};

export const handleUserRegister = (newUser, navigateToLogin) => {
  if (newUser.trim() === "") {
    fireAlert("Username must not be empty", "error", "red");
    return;
  }
  return axios
    .post("http://localhost:5000/register", {
      newUser,
    })
    .then((response) => {
      if (response.status === 201) {
        fireAlert1(
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
