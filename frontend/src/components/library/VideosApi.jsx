import axios from "axios";

export const fetchVideoCollection = () => {
  return axios.get("http://localhost:5000/videos", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
