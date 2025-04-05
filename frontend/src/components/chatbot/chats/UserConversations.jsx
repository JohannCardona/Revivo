import axios from "axios";

export const fetch_conversation_titles = async (setConversationTitles) => {
      await axios
        .get(`http://localhost:5000/fetch_conversation_titles/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setConversationTitles(response.data.titles);
          }
        });
    };