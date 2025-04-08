import axios from "axios";

export const store_tip = (user, currentTip, tipCategory) => {
  return axios.post(
    `${process.env.REACT_APP_BASE_URI}/store_tip/${tipCategory}`,
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
  );
};
