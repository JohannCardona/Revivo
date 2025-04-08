import axios from "axios";

export const store_tip = (user, currentTip, tipCategory) => {
  return axios
    .post(
      `http://localhost:5000/store_tip/${tipCategory}`,
      {
        user,
        currentTip,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
};
