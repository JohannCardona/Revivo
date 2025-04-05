import React from "react";
import { Button, Tooltip } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

function UserInputs({ setPrompt, handleConversationSubmit }) {
  return (
    <div className="item-2">
      <div className="user-item user-text-container">
        <textarea
          rows="1"
          placeholder="Message Revivo bot"
          className="text-box"
          value={prompt}
          style={{ resize: "none" }}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConversationSubmit(e);
          }}
        />
      </div>
      <div className="user-item mic"></div>
      <div className="user-item">
        <Tooltip title="Send">
          <Button
            style={{
              backgroundColor: "var(--image-button)",
              padding: "12px 10px",
              borderRadius: 8,
              paddingLeft: 3,
              marginRight: 8,
            }}
            variant="contained"
            endIcon={<SendRoundedIcon style={{ color: "var(--text)" }} />}
            onClick={handleConversationSubmit}
          ></Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default UserInputs;
