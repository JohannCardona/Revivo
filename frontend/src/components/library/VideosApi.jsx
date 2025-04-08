import axios from "axios";

export const fetchVideoCollection = () => {
  return axios.get(`${process.env.REACT_APP_BASE_URI}/videos`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
