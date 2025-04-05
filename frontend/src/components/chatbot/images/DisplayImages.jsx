import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IoCloudDownloadOutline } from "react-icons/io5";

function DisplayImages({
  conversation,
  setClickedImage,
  clickedImage,
  modalClose,
  downloadDALLEImage,
}) {
  return (
    <div>
      <div key={conversation.id} id={conversation.id}>
        <img
          id={conversation.id}
          src={conversation.response}
          onClick={() => setClickedImage(conversation.response)}
          alt="chat icon"
        />
        {clickedImage && (
          <div
            key={conversation.id}
            id={conversation.id}
            className="modal-container"
          >
            <div className="modal-image">
              <CloseIcon
                sx={{ fontSize: 40 }}
                onClick={() => modalClose(conversation.response)}
              />
            </div>
            <div
              key={conversation.id}
              id={conversation.id}
              className="download-container"
            >
              <button onClick={() => downloadDALLEImage(clickedImage)}>
                <IoCloudDownloadOutline sx={{ fontSize: 50 }} />
              </button>
              <img id={conversation.id} src={clickedImage} alt="enlarged" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DisplayImages;
