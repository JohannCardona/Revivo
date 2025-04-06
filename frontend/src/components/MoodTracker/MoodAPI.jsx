import axios from "axios";

export const get_moods = () => {
  return axios.get("http://localhost:5000/fetch_user_moods", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
