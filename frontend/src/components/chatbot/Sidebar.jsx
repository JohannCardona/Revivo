import React from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Sidebar({
  setIsNewChat,
  close,
  setClose,
  conversationTitles,
  setFetchedConversation,
  setFetchedConversations,
  fetchedConversation,
  setConversations,
}) {
  const fetching_user_conversations = async (chat_title) => {
    await axios
      .get(`http://localhost:5000/fetching_user_conversations/${chat_title}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.result === null) {
        } else {
          setFetchedConversation(true);
          setFetchedConversations(response?.data?.result?.conversations);
        }
      });
  };

  const newChat = () => {
    setIsNewChat(true);
    if (!fetchedConversation) {
      setTimeout(() => {
        setConversations("");
      }, 300);
    } else {
      setFetchedConversation(false);
      setFetchedConversations("");
    }
    setIsNewChat(false);
  };

  return (
    <>
      <aside className={`sidemenu ${close ? "close" : "open"}`}>
        {!close ? (
          <>
            <div className="new-chatbot-container">
              <div className="sidemenu-button" onClick={newChat}>
                <span>
                  <AddIcon
                    style={{ fontSize: "1.1rem", color: "var(--sidebar-text)" }}
                  />
                </span>
                New chat
              </div>
              <span className="close-button">
                <Tooltip title="Close sidebar">
                  <MenuIcon
                    style={{ fontSize: "1.5rem", color: "var(--sidebar-text)" }}
                    onClick={() => setClose(true)}
                  />
                </Tooltip>
              </span>
            </div>
            <div className="divider"></div>
            <div className="chat-history">
              {conversationTitles.length === 0 ? (
                <div className="sidemenu-chat">New conversation</div>
              ) : (
                conversationTitles.map((item, index) => (
                  <div
                    key={index}
                    className="sidemenu-chat"
                    onClick={() => fetching_user_conversations(item.title)}
                  >
                    {item.title}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <span className="open-button">
            <Tooltip title="Open sidebar">
              <MenuIcon
                style={{ fontSize: "1.5rem", color: "var(--sidebar-text)" }}
                onClick={() => setClose(false)}
              />
            </Tooltip>
          </span>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
