import axios from "axios";

export const get_moods = () => {
  return axios.get(`${process.env.REACT_APP_BASE_URI}/fetch_user_moods`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const storeUserMoods = (userMoods) => {
  return axios.post(
    `${process.env.REACT_APP_BASE_URI}/store_user_moods`,
    userMoods,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};
